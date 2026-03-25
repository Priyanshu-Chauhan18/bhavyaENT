import { getAdminCategoriesList } from '@/features/admin/db/categories';
import { getAdminProductsList } from '@/features/admin/db/products';
import { TemplateForm } from '@/features/admin/components/template-form';

export default async function NewTemplatePage() {
  const [categories, products] = await Promise.all([
    getAdminCategoriesList(),
    getAdminProductsList()
  ]);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <TemplateForm 
        categories={categories.map(c => ({ id: c.id, name: c.name }))} 
        products={products.map(p => ({ id: p.id, name: p.name }))} 
      />
    </div>
  );
}
