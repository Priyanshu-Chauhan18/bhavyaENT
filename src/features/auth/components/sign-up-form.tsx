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

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

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

    // Success (Auto-login)
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
        {successMsg && (
          <div className="p-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg shadow-sm">
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
          placeholder="Doe Industries" 
          {...register('companyName')}
          error={errors.companyName?.message}
        />

        <Input 
          label="Phone Number (Optional)" 
          type="tel" 
          placeholder="+123456789" 
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
        
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link href={`/auth/sign-in${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} className="font-medium text-accent-deep hover:text-accent-gold transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
}
