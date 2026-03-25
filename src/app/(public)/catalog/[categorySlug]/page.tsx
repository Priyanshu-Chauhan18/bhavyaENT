import { notFound } from 'next/navigation';
import { getPublicActiveCategoryBySlug, getCategorySeoMeta } from '@/features/catalog/db/categories';
import { searchPublicProducts } from '@/features/catalog/db/products';
import { CatalogSearchParamsSchema } from '@/features/catalog/utils/pagination';
import { ProductCard } from '@/features/catalog/components/product-card';
import { SearchAndFilterBar } from '@/features/catalog/components/search-and-filter-bar';
import { PaginationControl } from '@/features/catalog/components/pagination-control';
import { Breadcrumbs } from '@/features/catalog/components/breadcrumbs';
import { PackageOpenIcon } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { siteConfig } from '@/lib/config/site';

export async function generateMetadata(props: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await props.params;
  const seo = await getCategorySeoMeta(categorySlug);
  
  if (!seo) {
    return { title: 'Category Not Found' };
  }

  const title = seo.meta_title || `${seo.name} | Bhavya Closures`;
  const description = seo.meta_description || seo.description || `Browse our selection of ${seo.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/catalog/${categorySlug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function CategoryListingPage(
  props: { 
    params: Promise<{ categorySlug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
  }
) {
  const { categorySlug } = await props.params;
  const rawParams = await props.searchParams;
  
  const category = await getPublicActiveCategoryBySlug(categorySlug);
  
  // Native Next.js 404 behavior if category doesn't exist
  if (!category) {
    notFound();
  }

  const parsed = CatalogSearchParamsSchema.safeParse(rawParams);
  const q = parsed.success ? parsed.data.q : '';
  const page = parsed.success ? parsed.data.page : 1;
  const sort = parsed.success ? parsed.data.sort : 'newest';

  const { data: products, total } = await searchPublicProducts({
    categoryId: category.id,
    query: q,
    page,
    sort,
    limit: 12
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <FadeIn delay={0.1}>
        <Breadcrumbs items={[
          { label: 'Catalog', href: '/catalog' },
          { label: category.name }
        ]} />
      </FadeIn>
      
      <FadeIn delay={0.2} className="mb-8 mt-4">
        <h1 className="heading-editorial text-3xl md:text-4xl font-extrabold text-text-primary mb-3">{category.name}</h1>
        {category.description && (
          <p className="body-relaxed text-base text-text-secondary max-w-3xl">{category.description}</p>
        )}
      </FadeIn>

      <FadeIn delay={0.3}>
        <SearchAndFilterBar basePath={`/catalog/${category.slug}`} />
      </FadeIn>
      
      {products.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center bg-subtle rounded-2xl shadow-[var(--shadow-card)] mt-8">
          <PackageOpenIcon className="w-16 h-16 text-text-muted mb-4" />
          <h2 className="heading-editorial text-2xl font-bold text-text-primary mb-2">No products available</h2>
          <p className="text-text-secondary body-relaxed">
            {q ? `No products in this category match "${q}".` : "There are currently no published products in this category."}
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <FadeIn delay={0.4}>
            <p className="text-sm font-medium text-text-muted mb-6">
              Showing {products.length} of {total} product{total === 1 ? '' : 's'}
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <FadeIn key={product.id} delay={0.4 + (idx * 0.05)}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.5} className="mt-8">
            <PaginationControl currentPage={page} totalItems={total} itemsPerPage={12} />
          </FadeIn>
        </div>
      )}
    </div>
  );
}
