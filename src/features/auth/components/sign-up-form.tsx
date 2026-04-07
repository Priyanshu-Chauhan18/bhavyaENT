'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signUpSchema, type SignUpInput } from '@/lib/validation/auth';
import { signUpAction } from '@/features/auth/actions';
import { createBrowserSupabaseClient } from '@/lib/db/browser';

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setServerError(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo || '/')}`,
        },
      });
      if (error) setServerError(error.message);
    } catch {
      setServerError('Failed to initiate Google sign-in. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (data: SignUpInput) => {
    setServerError(null);
    const result = await signUpAction(data);

    if (!result.success) {
      setServerError(result.message || 'An error occurred during sign up.');
      return;
    }

    if (result.data?.requireEmailConfirm) {
      setSuccessMsg(result.message || 'Please check your email to verify your account.');
      return;
    }

    router.refresh();
    router.push(returnTo ? returnTo : '/');
  };

  return (
    <>
      {/* Google Sign Up Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || isSubmitting}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium text-text-primary bg-surface border border-border-default rounded-lg hover:bg-subtle transition-colors disabled:opacity-60"
      >
        {googleLoading ? (
          <span className="w-5 h-5 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {googleLoading ? 'Connecting...' : 'Sign up with Google'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-text-muted">or sign up with email</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
            {serverError}
          </div>
        )}
        {successMsg && (
          <div className="p-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold mb-1">Check your inbox</p>
            {successMsg}
          </div>
        )}

        {!successMsg && (
          <>
            <Input 
              label="Full Name" 
              type="text" 
              placeholder="John Doe" 
              {...register('fullName')}
              error={errors.fullName?.message}
            />
            
            <Input 
              label="Email address" 
              type="email" 
              placeholder="you@example.com" 
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input 
              label="Company Name (Optional)" 
              type="text" 
              placeholder="Your Company" 
              {...register('companyName')}
              error={errors.companyName?.message}
            />

            <Input 
              label="Phone Number (Optional)" 
              type="tel" 
              placeholder="+91 XXXXX XXXXX" 
              {...register('phone')}
              error={errors.phone?.message}
            />

            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              helperText="Must be at least 8 characters long."
              {...register('password')}
              error={errors.password?.message}
            />

            <Input 
              label="Confirm Password" 
              type="password" 
              placeholder="••••••••" 
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            
            <Button type="submit" className="w-full bg-accent-deep hover:bg-accent-green text-white" disabled={isSubmitting || googleLoading}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link href={`/auth/sign-in${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} className="font-medium text-accent-deep hover:text-accent-green transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
}
