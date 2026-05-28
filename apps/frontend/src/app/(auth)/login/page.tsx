export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <section className="glass w-full max-w-md p-8">
        <div className="space-y-2">
          <p className="text-ember-400 text-sm uppercase tracking-[0.3em]">Ecomeal</p>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-slate-400">Sign in to control your kitchen intelligence.</p>
        </div>
        <form className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              placeholder="you@restaurant.com"
              className="w-full rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ember-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl bg-ink-900/70 border border-ink-700 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ember-500"
            />
          </div>
          <button className="w-full rounded-xl bg-ember-500 py-3 text-sm font-semibold text-ink-950 hover:bg-ember-400 transition">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
