'use client';

import { useEffect, useMemo, useState } from 'react';
import InventoryTable, { type InventoryRow } from '@/components/InventoryTable';
import useOnline from '@/hooks/useOnline';
import { safeFetch } from '@/lib/api';
import { enqueueAction, flushQueue, getQueue } from '@/lib/offlineQueue';

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  supplier: string;
  status: string;
};

const CACHE_KEY = 'ecomeal.inventory.cache';

export default function InventoryPage() {
  const online = useOnline();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [form, setForm] = useState({
    name: '',
    category: 'Produce',
    quantity: '1',
    unit: 'kg',
    expiryDate: '',
    supplier: '',
  });

  const rows = useMemo<InventoryRow[]>(() => {
    return items.map((item) => ({
      id: item.id,
      item: item.name,
      category: item.category,
      stock: `${item.quantity} ${item.unit}`,
      expiry: formatExpiry(item.expiryDate),
      supplier: item.supplier,
      status: item.status,
    }));
  }, [items]);

  async function loadInventory() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
      });
      if (search.trim()) params.set('search', search.trim());
      if (category !== 'all') params.set('category', category);

      const data = await safeFetch<{ items: InventoryItem[] }>(`/inventory?${params}`);
      setItems(data.items);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data.items));
    } catch (err) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setItems(JSON.parse(cached) as InventoryItem[]);
      } else {
        setError('Unable to load inventory right now.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function syncQueue() {
    if (!online || getQueue().length === 0) return;
    await flushQueue(async (item) => {
      await safeFetch(item.path, {
        method: item.method,
        body: JSON.stringify(item.body),
      });
    });
    await loadInventory();
  }

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    syncQueue();
  }, [online]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadInventory();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, category]);

  async function handleAddItem() {
    if (!form.name.trim() || !form.supplier.trim() || !form.expiryDate) {
      setError('Please fill in the required fields.');
      return;
    }
    setError('');
    const payload = {
      name: form.name.trim(),
      category: form.category,
      quantity: Number(form.quantity || 0),
      unit: form.unit.trim() || 'unit',
      expiryDate: new Date(form.expiryDate).toISOString(),
      supplier: form.supplier.trim(),
    };

    const optimistic: InventoryItem = {
      id: `tmp_${Date.now()}`,
      status: 'queued',
      ...payload,
    };
    setItems((prev) => [optimistic, ...prev]);
    setShowForm(false);
    setForm({ name: '', category: 'Produce', quantity: '1', unit: 'kg', expiryDate: '', supplier: '' });

    if (!online) {
      enqueueAction({
        id: optimistic.id,
        path: '/inventory',
        method: 'POST',
        body: payload,
      });
      return;
    }

    try {
      await safeFetch('/inventory', { method: 'POST', body: JSON.stringify(payload) });
      await loadInventory();
    } catch (err) {
      enqueueAction({
        id: optimistic.id,
        path: '/inventory',
        method: 'POST',
        body: payload,
      });
    }
  }

  return (
    <main className="space-y-6">
      <section className="glass p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="flex-1 min-w-[220px] rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm"
            placeholder="Search ingredients, suppliers, categories"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            <option value="Produce">Produce</option>
            <option value="Dairy">Dairy</option>
            <option value="Pantry">Pantry</option>
          </select>
          <button
            className="rounded-xl bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-ember-400 transition"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? 'Close' : 'Add item'}
          </button>
        </div>

        {showForm && (
          <div className="grid gap-3 md:grid-cols-3">
            <input
              className="rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm"
              placeholder="Ingredient name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <input
              className="rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm"
              placeholder="Supplier"
              value={form.supplier}
              onChange={(event) => setForm({ ...form, supplier: event.target.value })}
            />
            <input
              type="date"
              className="rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm"
              value={form.expiryDate}
              onChange={(event) => setForm({ ...form, expiryDate: event.target.value })}
            />
            <select
              className="rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              <option>Produce</option>
              <option>Dairy</option>
              <option>Pantry</option>
              <option>Protein</option>
            </select>
            <input
              type="number"
              min="0"
              className="rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(event) => setForm({ ...form, quantity: event.target.value })}
            />
            <input
              className="rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm"
              placeholder="Unit"
              value={form.unit}
              onChange={(event) => setForm({ ...form, unit: event.target.value })}
            />
            <button
              className="rounded-xl bg-mint-400 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-mint-300 transition"
              onClick={handleAddItem}
            >
              Save item
            </button>
          </div>
        )}

        {error && <p className="text-sm text-ember-400">{error}</p>}
        {!online && (
          <p className="text-xs text-slate-400">
            Offline mode: updates will sync automatically when connectivity returns.
          </p>
        )}
      </section>

      <section>
        {loading ? (
          <div className="glass p-6">
            <p className="text-slate-300 text-sm">Loading inventory...</p>
          </div>
        ) : (
          <InventoryTable rows={rows} />
        )}
      </section>
    </main>
  );
}

function formatExpiry(isoDate: string) {
  const diff = new Date(isoDate).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (Number.isNaN(days)) return 'Unknown';
  if (days < 0) return 'Expired';
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  return `${days} days`;
}
