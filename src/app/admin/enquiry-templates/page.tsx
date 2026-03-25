import Link from 'next/link';
import { Plus, Pencil, Star, Tag, Package } from 'lucide-react';
import { getAdminTemplatesList } from '@/features/admin/db/templates';
import { deleteTemplateAction } from '@/features/admin/actions/templates';
import { DeleteButton } from '@/features/admin/components/delete-button';
import { ROUTES } from '@/lib/config/constants';

function ActiveBadge({ active }: { active: boolean }) {
  return active 
    ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">✓</span>
    : <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">✕</span>;
}

function TemplateScopeBadge({ is_default, product_name, category_name }: { is_default: boolean, product_name?: string, category_name?: string }) {
  if (is_default) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
        <Star className="w-3 h-3" /> Global Default
      </span>
    );
  }
  if (product_name) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200 max-w-[200px] truncate">
        <Package className="w-3 h-3 shrink-0" /> {product_name}
      </span>
    );
  }
  if (category_name) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-50 text-purple-700 border border-purple-200 max-w-[200px] truncate">
        <Tag className="w-3 h-3 shrink-0" /> {category_name}
      </span>
    );
  }
  return <span className="text-slate-400 italic text-xs">Unassigned</span>;
}

export default async function AdminTemplatesPage() {
  const templates = await getAdminTemplatesList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enquiry Templates</h1>
          <p className="text-sm text-slate-500 mt-1">Manage WhatsApp routing and structural overrides.</p>
        </div>
        <Link 
          href={`${ROUTES.ADMIN_TEMPLATES}/new`}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg border border-transparent shadow-sm hover:bg-blue-700 transition-all hover:shadow focus:ring-4 focus:ring-blue-100"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </Link>
      </div>

      <div className="bg-white border text-sm border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-slate-200">
            <thead className="bg-slate-50 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs w-1/4">Template Name</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Target Scope</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden md:table-cell">WhatsApp Routing</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Active</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No templates configured. All clicks will fail until a Global Default is established.
                  </td>
                </tr>
              ) : (
                templates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{tpl.template_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TemplateScopeBadge 
                        is_default={tpl.is_default}
                        product_name={tpl.product?.name}
                        category_name={tpl.category?.name}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 hidden md:table-cell font-mono text-xs">
                      {tpl.whatsapp_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ActiveBadge active={tpl.is_active} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link 
                          href={`${ROUTES.ADMIN_TEMPLATES}/${tpl.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors inline-block"
                          title="Edit Template"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteButton
                          entityId={tpl.id}
                          entityName={tpl.template_name}
                          entityType="Template"
                          deleteAction={deleteTemplateAction}
                          returnPath={ROUTES.ADMIN_TEMPLATES}
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
