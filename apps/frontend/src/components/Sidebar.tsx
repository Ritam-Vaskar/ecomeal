import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/ai', label: 'Chef Specials' },
  { href: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 glass p-6">
      <div className="space-y-1">
        <p className="text-ember-400 text-xs uppercase tracking-[0.4em]">Ecomeal</p>
        <h2 className="text-xl font-semibold">Kitchen Ops</h2>
      </div>
      <nav className="mt-10 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-4 py-3 text-sm text-slate-200 hover:bg-ink-700/60 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-10 text-xs text-slate-500">Offline-ready · v0.1</div>
    </aside>
  );
}
