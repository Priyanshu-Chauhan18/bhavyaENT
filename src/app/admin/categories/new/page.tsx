import { CategoryForm } from '@/features/admin/components/category-form';
import { getAdminCatalogsList } from '@/features/admin/db/catalogs';

export default async function NewCategoryPage() {
  const catalogsResult = await getAdminCatalogsList();
  // We only care about id and name for the dropdown
  const activeCatalogs = catalogsResult
    .filter(c => c.is_active)
    .map(c => ({ id: c.id, name: c.name }));

  return (
    <div className="max-w-4xl mx-auto py-6">
      <CategoryForm catalogs={activeCatalogs} />
    </div>
  );
}
