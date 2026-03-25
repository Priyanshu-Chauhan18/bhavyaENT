import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'About Us | Bhavya Closures',
  description: 'Learn about our history and manufacturing excellence in closures.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <h1 className="heading-editorial text-3xl md:text-4xl font-extrabold text-text-primary mb-8">About Bhavya Closures</h1>
      <div className="prose prose-stone lg:prose-lg body-relaxed text-text-secondary">
        <p>
          Founded on principles of extreme reliability, precision, and scalability, Bhavya Closures is a leading manufacturer of premium closures globally.
        </p>
        <p>
          Our facilities leverage state-of-the-art injection molding and metal stamping technologies to produce closures that protect the integrity of your beverages, pharmaceuticals, and personal care products. From classic crown caps to advanced tamper-evident ROPP and PCO 1881 specifications, we are obsessed with the details.
        </p>
        
        <h2 className="heading-editorial text-2xl font-bold mt-12 mb-4 text-text-primary border-b border-border-subtle pb-2">Our Mission</h2>
        <p>
          To secure the world's best products with closures that never fail, providing seamless supply chain scalability for businesses of all sizes from niche craft breweries to global conglomerates.
        </p>
      </div>

      <div className="mt-16 bg-surface-dim p-8 rounded-2xl border border-border-default flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6 shadow-[var(--shadow-card)]">
        <div>
          <h3 className="heading-editorial text-xl font-bold text-text-primary mb-2">Ready to secure your product line?</h3>
          <p className="text-text-secondary text-sm body-relaxed">Create a free B2B portal account to browse our full specialized inventory and request samples.</p>
        </div>
        <Link href="/auth/sign-up" className="shrink-0">
          <Button size="lg" className="w-full bg-gradient-to-r from-accent-deep to-accent-gold hover:from-accent-gold-hover hover:to-accent-gold text-white rounded-full">Partner With Us</Button>
        </Link>
      </div>
    </div>
  );
}
