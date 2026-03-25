import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { getAdminCategoriesList } from '@/features/admin/db/categories';
import { deleteCategoryAction } from '@/features/admin/actions/categories';
import { DeleteButton } from '@/features/admin/components/delete-button';
import { ROUTES } from '@/lib/config/constants';

function ActiveBadge({ active }: { active: boolean }) {
  return active 
    ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">✓</span>
    : <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">✕</span>;
}

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategoriesList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Category Management</h1>
          <p className="text-sm text-slate-500 mt-1">Organize products into hierarchical groups.</p>
        </div>
        <Link 
          href={`${ROUTES.ADMIN_CATEGORIES}/new`}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg border border-transparent shadow-sm hover:bg-blue-700 transition-all hover:shadow focus:ring-4 focus:ring-blue-100"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-white border text-sm border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-slate-200">
            <thead className="bg-slate-50 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Name</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden md:table-cell">Slug</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden lg:table-cell">Catalog Hub</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden sm:table-cell">Sort Order</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Active</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No categories instantiated yet. Click &quot;Add Category&quot; to begin expanding the directory.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{cat.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 md:hidden">{cat.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 hidden md:table-cell font-mono">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 hidden lg:table-cell max-w-[150px] truncate">
                      {cat.catalog?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 hidden sm:table-cell">
                      {cat.sort_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ActiveBadge active={cat.is_active} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link 
                          href={`${ROUTES.ADMIN_CATEGORIES}/${cat.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors inline-block"
                          title="Edit Category"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteButton
                          entityId={cat.id}
                          entityName={cat.name}
                          entityType="Category"
                          deleteAction={deleteCategoryAction}
                          returnPath={ROUTES.ADMIN_CATEGORIES}
                        />
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
