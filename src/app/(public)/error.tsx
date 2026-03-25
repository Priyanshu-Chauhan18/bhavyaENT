'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to error reporting service
    console.error('Public route error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <FadeIn className="text-center flex flex-col items-center max-w-lg">
        <div className="bg-surface-dim p-4 rounded-full mb-6">
          <AlertCircle className="w-12 h-12 text-accent-deep" />
        </div>
        <h2 className="heading-editorial text-2xl md:text-3xl font-extrabold text-text-primary mb-4">Something went wrong</h2>
        <p className="body-relaxed text-base md:text-lg text-text-secondary mb-8 leading-relaxed">
          We encountered an unexpected error while preparing this page. Our team has been notified.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => reset()} variant="primary" size="lg" className="rounded-full">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline" size="lg" className="rounded-full">
            Return Home
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
