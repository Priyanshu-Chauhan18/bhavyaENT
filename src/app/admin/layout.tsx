import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { requireAdmin } from '@/lib/guards';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Admin Header Navbar Placeholder */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="font-medium text-slate-800">System Dashboard</div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{profile.full_name || 'Admin User'}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
