import { getAdminTemplateById } from '@/features/admin/db/templates';
import { getAdminCategoriesList } from '@/features/admin/db/categories';
import { getAdminProductsList } from '@/features/admin/db/products';
import { TemplateForm } from '@/features/admin/components/template-form';
import { notFound } from 'next/navigation';

export default async function EditTemplatePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [template, categories, products] = await Promise.all([
    getAdminTemplateById(id),
    getAdminCategoriesList(),
    getAdminProductsList()
  ]);

  if (!template) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <TemplateForm 
        initialData={template} 
        categories={categories.map(c => ({ id: c.id, name: c.name }))} 
        products={products.map(p => ({ id: p.id, name: p.name }))} 
      />
    </div>
  );
}
