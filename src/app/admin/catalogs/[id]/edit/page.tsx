import { getAdminCatalogById } from '@/features/admin/db/catalogs';
import { CatalogForm } from '@/features/admin/components/catalog-form';
import { notFound } from 'next/navigation';

export default async function EditCatalogPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const catalog = await getAdminCatalogById(id);

  if (!catalog) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <CatalogForm initialData={catalog} />
    </div>
  );
}
