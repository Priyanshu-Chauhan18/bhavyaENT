import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center text-sm font-medium text-text-muted mb-6 overflow-x-auto whitespace-nowrap pb-2">
      <Link href="/" className="hover:text-text-primary transition-colors flex items-center">
        <HomeIcon className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRightIcon className="w-4 h-4 mx-2 text-border-default flex-shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-text-primary" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
