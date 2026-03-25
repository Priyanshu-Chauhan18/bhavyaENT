'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signInSchema, type SignInInput } from '@/lib/validation/auth';
import { signInAction } from '@/features/auth/actions';

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setServerError(null);
    const result = await signInAction(data);

    if (!result.success) {
      setServerError(result.message || 'Invalid email or password.');
      return;
    }

    // Refresh route cache and navigate
    router.refresh();
    router.push(returnTo ? returnTo : '/account');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">
            {serverError}
          </div>
        )}
        
        <Input 
          label="Email address" 
          type="email" 
          placeholder="you@example.com" 
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          {...register('password')}
          error={errors.password?.message}
        />
        
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-border-default text-accent-gold focus:ring-accent-gold" />
            <span className="text-text-secondary">Remember me</span>
          </label>
          <Link href="/auth/forgot-password" className="font-medium text-accent-deep hover:text-accent-gold transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link href={`/auth/sign-up${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} className="font-medium text-accent-deep hover:text-accent-gold transition-colors">
          Sign up
        </Link>
      </p>
    </>
  );
}
