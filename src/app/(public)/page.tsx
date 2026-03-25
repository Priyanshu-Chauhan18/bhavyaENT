import Link from 'next/link';
import { getManySettings } from '@/features/admin/db/settings';
import { getPublicFeaturedProducts } from '@/features/catalog/db/products';
import { getPublicActiveCategories } from '@/features/catalog/db/categories';
import { ProductCard } from '@/features/catalog/components/product-card';
import { CategoryCard } from '@/features/catalog/components/category-card';
import { Button } from '@/components/ui/button';
import { SplitText } from '@/components/reactbits/split-text';
import { AnimatedContent } from '@/components/reactbits/animated-content';
import { 
  ArrowRightIcon, 
  FactoryIcon, 
  FlaskConicalIcon, 
  ShipIcon, 
  DropletsIcon,
  SearchIcon,
  MessageCircleIcon,
  TruckIcon,
  ShieldCheckIcon,
  PackageIcon,
  GlobeIcon,
  AwardIcon
} from 'lucide-react';

// Require dynamic rendering to fetch fresh settings and highlights
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [settings, featuredProducts, categories] = await Promise.all([
    getManySettings(['hero_headline', 'hero_subheadline', 'company_name']),
    getPublicFeaturedProducts(4),
    getPublicActiveCategories()
  ]);

  const headline = settings.hero_headline ?? 'Zero-Defect Closures for High-Speed Bottling Lines';
  const subheadline = settings.hero_subheadline ?? 'Direct from our ISO-certified facility — custom MOQs, fast sampling, and engineering support on every order.';

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section — Warm Light (NOT Dark) */}
      <section className="relative bg-background overflow-hidden">
        {/* Subtle warm texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dim/50 to-background"></div>
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[500px] h-[500px] bg-accent-gold/[0.04] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-[400px] h-[400px] bg-accent-gold/[0.03] rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-28 flex flex-col items-center text-center max-w-4xl">
          <SplitText delay={0.2} className="heading-editorial text-3xl md:text-[3.25rem] font-extrabold text-text-primary mb-6 justify-center">
            {headline}
          </SplitText>
          <AnimatedContent delay={0.4} direction="up" className="flex flex-col items-center">
            <p className="body-relaxed text-base md:text-lg text-text-secondary mb-10 max-w-2xl">
              {subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog">
                <Button size="lg" className="bg-gradient-to-r from-accent-deep to-accent-gold hover:from-accent-gold-hover hover:to-accent-gold text-white text-base rounded-full px-8 shadow-[var(--shadow-card)]">
                  Explore Catalog <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-text-secondary border-border-default hover:bg-surface-dim text-base rounded-full px-8">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-surface-dim py-5">
        <div className="container mx-auto px-4">
          <AnimatedContent delay={0.2} direction="up" className="flex flex-wrap justify-center gap-8 md:gap-16 text-text-muted text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-accent-gold" />
              <span>ISO 9001 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <PackageIcon className="w-4 h-4 text-accent-gold" />
              <span>Custom MOQ Available</span>
            </div>
            <div className="flex items-center gap-2">
              <GlobeIcon className="w-4 h-4 text-accent-gold" />
              <span>Pan-India Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <AwardIcon className="w-4 h-4 text-accent-gold" />
              <span>15+ Years Experience</span>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Use Case / Buyer Intent Section */}
      <section className="bg-subtle py-16 md:py-20">
        <div className="container mx-auto px-4">
          <AnimatedContent delay={0.1} direction="up" className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="heading-editorial text-2xl md:text-3xl font-bold text-text-primary mb-4">Designed for High-Volume Operations</h2>
            <p className="body-relaxed text-text-secondary">Engineered closures built specifically for the demands of your industry.</p>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FactoryIcon, title: 'Beverage Manufacturers', desc: 'High-speed bottling compatibility with zero-defect consistent sealing.', accent: 'bg-accent-gold/10 text-accent-gold' },
              { icon: FlaskConicalIcon, title: 'Craft & Premium Brands', desc: 'Custom color matching, premium finishes, and low-MOQ sampling available.', accent: 'bg-purple-50 text-purple-600' },
              { icon: ShipIcon, title: 'Export-Oriented Businesses', desc: 'Bulk supply capacity with strict international compliance-ready packaging.', accent: 'bg-emerald-50 text-emerald-600' },
              { icon: DropletsIcon, title: 'Industrial Packaging', desc: 'Highly durable closures engineered for chemicals, oils, and harsh environments.', accent: 'bg-orange-50 text-orange-600' },
            ].map((item, idx) => (
              <AnimatedContent key={item.title} delay={0.2 + (idx * 0.1)} direction="up" className="bg-surface p-7 rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 group flex flex-col h-full">
                <div className={`${item.accent} p-3 rounded-xl w-fit mb-5 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-text-primary mb-2">{item.title}</h3>
                <p className="body-relaxed text-text-secondary text-sm mb-6 flex-1">{item.desc}</p>
                <Link href="/catalog" className="text-accent-deep text-sm font-semibold hover:text-accent-gold flex items-center mt-auto transition-colors">
                  Explore Products <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="container mx-auto px-4">
          <AnimatedContent delay={0.1} direction="up" className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="heading-editorial text-2xl md:text-3xl font-bold text-text-primary mb-4">How to Source from Bhavya</h2>
            <p className="body-relaxed text-text-secondary">A streamlined B2B ordering process designed to save you time.</p>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-border-subtle z-0"></div>

            <AnimatedContent delay={0.2} direction="up" className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-subtle shadow-[var(--shadow-card)] flex items-center justify-center text-accent-deep mb-6 z-10">
                <SearchIcon className="w-10 h-10" />
              </div>
              <div className="absolute top-0 right-0 -mr-6 mt-10 md:hidden text-text-muted">
                <ArrowRightIcon className="w-6 h-6 rotate-90" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">1. Browse Catalog</h3>
              <p className="body-relaxed text-text-secondary">Review our technical specifications and find the exact closure for your bottles.</p>
            </AnimatedContent>

            <AnimatedContent delay={0.3} direction="up" className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-subtle shadow-[var(--shadow-card)] flex items-center justify-center text-[#25D366] mb-6 z-10">
                <MessageCircleIcon className="w-10 h-10" />
              </div>
              <div className="absolute top-0 right-0 -mr-6 mt-10 md:hidden text-text-muted">
                <ArrowRightIcon className="w-6 h-6 rotate-90" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">2. Enquire via WhatsApp</h3>
              <p className="body-relaxed text-text-secondary">Click enquire on any product to get instant custom quotes and MOQ details.</p>
            </AnimatedContent>

            <AnimatedContent delay={0.4} direction="up" className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-subtle shadow-[var(--shadow-card)] flex items-center justify-center text-accent-deep mb-6 z-10">
                <TruckIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">3. We Deliver</h3>
              <p className="body-relaxed text-text-secondary">We handle the manufacturing, quality checks, and end-to-end logistics.</p>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* Categories Discovery */}
      {categories.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="heading-editorial text-2xl md:text-3xl font-bold text-text-primary mb-2">Browse Categories</h2>
                <p className="body-relaxed text-text-secondary">Discover our comprehensive range of specialized closures.</p>
              </div>
              <Link href="/catalog" className="hidden sm:flex items-center text-accent-deep hover:text-accent-gold font-medium transition-colors">
                View All <ArrowRightIcon className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
            
            <div className="mt-8 text-center sm:hidden">
              <Link href="/catalog" className="block w-full">
                <Button variant="outline" className="w-full rounded-full">View All Categories</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-subtle">
          <div className="container mx-auto px-4">
            <AnimatedContent delay={0.1} direction="up" className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="heading-editorial text-2xl md:text-3xl font-bold text-text-primary mb-4">Featured Solutions</h2>
              <p className="body-relaxed text-text-secondary">Our most popular and universally demanded closures engineered for performance.</p>
            </AnimatedContent>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, idx) => (
                <AnimatedContent key={product.id} delay={0.2 + (idx * 0.1)} direction="up">
                  <ProductCard product={product} />
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Call to Action pre-footer — Restrained gold (accent button, NOT full gold bg) */}
      <section className="bg-surface-dim py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[400px] h-[400px] bg-accent-gold/[0.04] rounded-full blur-3xl"></div>
        <AnimatedContent delay={0.1} direction="up" className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <h2 className="heading-editorial text-2xl md:text-3xl font-bold text-text-primary mb-6">Ready to Scale Your Production?</h2>
          <p className="body-relaxed text-text-secondary mb-10 text-base md:text-lg">
            Join 200+ brands who trust Bhavya for their critical closure supply chain. Elevate your packaging today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-accent-deep to-accent-gold hover:from-accent-gold-hover hover:to-accent-gold text-white font-semibold rounded-full px-8">
                Create Free Account
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-border-default text-text-secondary hover:bg-surface font-semibold rounded-full px-8">
                Speak to Sales
              </Button>
            </Link>
          </div>
        </AnimatedContent>
      </section>

    </div>
  );
}
