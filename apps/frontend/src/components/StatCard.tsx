type StatCardProps = {
  label: string;
  value: string;
  trend: string;
};

export default function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="glass p-6 relative overflow-hidden">
      <div className="absolute inset-0 card-sheen opacity-60" />
      <div className="relative space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
        <p className="text-3xl font-semibold text-slate-100">{value}</p>
        <p className="text-sm text-mint-400">{trend}</p>
      </div>
    </div>
  );
}
