type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const ACCESS_KEY = 'ecomeal.accessToken';
const REFRESH_KEY = 'ecomeal.refreshToken';

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: AuthTokens) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
