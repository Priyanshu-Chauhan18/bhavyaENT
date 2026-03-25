import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client.
 * Uses cookie-based session handling for server components and route handlers.
 * One canonical import path for server client.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // This can be called from Server Components where cookies
            // cannot be set. Silently ignore in that case.
          }
        },
      },
    }
  );
}

/**
 * Service-role Supabase client (admin operations).
 * Bypasses RLS — use ONLY for admin mutations from trusted server code.
 * NEVER import this in client-side code.
 */
export function createAdminSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Cookie-less anon client for use inside unstable_cache.
 * Relies on RLS anon policies (e.g., product_previews view) for security.
 */
export function createAnonSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: fetch
      }
    }
  );
}
