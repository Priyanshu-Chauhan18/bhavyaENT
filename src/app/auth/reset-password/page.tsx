import { AuthCard } from '@/components/layout/auth-card';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Set new password" description="Please enter your new password below.">
      <ResetPasswordForm />
    </AuthCard>
  );
}
