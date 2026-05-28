'use client';

import { useEffect, useState } from 'react';
import useOnline from '@/hooks/useOnline';
import { getQueue } from '@/lib/offlineQueue';

export default function OfflineBanner() {
  const online = useOnline();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(getQueue().length);
    update();
    const id = window.setInterval(update, 2000);
    window.addEventListener('storage', update);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('storage', update);
    };
  }, []);

  if (online && count === 0) return null;

  return (
    <div className="rounded-2xl border border-ink-700/70 bg-ink-800/70 px-4 py-3 text-sm text-slate-200">
      {online ? (
        <span>{count} queued updates pending sync.</span>
      ) : (
        <span>Offline mode active. {count} updates queued.</span>
      )}
    </div>
  );
}
