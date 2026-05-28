export default function AnalyticsPage() {
  return (
    <main className="space-y-6">
      <section className="glass p-6">
        <h2 className="text-lg font-semibold">Inventory Trends</h2>
        <p className="text-sm text-slate-400">Charts and performance metrics will render here.</p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass p-6">Waste trend chart placeholder</div>
        <div className="glass p-6">Expiry risk chart placeholder</div>
      </section>
    </main>
  );
}
