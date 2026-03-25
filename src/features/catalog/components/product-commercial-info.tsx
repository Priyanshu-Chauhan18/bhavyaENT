import { AuthenticatedProductDetail } from '../db/products';
import { CalendarIcon, PackageIcon } from 'lucide-react';

export function ProductCommercialInfo({ product }: { product: AuthenticatedProductDetail }) {
  // If neither value is present natively, fail gracefully.
  if (!product.moq && !product.lead_time) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 animate-in slide-in-from-bottom-2 fade-in duration-500">
      <div className="bg-surface-dim rounded-2xl p-5 border border-border-default flex items-start gap-4 shadow-[var(--shadow-card)]">
        <div className="mt-1 p-2 bg-surface rounded-full text-accent-deep shadow-sm">
          <PackageIcon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-1">Minimum Order QTY</h4>
          <p className="text-lg text-text-secondary font-medium">
            {product.moq || <span className="text-text-muted italic font-normal">Contact Sales</span>}
          </p>
        </div>
      </div>

      <div className="bg-surface-dim rounded-2xl p-5 border border-border-default flex items-start gap-4 shadow-[var(--shadow-card)]">
        <div className="mt-1 p-2 bg-surface rounded-full text-accent-deep shadow-sm">
          <CalendarIcon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-1">Estimated Lead Time</h4>
          <p className="text-lg text-text-secondary font-medium">
            {product.lead_time || <span className="text-text-muted italic font-normal">Variable</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
