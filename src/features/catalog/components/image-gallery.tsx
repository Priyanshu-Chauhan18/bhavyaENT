'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '../db/products';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  // Sort images so primary is first
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return 0;
  });

  const [activeIndex, setActiveIndex] = useState(0);

  if (sortedImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-subtle flex flex-col items-center justify-center rounded-2xl border border-border-subtle text-text-muted">
        <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
        <p className="font-medium tracking-wide uppercase text-sm">Image Coming Soon</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Active Featured Image */}
      <div className="w-full aspect-square relative bg-surface-dim rounded-2xl overflow-hidden border border-border-subtle shadow-[var(--shadow-card)]">
        <Image
          src={sortedImages[activeIndex].image_url}
          alt={sortedImages[activeIndex].alt_text || `${productName} view ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails Row */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
          {sortedImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 snap-start transition-all",
                activeIndex === idx ? "border-accent-gold opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || `Thumbnail ${idx}`}
                fill
                className="object-cover bg-surface-dim"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
