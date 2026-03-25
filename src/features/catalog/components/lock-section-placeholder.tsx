'use client';

import { usePathname } from 'next/navigation';
import { LockIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function LockSectionPlaceholder() {
  const pathname = usePathname();
  const returnPath = encodeURIComponent(pathname);

  return (
    <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 text-center">
      {/* Frosted glass background */}
      <div className="absolute inset-0 frosted-lock border border-border-subtle rounded-2xl" />
      {/* Subtle blur pattern to suggest hidden content */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] pointer-events-none select-none text-text-muted text-sm leading-relaxed px-12">
        <div className="space-y-2 blur-[6px]">
          <p>Base Price: ₹0.85/unit • MOQ: 50,000 units</p>
          <p>Bulk (100K+): ₹0.72/unit • Volume discount: 15%</p>
          <p>Sample Kit: ₹2,500 (adjustable against order)</p>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="h-14 w-14 bg-surface rounded-full flex items-center justify-center shadow-[var(--shadow-card)] mb-5">
          <LockIcon className="w-6 h-6 text-text-muted" />
        </div>
        
        <h3 className="heading-editorial text-lg md:text-xl font-bold text-text-primary mb-2">
          Pricing & Bulk Details
        </h3>
        
        <p className="body-relaxed text-text-secondary max-w-md mx-auto text-sm mb-6">
          Sign in to view pricing, MOQ tiers, and downloadable spec sheets.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-sm">
          <Link href={`/auth/sign-in?returnTo=${returnPath}`} className="w-full">
            <Button size="lg" className="w-full bg-gradient-to-r from-accent-deep to-accent-gold hover:from-accent-gold-hover hover:to-accent-gold text-white rounded-full">
              Sign In to Unlock
            </Button>
          </Link>
          <Link href={`/auth/sign-up?returnTo=${returnPath}`} className="w-full">
            <Button variant="outline" size="lg" className="w-full text-text-secondary border-border-default hover:bg-surface-dim rounded-full">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
