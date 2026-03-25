import { FadeIn } from '@/components/ui/fade-in';

export default function CatalogLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
      <div className="h-8 w-48 bg-border-default rounded-lg mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-subtle rounded-3xl h-[400px] border border-border-subtle"></div>
        ))}
      </div>
    </div>
  );
}
