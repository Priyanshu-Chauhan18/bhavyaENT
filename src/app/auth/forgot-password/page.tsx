import { AuthCard } from '@/components/layout/auth-card';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset your password" description="Enter your email to receive a reset link.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
