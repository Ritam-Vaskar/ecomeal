const rows = [
  {
    item: 'Mushrooms',
    category: 'Produce',
    stock: '12 kg',
    expiry: '2 days',
    supplier: 'North Farm',
    status: 'Critical',
  },
  {
    item: 'Paneer',
    category: 'Dairy',
    stock: '6 kg',
    expiry: '4 days',
    supplier: 'Lakeside Co-op',
    status: 'Warning',
  },
  {
    item: 'Spinach',
    category: 'Produce',
    stock: '18 kg',
    expiry: '6 days',
    supplier: 'Green Leaf',
    status: 'Stable',
  },
];

export default function InventoryTable() {
  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Inventory Watchlist</h3>
        <button className="rounded-lg border border-ink-700 px-3 py-2 text-xs text-slate-300 hover:bg-ink-700/60">
          Export
        </button>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-3">Item</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Stock</th>
              <th className="pb-3">Expiry</th>
              <th className="pb-3">Supplier</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {rows.map((row) => (
              <tr key={row.item} className="border-t border-ink-700/60">
                <td className="py-4 font-medium">{row.item}</td>
                <td>{row.category}</td>
                <td>{row.stock}</td>
                <td>{row.expiry}</td>
                <td>{row.supplier}</td>
                <td className="text-ember-400">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
