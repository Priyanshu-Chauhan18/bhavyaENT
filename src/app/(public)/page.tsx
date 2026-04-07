import Link from 'next/link';
import { getManySettings } from '@/features/admin/db/settings';
import { getPublicFeaturedProducts } from '@/features/catalog/db/products';
import { getPublicActiveCategories } from '@/features/catalog/db/categories';
import { ProductCard } from '@/features/catalog/components/product-card';
import { CategoryCard } from '@/features/catalog/components/category-card';
import { HeroChessboard } from '@/components/layout/hero-chessboard';
import { MarqueeScroll } from '@/components/layout/marquee-scroll';
import { TrustStrip } from '@/components/layout/trust-strip';
import { AnimatedContent } from '@/components/reactbits/animated-content';
import { 
  ShieldCheckIcon, 
  PackageIcon, 
  GlobeIcon, 
  AwardIcon,
  RecycleIcon,
  SearchIcon,
  MessageCircleIcon,
  TruckIcon,
  ArrowRightIcon,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [settings, featuredProducts, categories] = await Promise.all([
    getManySettings(['hero_headline', 'hero_subheadline', 'company_name']),
    getPublicFeaturedProducts(8),
    getPublicActiveCategories()
  ]);

  return (
    <div className="flex flex-col">
      
      {/* ═══ Section 1: Hero — Animated Chessboard Collage ═══ */}
      <HeroChessboard />

      {/* ═══ Section 2: Trust Strip ═══ */}
      <TrustStrip />

      {/* ═══ Section 3: Catalog — Auto Scroll LEFT ═══ */}
      {categories.length > 0 && (
        <section className="py-14 md:py-20 bg-background">
          <div className="container mx-auto px-4 mb-8">
            <AnimatedContent delay={0.1} direction="up">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="heading-editorial text-2xl md:text-3xl font-bold text-text-primary mb-2">Browse Our Catalog</h2>
                  <p className="body-relaxed text-text-secondary text-sm md:text-base">Explore our comprehensive range of closures by category.</p>
                </div>
                <Link href="/catalog" className="hidden sm:flex items-center text-accent-deep hover:text-accent-green font-medium transition-colors text-sm">
                  View All <ArrowRightIcon className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </AnimatedContent>
          </div>
          <MarqueeScroll direction="left" speed={35}>
            {categories.map(category => (
              <div key={category.id} className="w-[280px] shrink-0">
                <CategoryCard category={category} />
              </div>
            ))}
          </MarqueeScroll>
          <div className="mt-6 text-center sm:hidden px-4">
            <Link href="/catalog" className="text-accent-deep hover:text-accent-green font-medium text-sm">
              View All Categories →
            </Link>
          </div>
        </section>
      )}

      {/* ═══ Section 4: Featured Products — Auto Scroll RIGHT ═══ */}
      {featuredProducts.length > 0 && (
        <section className="py-14 md:py-20 bg-subtle">
          <div className="container mx-auto px-4 mb-8">
            <AnimatedContent delay={0.1} direction="up">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="heading-editorial text-2xl md:text-3xl font-bold text-text-primary mb-2">Featured Products</h2>
                  <p className="body-relaxed text-text-secondary text-sm md:text-base">Our most popular and high-demand closures.</p>
                </div>
                <Link href="/catalog" className="hidden sm:flex items-center text-accent-deep hover:text-accent-green font-medium transition-colors text-sm">
                  View All <ArrowRightIcon className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </AnimatedContent>
          </div>
          <MarqueeScroll direction="right" speed={40}>
            {featuredProducts.map(product => (
              <div key={product.id} className="w-[280px] shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </MarqueeScroll>
        </section>
      )}

      {/* ═══ Section 5: How to Source ═══ */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-4">
          <AnimatedContent delay={0.1} direction="up" className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="heading-editorial text-2xl md:text-3xl font-bold text-text-primary mb-4">How to Source from BHAVYAA ENTERPRISES</h2>
            <p className="body-relaxed text-text-secondary">A simple, streamlined process to get exactly what you need.</p>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative max-w-5xl mx-auto isolate">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-[2px] bg-border-subtle -z-10" />

            <AnimatedContent delay={0.2} direction="up" className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-surface p-3 rounded-full z-10 mb-4 inline-block">
                <div className="w-20 h-20 rounded-full bg-accent-deep/10 shadow-[var(--shadow-card)] flex items-center justify-center text-accent-deep relative">
                  <div className="absolute inset-0 bg-surface rounded-full -z-10" />
                  <SearchIcon className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">1. Browse Catalog</h3>
              <p className="body-relaxed text-text-secondary text-sm">Review our range and find the exact closure for your bottles.</p>
            </AnimatedContent>

            <AnimatedContent delay={0.3} direction="up" className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-surface p-3 rounded-full z-10 mb-4 inline-block">
                <div className="w-20 h-20 rounded-full bg-[#25D366]/10 shadow-[var(--shadow-card)] flex items-center justify-center text-[#25D366] relative">
                  <div className="absolute inset-0 bg-surface rounded-full -z-10" />
                  <MessageCircleIcon className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">2. Enquire via WhatsApp</h3>
              <p className="body-relaxed text-text-secondary text-sm">Click enquire on any product for instant quotes and MOQ details.</p>
            </AnimatedContent>

            <AnimatedContent delay={0.4} direction="up" className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-surface p-3 rounded-full z-10 mb-4 inline-block">
                <div className="w-20 h-20 rounded-full bg-accent-gold/10 shadow-[var(--shadow-card)] flex items-center justify-center text-accent-brown relative">
                  <div className="absolute inset-0 bg-surface rounded-full -z-10" />
                  <TruckIcon className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">3. We Deliver</h3>
              <p className="body-relaxed text-text-secondary text-sm">We handle manufacturing, quality checks, and Pan-India logistics.</p>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* ═══ Section 6: Get in Touch → WhatsApp Redirect ═══ */}
      <section className="py-16 md:py-20 bg-accent-brown-deep relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[400px] h-[400px] bg-accent-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-[300px] h-[300px] bg-accent-green/10 rounded-full blur-3xl" />

        <AnimatedContent delay={0.1} direction="up" className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <h2 className="heading-editorial text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="body-relaxed text-white/75 mb-8 text-base md:text-lg">
            Reach out to us directly on WhatsApp for custom quotes, bulk orders, and technical support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919671016735').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello BHAVYAA ENTERPRISES team! I am interested in your products. Please share more details.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-[#25D366] rounded-full hover:bg-[#1fa952] shadow-lg transition-all"
            >
              <MessageCircleIcon className="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white border border-white/30 rounded-full hover:bg-white/10 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </AnimatedContent>
      </section>

    </div>
  );
}
