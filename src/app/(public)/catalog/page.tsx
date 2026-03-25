import { getPublicActiveCategories } from '@/features/catalog/db/categories';
import { searchPublicProducts } from '@/features/catalog/db/products';
import { CatalogSearchParamsSchema } from '@/features/catalog/utils/pagination';
import { CategoryCard } from '@/features/catalog/components/category-card';
import { ProductCard } from '@/features/catalog/components/product-card';
import { SearchAndFilterBar } from '@/features/catalog/components/search-and-filter-bar';
import { PaginationControl } from '@/features/catalog/components/pagination-control';
import { Breadcrumbs } from '@/features/catalog/components/breadcrumbs';
import { PackageOpenIcon, ShieldCheckIcon, PackageIcon, GlobeIcon, AwardIcon } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

export const metadata = {
  title: 'Catalog | Bhavya Closures',
  description: 'Search and discover our complete range of premium closures.',
};

export default async function CatalogRootPage(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const rawParams = await props.searchParams;
  
  const parsed = CatalogSearchParamsSchema.safeParse(rawParams);
  const q = parsed.success ? parsed.data.q : '';
  const page = parsed.success ? parsed.data.page : 1;
  const sort = parsed.success ? parsed.data.sort : 'newest';

  const isSearchActive = !!q;

  let content;

  if (isSearchActive) {
    const { data: products, total } = await searchPublicProducts({
      query: q,
      page,
      sort,
      limit: 12
    });

    if (products.length === 0) {
      content = (
        <div className="py-20 text-center flex flex-col items-center bg-subtle rounded-2xl shadow-[var(--shadow-card)] mt-8">
          <PackageOpenIcon className="w-16 h-16 text-text-muted mb-4" />
          <h2 className="heading-editorial text-2xl font-bold text-text-primary mb-2">No results found</h2>
          <p className="text-text-secondary body-relaxed">We couldn&apos;t find any products matching &quot;{q}&quot;. Try checking your spelling or using more general terms.</p>
        </div>
      );
    } else {
      content = (
        <div className="mt-8">
          <p className="text-sm font-medium text-text-muted mb-6">
            Found {total} result{total === 1 ? '' : 's'} for &quot;{q}&quot;
          </p>
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
      );
    }
  } else {
    // Discovery Mode
    const categories = await getPublicActiveCategories();

    if (categories.length === 0) {
      content = (
        <div className="py-20 text-center bg-subtle rounded-2xl shadow-[var(--shadow-card)] mt-8">
          <h2 className="heading-editorial text-2xl font-bold text-text-primary mb-2">Catalog Getting Ready</h2>
          <p className="text-text-secondary body-relaxed">We are currently updating our digital inventory. Please check back soon.</p>
        </div>
      );
    } else {
      content = (
        <div className="mt-8">
          <FadeIn delay={0.4}>
            <h2 className="heading-editorial text-2xl font-bold text-text-primary mb-6">Product Categories</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <FadeIn key={category.id} delay={0.4 + (idx * 0.05)}>
                <CategoryCard category={category} />
              </FadeIn>
            ))}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <FadeIn delay={0.1}>
        <Breadcrumbs items={[{ label: 'Catalog' }]} />
      </FadeIn>
      
      <FadeIn delay={0.2} className="mb-6 mt-4">
        <h1 className="heading-editorial text-3xl md:text-4xl font-extrabold text-text-primary mb-3">Our Closures Catalog</h1>
        <p className="body-relaxed text-base text-text-secondary">Browse our complete range of precision-engineered closures.</p>
      </FadeIn>

      {/* Trust Strip — above the product grid */}
      <FadeIn delay={0.25}>
        <div className="flex flex-wrap justify-start gap-6 text-text-muted text-sm mb-8 py-4 border-t border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-accent-gold" />
            <span>ISO 9001 Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <PackageIcon className="w-4 h-4 text-accent-gold" />
            <span>Custom MOQ</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobeIcon className="w-4 h-4 text-accent-gold" />
            <span>Pan-India Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <AwardIcon className="w-4 h-4 text-accent-gold" />
            <span>15+ Years</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <SearchAndFilterBar basePath="/catalog" />
      </FadeIn>
      
      {content}
    </div>
  );
}
