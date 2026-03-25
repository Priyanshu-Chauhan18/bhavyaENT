import { getAdminCategoryById } from '@/features/admin/db/categories';
import { getAdminCatalogsList } from '@/features/admin/db/catalogs';
import { CategoryForm } from '@/features/admin/components/category-form';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [category, catalogsResult] = await Promise.all([
    getAdminCategoryById(id),
    getAdminCatalogsList()
  ]);

  if (!category) {
    notFound();
  }

  const availableCatalogs = catalogsResult
    .filter(c => c.is_active || c.id === category.catalog_id)
    .map(c => ({ id: c.id, name: c.name }));

  // Map DB column name to form field name
  const initialData = {
    ...category,
    banner_image: category.banner_image_url || '',
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <CategoryForm initialData={initialData} catalogs={availableCatalogs} />
    </div>
  );
}
