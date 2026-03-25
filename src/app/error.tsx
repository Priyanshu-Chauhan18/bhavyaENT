'use client';

import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <ErrorState 
        title="Something went wrong!" 
        message={error.message || "An unexpected error occurred."}
        onRetry={() => reset()} 
      />
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
