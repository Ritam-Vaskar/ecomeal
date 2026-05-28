'use client';

import { useEffect, useState } from 'react';
import { safeFetch } from '@/lib/api';

type AiResult = {
  specials: Array<{
    title: string;
    description: string;
    ingredients: string[];
    priority: string;
  }>;
  priority: string[];
};

export default function AiPage() {
  const [ingredients, setIngredients] = useState('Mushroom, Paneer, Tomato');
  const [unstable, setUnstable] = useState(true);
  const [result, setResult] = useState<AiResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'queued' | 'error'>('idle');
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    setStatus('queued');

    const id = window.setInterval(async () => {
      try {
        const data = await safeFetch<{
          status: string;
          result: AiResult | null;
        }>(`/ai/jobs/${jobId}`);
        if (data.status === 'completed' && data.result) {
          setResult(data.result);
          setStatus('idle');
          setJobId(null);
        }
        if (data.status === 'failed') {
          setError('AI job failed after retries.');
          setStatus('error');
          setJobId(null);
        }
      } catch (err) {
        setError('Unable to check AI job status.');
        setStatus('error');
        setJobId(null);
      }
    }, 2000);

    return () => window.clearInterval(id);
  }, [jobId]);

  async function handleGenerate() {
    const list = ingredients
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (list.length === 0) {
      setError('Add at least one ingredient.');
      return;
    }
    setError('');
    setStatus('loading');
    setResult(null);

    try {
      const data = await safeFetch<
        | ({ status: 'queued'; jobId: string })
        | ({ status: 'ok' } & AiResult)
      >('/ai/recommendations', {
        method: 'POST',
        body: JSON.stringify({ ingredients: list, unstable }),
      });

      if ('jobId' in data) {
        setJobId(data.jobId);
        setStatus('queued');
        return;
      }

      setResult(data);
      setStatus('idle');
    } catch (err) {
      setError('Unable to generate recommendations.');
      setStatus('error');
    }
  }

  return (
    <main className="space-y-6">
      <section className="glass p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Chef Specials Studio</h2>
          <p className="text-sm text-slate-400">
            Generate AI-powered specials from expiring ingredients.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm"
            placeholder="Mushroom, Paneer, Tomato"
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
          />
          <button
            onClick={handleGenerate}
            className="rounded-xl bg-ember-500 px-5 py-2 text-sm font-semibold text-ink-950 hover:bg-ember-400 transition"
          >
            {status === 'loading' ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={unstable}
            onChange={(event) => setUnstable(event.target.checked)}
          />
          Simulate unstable AI responses
        </label>
        {status === 'queued' && (
          <p className="text-sm text-slate-300">Job queued. Retrying in background…</p>
        )}
        {error && <p className="text-sm text-ember-400">{error}</p>}
      </section>

      <section className="glass p-6 space-y-4">
        <h3 className="text-lg font-semibold">Recommendations</h3>
        {!result ? (
          <p className="text-sm text-slate-400">No recommendations yet.</p>
        ) : (
          <div className="space-y-4">
            {result.specials.map((special) => (
              <div key={special.title} className="rounded-2xl border border-ink-700 p-4">
                <h4 className="text-base font-semibold text-slate-100">{special.title}</h4>
                <p className="text-sm text-slate-400">{special.description}</p>
                <div className="mt-2 text-xs text-mint-300">
                  Priority: {special.priority}
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-ink-700 p-4 text-sm text-slate-300">
              Use next: {result.priority.join(', ')}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
