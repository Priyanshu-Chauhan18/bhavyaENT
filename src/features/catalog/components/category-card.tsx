import Link from 'next/link';
import Image from 'next/image';
import { CategoryPreview } from '../db/categories';
import { Card, CardContent } from '@/components/ui/card';
import { FolderIcon, ArrowRightIcon } from 'lucide-react';

interface CategoryCardProps {
  category: CategoryPreview;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 group border-border-subtle bg-surface rounded-2xl">
      <Link href={`/catalog/${category.slug}`} className="block h-full">
        <div className="relative h-40 bg-subtle flex items-center justify-center overflow-hidden">
          {category.banner_image_url ? (
            <Image
              src={category.banner_image_url}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-subtle to-border-default flex flex-col items-center justify-center text-text-muted">
              <FolderIcon className="w-12 h-12 mb-2 opacity-30" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-[#1a1a2e]/20 to-transparent flex flex-col justify-end p-5">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent-gold transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-text-muted text-sm line-clamp-1 max-w-[90%]">
                    {category.description}
                  </p>
                )}
              </div>
              <div className="bg-accent-gold/20 backdrop-blur-sm p-2 rounded-full opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                <ArrowRightIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
