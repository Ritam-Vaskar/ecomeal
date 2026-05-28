'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { safeFetch } from '@/lib/api';
import { setTokens } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await safeFetch<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role: 'manager' }),
      });
      setTokens(data);
      router.push('/dashboard');
    } catch (err) {
      setError('Unable to create account right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <section className="glass w-full max-w-md p-8">
        <div className="space-y-2">
          <p className="text-ember-400 text-sm uppercase tracking-[0.3em]">Ecomeal</p>
          <h1 className="text-3xl font-semibold">Create your workspace</h1>
          <p className="text-slate-400">Start reducing food waste today.</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Restaurant name</label>
            <input
              type="text"
              placeholder="Sunset Bistro"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mint-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              placeholder="you@restaurant.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mint-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mint-400"
            />
          </div>
          {error && <p className="text-sm text-ember-400">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-mint-400 py-3 text-sm font-semibold text-ink-950 hover:bg-mint-300 transition disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
}
