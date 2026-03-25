import { FadeIn } from '@/components/ui/fade-in';

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
      <div className="h-6 w-32 bg-border-default rounded-lg mb-8"></div>
      <div className="h-10 w-96 bg-border-default rounded-lg mb-4"></div>
      <div className="h-6 w-full max-w-2xl bg-border-subtle rounded-lg mb-8"></div>
      
      <div className="h-12 w-full bg-surface-dim rounded-lg border border-border-subtle mb-8"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-surface-dim rounded-2xl h-[320px] border border-border-subtle"></div>
        ))}
      </div>
    </div>
  );
}
