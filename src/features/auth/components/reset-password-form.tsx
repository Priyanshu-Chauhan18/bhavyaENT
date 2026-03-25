'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validation/auth';

export function ResetPasswordForm() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);
    setSuccess(false);

    // Call server action to handle the actual password update logic
    await new Promise((res) => setTimeout(res, 1000));
    setSuccess(true);
  };

  return (
    <>
      {success ? (
        <div className="p-4 text-center">
          <p className="text-green-700 font-medium mb-2">Password Updated</p>
          <p className="text-text-secondary text-sm">
            You can now log in with your new password.
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
            label="New Password" 
            type="password" 
            placeholder="••••••••" 
            {...register('password')}
            error={errors.password?.message}
          />
          
          <Input 
            label="Confirm New Password" 
            type="password" 
            placeholder="••••••••" 
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
             {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      )}
    </>
  );
}
