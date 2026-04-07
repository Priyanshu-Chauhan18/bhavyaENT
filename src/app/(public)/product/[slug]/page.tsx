import { notFound } from 'next/navigation';
import { 
  getPublicProductPreviewBySlug, 
  getAuthenticatedProductDetailBySlug,
  getProductSeoMeta
} from '@/features/catalog/db/products';
import { requireActiveUser } from '@/lib/guards';

import { ImageGallery } from '@/features/catalog/components/image-gallery';
import { LockSectionPlaceholder } from '@/features/catalog/components/lock-section-placeholder';
import { Breadcrumbs, BreadcrumbItem } from '@/features/catalog/components/breadcrumbs';
import { ProductCommercialInfo } from '@/features/catalog/components/product-commercial-info';
import { ProductFullSpecs } from '@/features/catalog/components/product-full-specs';
import { WhatsappEnquiryButton } from '@/features/enquiry/components/whatsapp-enquiry-button';
import { FadeIn } from '@/components/ui/fade-in';
import { TrustStrip } from '@/components/layout/trust-strip';

import { siteConfig } from '@/lib/config/site';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = await getProductSeoMeta(slug);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }

  const title = product.meta_title || `${product.name} | Bhavya Closures`;
  const description = product.meta_description || product.short_description || `View specifications for ${product.name}.`;

  // Fetch primary image for OG
  const preview = await getPublicProductPreviewBySlug(slug);
  const primaryImage = preview?.images?.find(img => img.is_primary)?.image_url 
    || preview?.images?.[0]?.image_url;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/product/${slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      ...(primaryImage 
        ? { images: [{ url: primaryImage, alt: product.name }] } 
        : { images: [{ url: '/og-image.png', alt: 'Bhavya' }] }),
    },
  };
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  
  // 1. Layered Auth Guard
  // Gracefully catch standard Phase 2 AppErrors if no session or inactive profile exists.
  let isAuthenticatedAndActive = false;
  try {
    await requireActiveUser();
    isAuthenticatedAndActive = true;
  } catch (error) {
    // Treat as Guest
  }

  // 2. Fetch specific branch
  const product = isAuthenticatedAndActive 
    ? await getAuthenticatedProductDetailBySlug(slug)
    : await getPublicProductPreviewBySlug(slug);
    
  // 3. 404 Guard (Both preview and full repos enforce is_active=true & published strictly now)
  if (!product) {
    notFound();
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Catalog', href: '/catalog' },
    { label: product.name }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <TrustStrip />
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        <FadeIn delay={0.1} direction="none">
          <Breadcrumbs items={breadcrumbItems} />
        </FadeIn>

      <div className="bg-surface rounded-2xl p-6 md:p-10 shadow-[var(--shadow-card)] mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Left Column - Visuals */}
          <FadeIn delay={0.2} direction="right" className="w-full">
            <ImageGallery images={product.images} productName={product.name} />
          </FadeIn>

          {/* Right Column - Product Payload */}
          <FadeIn delay={0.3} direction="left" className="flex flex-col">
            
            {/* Header Identity */}
            <div className="pb-6 border-b border-border-subtle">
              <h1 className="heading-editorial text-2xl md:text-4xl font-extrabold text-text-primary mb-3">
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-sm font-medium text-text-muted uppercase tracking-widest">
                  SKU: {product.sku}
                </p>
              )}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-subtle rounded-md text-sm font-medium text-text-secondary border border-border-subtle">
                <span className="text-text-muted">Packaging:</span> Bag | <span className="font-bold text-accent-gold-hover">Box (paid)</span>
              </div>
            </div>

            {/* Public Teaser Description */}
            {product.short_description && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">Overview</h3>
                <p className="body-relaxed text-base text-text-secondary">
                  {product.short_description}
                </p>
              </div>
            )}

            {/* Public Specifications (is_public = true only) */}
            <div className="mt-10">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Core Specifications</h3>
              
              {product.public_specs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {product.public_specs.map((spec) => (
                    <div key={spec.spec_key} className="flex flex-col p-3 bg-subtle rounded-xl">
                      <span className="text-xs text-text-muted uppercase font-semibold mb-1">{spec.spec_key}</span>
                      <span className="text-base text-text-primary font-medium">{spec.spec_value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted italic text-sm">Basic technical specifications will be provided upon request.</p>
              )}
            </div>

            {/* Branch Rendering: Full Detail Components OR Locked CTA Placeholder */}
            {isAuthenticatedAndActive ? (
              <>
                <ProductCommercialInfo product={product as any} />
                <ProductFullSpecs product={product as any} />
                
                <div className="mt-12 pt-8 border-t border-border-subtle">
                  <p className="text-sm text-text-muted font-medium text-center mb-4">Ready to discuss volume pricing?</p>
                  <WhatsappEnquiryButton productId={product.id} />
                </div>
              </>
            ) : (
              <div className="mt-8 mt-auto pt-8">
                <LockSectionPlaceholder />
              </div>
            )}

          </FadeIn>
        </div>
        </div>
      </div>
    </div>
  );
}
