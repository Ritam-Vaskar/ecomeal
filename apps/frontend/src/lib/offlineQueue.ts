export type QueueItem = {
  id: string;
  path: string;
  method: string;
  body?: unknown;
  createdAt: number;
  retries: number;
};

const STORAGE_KEY = 'ecomeal.queue';

function saveQueue(items: QueueItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getQueue(): QueueItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as QueueItem[]) : [];
}

export function enqueueAction(item: Omit<QueueItem, 'createdAt' | 'retries'>) {
  const existing = getQueue();
  existing.push({ ...item, createdAt: Date.now(), retries: 0 });
  saveQueue(existing);
}

export function removeQueueItem(id: string) {
  const existing = getQueue().filter((item) => item.id !== id);
  saveQueue(existing);
}

export function queueSize() {
  return getQueue().length;
}

export async function flushQueue(
  sender: (item: QueueItem) => Promise<void>,
  maxRetries = 5,
) {
  const items = getQueue();
  const remaining: QueueItem[] = [];
  let sent = 0;

  for (const item of items) {
    try {
      await sender(item);
      sent += 1;
    } catch (error) {
      const next = { ...item, retries: item.retries + 1 };
      if (next.retries < maxRetries) {
        remaining.push(next);
      }
    }
  }

  saveQueue(remaining);
  return { sent, remaining: remaining.length };
}
