import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <ErrorState 
        title="Page Not Found" 
        message="The page you are looking for does not exist or has been moved."
      />
      <div className="mt-8">
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
