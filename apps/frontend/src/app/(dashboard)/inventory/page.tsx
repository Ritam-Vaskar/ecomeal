export default function InventoryPage() {
  return (
    <main className="space-y-6">
      <section className="glass p-6 flex flex-wrap items-center gap-3">
        <input
          className="flex-1 min-w-[200px] rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm"
          placeholder="Search ingredients, suppliers, categories"
        />
        <select className="rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-2 text-sm">
          <option>All categories</option>
          <option>Produce</option>
          <option>Dairy</option>
          <option>Pantry</option>
        </select>
        <button className="rounded-xl bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-ember-400 transition">
          Add item
        </button>
      </section>
      <section className="glass p-6">
        <p className="text-slate-300 text-sm">Inventory list, filters, and pagination will render here.</p>
      </section>
    </main>
  );
}
