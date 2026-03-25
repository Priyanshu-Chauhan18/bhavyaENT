import { Navbar } from '@/components/layout/navbar';
import { requireActiveUser } from '@/lib/guards';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: even if middleware is bypassed, this guard ensures
  // only authenticated, active users reach account pages.
  await requireActiveUser();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Account Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            <div className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
              Profile
            </div>
          </nav>
        </aside>

        {/* Account Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
