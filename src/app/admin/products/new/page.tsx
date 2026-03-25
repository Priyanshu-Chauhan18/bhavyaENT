import { ProductForm } from '@/features/admin/components/product-form';
import { getAdminCategories } from '@/features/admin/db/products';

export const metadata = {
  title: 'Create Product | Admin',
};

export default async function NewProductPage() {
  const categories = await getAdminCategories();
  
  return <ProductForm categories={categories} />;
}
