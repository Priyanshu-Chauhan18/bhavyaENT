import { AuthCard } from '@/components/layout/auth-card';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative z-0">
      {children}
    </div>
  );
}
