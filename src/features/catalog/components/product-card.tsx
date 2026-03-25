import Link from 'next/link';
import Image from 'next/image';
import { PublicProductPreview } from '../db/products';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';

interface ProductCardProps {
  product: PublicProductPreview;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];

  return (
    <Card className="flex flex-col h-full overflow-hidden border-border-subtle shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 group bg-surface rounded-2xl">
      <Link href={`/product/${product.slug}`} className="flex-grow flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-subtle flex items-center justify-center overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-text-muted">
              <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
              <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
            </div>
          )}
          
          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {product.is_featured && (
              <Badge variant="default" className="bg-accent-gold/90 text-white border-0 text-xs">
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2 text-text-primary group-hover:text-accent-deep transition-colors">
            {product.name}
          </h3>
          <p className="text-text-secondary text-sm line-clamp-2">
            {product.short_description || "High-quality precision closure."}
          </p>

          {/* Quick Specs */}
          {product.public_specs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {product.public_specs.slice(0, 3).map((spec) => (
                <span key={spec.spec_key} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-subtle text-text-secondary border border-border-subtle">
                  {spec.spec_value}
                </span>
              ))}
              {product.public_specs.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-subtle text-text-muted">
                  +{product.public_specs.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Trust line */}
          <p className="text-[11px] text-text-muted mt-3 pt-3 border-t border-border-subtle">
            MOQ available • Customization supported
          </p>
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0 border-t border-border-subtle mt-auto bg-subtle/50 flex justify-between items-center">
        <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-accent-deep hover:text-accent-gold transition-colors">
          View Details
        </Link>
        <Link href={`/product/${product.slug}#enquire`} className="text-sm font-semibold text-[#25D366] hover:text-[#1fa952] transition-colors">
          Enquire
        </Link>
      </CardFooter>
    </Card>
  );
}
