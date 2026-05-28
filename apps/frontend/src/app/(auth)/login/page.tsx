'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { safeFetch } from '@/lib/api';
import { setTokens } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
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
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setTokens(data);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <section className="glass w-full max-w-md p-8">
        <div className="space-y-2">
          <p className="text-ember-400 text-sm uppercase tracking-[0.3em]">Ecomeal</p>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-slate-400">Sign in to control your kitchen intelligence.</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              placeholder="you@restaurant.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ember-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ember-500"
            />
          </div>
          {error && <p className="text-sm text-ember-400">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-ember-500 py-3 text-sm font-semibold text-ink-950 hover:bg-ember-400 transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
