'use client';

/**
 * Client-side providers wrapper.
 * Add providers here as they are needed in future phases:
 * - Toast provider
 * - Query provider (if using React Query)
 * - Theme provider
 */

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
