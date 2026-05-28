import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.accessToken;
}

function buildHeaders(init?: RequestInit) {
  const accessToken = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(init?.headers || {}),
  } as HeadersInit;
}

export async function safeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const method = (init?.method ?? 'GET').toUpperCase();
  const maxAttempts = method === 'GET' ? 2 : 1;

  try {
    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        let res = await fetch(`${API_URL}${path}`, {
          ...init,
          signal: controller.signal,
          headers: buildHeaders(init),
        });

        if (res.status === 401 && getRefreshToken()) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            res = await fetch(`${API_URL}${path}`, {
              ...init,
              signal: controller.signal,
              headers: buildHeaders(init),
            });
          }
        }

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        return (await res.json()) as T;
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
          continue;
        }
      }
    }

    throw lastError;
  } finally {
    clearTimeout(timeout);
  }
}
