import InventoryTable from '@/components/InventoryTable';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
  return (
    <main className="space-y-6">
      <section className="grid gap-6 md:grid-cols-3">
        <StatCard label="Inventory Health" value="92%" trend="Up 4% this week" />
        <StatCard label="Expiring Soon" value="18 items" trend="5 need action" />
        <StatCard label="Waste Risk" value="$1,240" trend="Down 11%" />
      </section>
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <InventoryTable />
        <div className="glass p-6 space-y-4">
          <h3 className="text-lg font-semibold">Chef Specials</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-xl border border-ink-700 p-4">
              <p className="text-slate-100 font-medium">Forest Mushroom Risotto</p>
              <p className="text-slate-400">Use mushrooms, spinach, parmesan, veg stock.</p>
            </div>
            <div className="rounded-xl border border-ink-700 p-4">
              <p className="text-slate-100 font-medium">Paneer Tikka Flatbread</p>
              <p className="text-slate-400">Uses paneer, tomato, herbs, lemon.</p>
            </div>
          </div>
          <button className="w-full rounded-xl bg-ember-500 py-2 text-sm font-semibold text-ink-950 hover:bg-ember-400 transition">
            Generate new specials
          </button>
        </div>
      </section>
    </main>
  );
}
