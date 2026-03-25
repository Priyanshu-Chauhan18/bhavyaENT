import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { getAdminUsersList } from '@/features/admin/db/users';
import { UserRoleToggle } from '@/features/admin/components/user-role-toggle';

function RoleBadge({ role }: { role: string }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
        <ShieldCheck className="w-3 h-3" /> System Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200">
      Customer
    </span>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  return active 
    ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">✓</span>
    : <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">✕</span>;
}

export default async function AdminUsersPage() {
  const users = await getAdminUsersList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Users</h1>
          <p className="text-sm text-slate-500 mt-1">Govern active sessions, verify business identities, and elevate trusted administrators.</p>
        </div>
      </div>

      <div className="bg-white border text-sm border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-slate-200">
            <thead className="bg-slate-50 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Customer Name</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden md:table-cell">Company</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden lg:table-cell">Phone</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Internal Role</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden sm:table-cell">Active</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No active sessions found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{u.full_name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 md:hidden">{u.company_name || 'Individual'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 hidden md:table-cell">
                      {u.company_name || <span className="text-slate-300 italic">Unspecified</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 hidden lg:table-cell font-mono text-xs">
                      {u.phone || <span className="text-slate-300 italic">Unknown</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={u.role_key} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <ActiveBadge active={u.is_active} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-500 text-xs">
                      <div className="flex items-center justify-end gap-3">
                        {new Date(u.created_at).toLocaleDateString()}
                        <div className="border-l border-slate-200 pl-3">
                          <UserRoleToggle profileId={u.id} currentRole={u.role_key} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
