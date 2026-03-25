'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface PaginationControlProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
}

export function PaginationControl({ currentPage, totalItems, itemsPerPage = 12 }: PaginationControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    // Use regular server routing push to trigger SSR fetch
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <span className="sr-only">Previous Page</span>
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      
      <div className="text-sm font-medium text-text-secondary">
        Page {currentPage} of {totalPages}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <span className="sr-only">Next Page</span>
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
