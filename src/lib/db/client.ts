import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-safe Supabase client.
 * Uses the public anon key — safe for client-side usage.
 * One canonical import path for browser client.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
