export default function Topbar() {
  return (
    <header className="flex items-center justify-between glass px-6 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Today</p>
        <h1 className="text-2xl font-semibold">Inventory Control Center</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-ink-700 px-3 py-1 text-xs text-slate-200">Kitchen Manager</div>
        <div className="h-10 w-10 rounded-full bg-ember-500/70 flex items-center justify-center text-ink-950 font-semibold">
          KM
        </div>
      </div>
    </header>
  );
}
