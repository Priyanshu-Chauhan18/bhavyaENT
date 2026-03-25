'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validation/auth';

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null);
    setSuccess(false);
    
    // Call server action for forgot password (Placeholder flow logic)
    // Wait for Supabase trigger or implement `forgotPasswordAction` manually here 
    // Example: const res = await forgotPasswordAction(data)
    
    // Simulating success as per specs for generic response
    await new Promise((res) => setTimeout(res, 1000));
    setSuccess(true);
  };

  return (
    <>
      {success ? (
        <div className="p-4 text-center">
          <p className="text-green-700 font-medium mb-2">Check your email</p>
          <p className="text-text-secondary text-sm">
            If an account exists with that email, we have sent a password reset link.
          </p>
        </div>
      ) : (
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
             {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-text-secondary">
        Remembered your password?{' '}
        <Link href="/auth/sign-in" className="font-medium text-accent-deep hover:text-accent-gold transition-colors">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
