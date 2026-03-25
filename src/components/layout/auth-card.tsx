import { Card } from '@/components/ui/card';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-accent-gold/[0.04] rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-accent-gold/[0.03] rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 flex items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-accent-deep to-accent-gold bg-clip-text text-transparent italic pr-2">
            <span className="not-italic mr-2 text-accent-gold">⬡</span>
            Bhavya
          </span>
        </div>

        <Card padding="lg" className="border-border-default shadow-[var(--shadow-card)] bg-surface rounded-2xl">
          <h1 className="heading-editorial text-2xl font-bold text-text-primary">{title}</h1>
          {description && (
            <p className="body-relaxed mt-2 text-sm text-text-secondary">{description}</p>
          )}
          <div className="mt-6">{children}</div>
        </Card>
      </div>
    </div>
  );
}
