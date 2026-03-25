'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react';

interface SearchAndFilterBarProps {
  basePath?: string; // If searching from outside /catalog, force routing to /catalog
}

export function SearchAndFilterBar({ basePath = '/catalog' }: SearchAndFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentQuery = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  
  const [queryInput, setQueryInput] = useState(currentQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Determine the target routing path. If we are already on a catalog/category page, stay there.
    // Otherwise force jump back to /catalog root to search all globally.
    const targetPath = pathname.startsWith('/catalog') ? pathname : basePath;

    const params = new URLSearchParams(searchParams.toString());
    
    if (queryInput.trim()) {
      params.set('q', queryInput.trim());
    } else {
      params.delete('q');
    }
    
    // Reset to page 1 on new search
    params.set('page', '1');

    router.push(`${targetPath}?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const targetPath = pathname.startsWith('/catalog') ? pathname : basePath;
    const params = new URLSearchParams(searchParams.toString());
    
    params.set('sort', val);
    params.set('page', '1'); // Refresh page cursor ideally
    
    router.push(`${targetPath}?${params.toString()}`);
  };

  return (
    <div className="w-full bg-surface p-4 rounded-2xl shadow-[var(--shadow-card)] mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
        
        <div className="relative flex-grow w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input 
            type="search" 
            placeholder="Search caps, exact SKUs, or keywords..."
            className="pl-10 w-full"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button type="submit" className="w-full sm:w-auto shrink-0">
            Search
          </Button>
          
          <div className="relative isolate flex items-center shrink-0">
            <SlidersHorizontalIcon className="absolute left-3 w-4 h-4 text-text-muted pointer-events-none" />
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="appearance-none pl-9 pr-8 py-2 border border-border-subtle rounded-xl text-sm font-medium bg-subtle focus:outline-none focus:ring-2 focus:ring-accent-gold/30"
            >
              <option value="newest">Newest</option>
              <option value="alphabetical">A-Z</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>

      </form>
    </div>
  );
}
