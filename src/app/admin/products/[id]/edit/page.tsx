import { notFound } from 'next/navigation';
import { ProductForm } from '@/features/admin/components/product-form';
import { getAdminCategories, getAdminProductById } from '@/features/admin/db/products';

export const metadata = {
  title: 'Edit Product | Admin',
};

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  
  const [categories, product] = await Promise.all([
    getAdminCategories(),
    getAdminProductById(id)
  ]);

  if (!product) {
    notFound();
  }

  // Hydrate DB response securely into Zod compliant arrays
  const initialData: any = {
    ...product,
    media_urls: product.product_images || [],
    public_specs: (product.product_specs || []).filter((s: any) => s.is_public),
    private_specs: (product.product_specs || []).filter((s: any) => !s.is_public),
  };

  return <ProductForm initialData={initialData} categories={categories} />;
}
