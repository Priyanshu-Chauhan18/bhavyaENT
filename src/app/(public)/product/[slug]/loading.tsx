export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
      <div className="h-6 w-64 bg-border-default rounded-lg mb-4"></div>

      <div className="bg-surface rounded-3xl p-6 md:p-10 border border-border-default shadow-[var(--shadow-card)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="w-full h-[500px] bg-subtle rounded-2xl"></div>

          <div className="flex flex-col">
            <div className="pb-6 border-b border-border-subtle">
              <div className="h-10 w-3/4 bg-border-default rounded-lg mb-4"></div>
              <div className="h-5 w-32 bg-subtle rounded-lg"></div>
            </div>

            <div className="mt-8">
              <div className="h-5 w-24 bg-border-default rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-subtle rounded"></div>
                <div className="h-4 w-full bg-subtle rounded"></div>
                <div className="h-4 w-2/3 bg-subtle rounded"></div>
              </div>
            </div>
            
            <div className="mt-10">
              <div className="h-5 w-40 bg-border-default rounded-lg mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-surface-dim rounded-lg border border-border-subtle"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
