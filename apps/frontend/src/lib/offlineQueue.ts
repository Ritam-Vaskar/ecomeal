type QueueItem = {
  id: string;
  path: string;
  method: string;
  body?: unknown;
};

const STORAGE_KEY = 'ecomeal.queue';

export function enqueue(item: QueueItem) {
  const existing = getQueue();
  existing.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getQueue(): QueueItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as QueueItem[]) : [];
}

export function clearQueue() {
  localStorage.removeItem(STORAGE_KEY);
}
