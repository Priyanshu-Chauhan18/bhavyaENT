'use server';

import { headers } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/db/server';
import { signUpSchema, signInSchema, SignUpInput, SignInInput } from '@/lib/validation/auth';
import { authLimiter, forgotPasswordLimiter } from '@/lib/cache/rate-limiter';

type ActionResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

/** Extract client IP from request headers for rate limiting */
async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip') ||
    'unknown'
  );
}

export async function signUpAction(data: SignUpInput): Promise<ActionResponse> {
  // Rate limit sign-up by IP (same limits as sign-in)
  const ip = await getClientIp();
  const rateCheck = authLimiter.check(`signup:${ip}`);
  if (!rateCheck.allowed) {
    return { success: false, message: 'Too many sign-up attempts. Please wait a minute and try again.' };
  }

  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  
  // Note: Role is inherently 'customer' by default via the database trigger.
  const { data: authData, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        company_name: parsed.data.companyName,
        phone: parsed.data.phone,
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (!authData.session) {
    return { 
      success: true, 
      message: 'Account created! Please check your email to confirm your account.', 
      data: { requireEmailConfirm: true } 
    };
  }

  return { success: true, message: 'Account created successfully.' };
}

export async function signInAction(data: SignInInput): Promise<ActionResponse> {
  // Rate limit sign-in by IP — 5 attempts per minute
  const ip = await getClientIp();
  const rateCheck = authLimiter.check(`signin:${ip}`);
  if (!rateCheck.allowed) {
    return { success: false, message: 'Too many sign-in attempts. Please wait a minute and try again.' };
  }

  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createServerSupabaseClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  // We rely on route guards/middleware or the frontend to redirect post-login.
  return { success: true };
}

export async function signOutAction(): Promise<ActionResponse> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true };
}
