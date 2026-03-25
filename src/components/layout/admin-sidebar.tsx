import Link from 'next/link';
import { ROUTES } from '@/lib/config/constants';

const adminNavItems = [
  { href: ROUTES.ADMIN, label: 'Dashboard', icon: '📊' },
  { href: ROUTES.ADMIN_PRODUCTS, label: 'Products', icon: '📦' },
  { href: ROUTES.ADMIN_CATEGORIES, label: 'Categories', icon: '📂' },
  { href: ROUTES.ADMIN_CATALOGS, label: 'Catalogs', icon: '📚' },
  { href: ROUTES.ADMIN_TEMPLATES, label: 'Templates', icon: '📝' },
  { href: ROUTES.ADMIN_SETTINGS, label: 'Settings', icon: '⚙️' },
  { href: ROUTES.ADMIN_USERS, label: 'Users', icon: '👥' },
  { href: ROUTES.ADMIN_AUDIT_LOGS, label: 'Audit Logs', icon: '📋' },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white">
      {/* Admin header */}
      <div className="px-6 py-5 border-b border-slate-800">
        <Link href={ROUTES.ADMIN} className="text-lg font-bold">
          <span className="text-blue-400">⬡</span> Admin Panel
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Back to storefront */}
      <div className="px-6 py-4 mt-auto border-t border-slate-800">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  );
}
