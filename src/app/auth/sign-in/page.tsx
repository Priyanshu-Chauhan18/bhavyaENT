import { Suspense } from 'react';
import { AuthCard } from '@/components/layout/auth-card';
import { SignInForm } from '@/features/auth/components/sign-in-form';

export default function SignInPage() {
  return (
    <AuthCard title="Sign in to your account" description="Welcome back to BHAVYAA ENTERPRISES.">
      <Suspense fallback={<div className="p-4 text-center text-text-muted">Loading form...</div>}>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
