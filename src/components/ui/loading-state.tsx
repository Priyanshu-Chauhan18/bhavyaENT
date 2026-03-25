import { Spinner } from '@/components/ui/spinner';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-sm text-slate-500">{message}</p>
    </div>
  );
}
