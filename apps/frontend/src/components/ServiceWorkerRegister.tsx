'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        if ('sync' in registration) {
          registration.sync.register('ecomeal-sync').catch(() => undefined);
        }
      })
      .catch(() => undefined);

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'ECOMEAL_SYNC') {
        window.dispatchEvent(new Event('ecomeal:sync'));
      }
    };

    navigator.serviceWorker.addEventListener('message', handler);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handler);
    };
  }, []);

  return null;
}
