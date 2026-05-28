import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import OfflineBanner from '@/components/OfflineBanner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <Sidebar />
        <div className="space-y-6">
          <Topbar />
          <OfflineBanner />
          {children}
        </div>
      </div>
    </div>
  );
}
