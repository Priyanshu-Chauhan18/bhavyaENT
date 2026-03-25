import { createServerSupabaseClient } from '../db/server';

export class AppError extends Error {
  constructor(public statusCode: number, message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}

export type ProfileData = {
  id: string;
  full_name: string;
  company_name: string | null;
  phone: string | null;
  role_key: 'customer' | 'admin';
  is_active: boolean;
};

/**
 * Ensures the requesting context has a valid Supabase auth session AND a valid profile.
 * Throws structured errors instead of redirecting (allowing caller or ErrorBoundary to decide actions).
 */
export async function requireAuth() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new AppError(401, 'Unauthorized access', 'UNAUTHORIZED');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    // Phase 2 explicitly demands treating "auth exists, profile missing" as a strict error state.
    // If you log the true profileError, you will see `profileError.message` from PostgREST if it crashed natively,
    // which led us to diagnosing the infinite query recursion!
    throw new AppError(403, 'Profile not found. Administrator intervention required.', 'PROFILE_MISSING');
  }

  return { user, profile: profile as ProfileData };
}

/**
 * Ensures the requester is authenticated AND has an active account.
 */
export async function requireActiveUser() {
  const { user, profile } = await requireAuth();

  if (!profile.is_active) {
    throw new AppError(403, 'Your account is inactive.', 'FORBIDDEN_INACTIVE_USER');
  }

  return { user, profile };
}

/**
 * Ensures the requester is authenticated, active, AND an admin.
 */
export async function requireAdmin() {
  const { user, profile } = await requireActiveUser();

  if (profile.role_key !== 'admin') {
    throw new AppError(403, 'Administrator access required.', 'FORBIDDEN');
  }

  return { user, profile };
}
