import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { getAdminProductsList } from '@/features/admin/db/products';
import { deleteProductAction } from '@/features/admin/actions/products';
import { DeleteButton } from '@/features/admin/components/delete-button';
import { ROUTES } from '@/lib/config/constants';

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  if (normalized === 'published') {
    return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Published</span>;
  }
  if (normalized === 'archived') {
    return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200">Archived</span>;
  }
  return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">Draft</span>;
}

function ActiveBadge({ active }: { active: boolean }) {
  return active 
    ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">✓</span>
    : <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">✕</span>;
}

export default async function AdminProductsPage() {
  const products = await getAdminProductsList();

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create, update, and govern the system catalog.</p>
        </div>
        <Link 
          href={`${ROUTES.ADMIN_PRODUCTS}/new`}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg border border-transparent shadow-sm hover:bg-blue-700 transition-all hover:shadow focus:ring-4 focus:ring-blue-100"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Main Table */}
      <div className="bg-white border text-sm border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-slate-200">
            <thead className="bg-slate-50 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Name</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden md:table-cell">SKU</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden lg:table-cell">Category</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Visibility</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden sm:table-cell">Active</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No products instantiated yet. Click &quot;Add Product&quot; to begin building the catalog.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 md:hidden">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 hidden md:table-cell font-mono">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 hidden lg:table-cell max-w-[150px] truncate">
                      {product.categories?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={product.publish_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell text-center">
                      <ActiveBadge active={product.is_active} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link 
                          href={`${ROUTES.ADMIN_PRODUCTS}/${product.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors inline-block"
                          title="Edit Product"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteButton
                          entityId={product.id}
                          entityName={product.name}
                          entityType="Product"
                          deleteAction={deleteProductAction}
                          returnPath={ROUTES.ADMIN_PRODUCTS}
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
