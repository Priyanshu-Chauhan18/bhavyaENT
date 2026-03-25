import { Suspense } from 'react';
import { AuthCard } from '@/components/layout/auth-card';
import { SignUpForm } from '@/features/auth/components/sign-up-form';

export default function SignUpPage() {
  return (
    <AuthCard title="Create an account" description="Request access to our premium catalog.">
      <Suspense fallback={<div className="p-4 text-center text-text-muted">Loading form...</div>}>
        <SignUpForm />
      </Suspense>
    </AuthCard>
  );
}
