'use client';

import { useEffect, useMemo, useState } from 'react';
import { safeFetch } from '@/lib/api';

type AnalyticsData = {
  wasteTrend: number[];
  expiryRisk: number[];
  lowStock: number;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    safeFetch<AnalyticsData>('/analytics')
      .then(setData)
      .catch(() => setError('Unable to load analytics right now.'));
  }, []);

  const wasteMax = useMemo(() => Math.max(...(data?.wasteTrend ?? [1])), [data]);
  const expiryMax = useMemo(() => Math.max(...(data?.expiryRisk ?? [1])), [data]);

  return (
    <main className="space-y-6">
      <section className="glass p-6 space-y-2">
        <h2 className="text-lg font-semibold">Inventory Trends</h2>
        <p className="text-sm text-slate-400">
          Snapshot of waste risk, expiry exposure, and low-stock pressure.
        </p>
        {error && <p className="text-sm text-ember-400">{error}</p>}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <MetricCard label="Low Stock Alerts" value={`${data?.lowStock ?? 0}`} />
        <MetricCard label="Waste Risk Index" value={score(data?.wasteTrend)} />
        <MetricCard label="Expiry Exposure" value={score(data?.expiryRisk)} />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <ChartCard title="Waste Trend" values={data?.wasteTrend ?? []} max={wasteMax} />
        <ChartCard title="Expiry Risk" values={data?.expiryRisk ?? []} max={expiryMax} />
      </section>
    </main>
  );
}

function score(values?: number[]) {
  if (!values || values.length === 0) return '—';
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return `${avg.toFixed(1)}`;
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function ChartCard({ title, values, max }: { title: string; values: number[]; max: number }) {
  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 flex items-end gap-3 h-32">
        {values.length === 0 ? (
          <p className="text-sm text-slate-400">No data yet.</p>
        ) : (
          values.map((value, idx) => (
            <div key={`${title}-${idx}`} className="flex-1">
              <div
                className="rounded-lg bg-ember-500/80"
                style={{ height: `${Math.max(10, (value / max) * 100)}%` }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
