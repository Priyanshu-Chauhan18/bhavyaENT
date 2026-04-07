import { AuthenticatedProductDetail } from '../db/products';
import { PackageIcon, RulerIcon, FactoryIcon, TruckIcon } from 'lucide-react';

export function ProductFullSpecs({ product }: { product: AuthenticatedProductDetail }) {
  
  // Aggregate static intrinsic fields into an array similar to private_specs structurally
  // To avoid duplication, we filter out null/empty ones, and don't re-render anything public.
  const staticSpecs = [
    { key: 'Material Composition', value: product.material },
    { key: 'Color Family', value: product.color },
    { key: 'Surface Finish', value: product.finish },
    { key: 'Neck Size Code', value: product.neck_size },
  ].filter(s => !!s.value) as { key: string, value: string }[];

  const hasPrivateSpecs = product.private_specs.length > 0;

  // New product detail fields
  const hasNewFields = product.dimensions || product.packaging_type || product.production_capacity_per_day || product.delivery_time;
  
  if (staticSpecs.length === 0 && !hasPrivateSpecs && !product.full_description && !hasNewFields) return null;

  // Format packaging type with "Paid" highlighted
  const formatPackagingType = (value: string) => {
    if (!value) return value;
    // Highlight "(Paid)" in amber
    return value.replace(/\(Paid\)/gi, '').trim();
  };

  const packagingHasPaid = product.packaging_type?.toLowerCase().includes('paid');

  return (
    <div className="mt-10 animate-in fade-in duration-500">
      
      {product.full_description && (
        <div className="mb-10">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">Detailed Description</h3>
          <div className="prose prose-stone max-w-none text-text-secondary body-relaxed">
            {product.full_description.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* ── New Product Detail Cards ── */}
      {hasNewFields && (
        <div className="mb-10">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Product Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {product.dimensions && (
              <div className="flex items-start gap-3 p-4 bg-subtle rounded-xl border border-border-subtle">
                <div className="w-9 h-9 rounded-lg bg-accent-deep/10 flex items-center justify-center shrink-0">
                  <RulerIcon className="w-4.5 h-4.5 text-accent-deep" />
                </div>
                <div>
                  <span className="text-xs text-text-muted uppercase font-semibold">Dimensions</span>
                  <p className="text-sm text-text-primary font-medium mt-0.5">{product.dimensions}</p>
                </div>
              </div>
            )}

            {product.packaging_type && (
              <div className="flex items-start gap-3 p-4 bg-subtle rounded-xl border border-border-subtle">
                <div className="w-9 h-9 rounded-lg bg-accent-gold/10 flex items-center justify-center shrink-0">
                  <PackageIcon className="w-4.5 h-4.5 text-accent-brown" />
                </div>
                <div>
                  <span className="text-xs text-text-muted uppercase font-semibold">Packaging Type</span>
                  <p className="text-sm text-text-primary font-medium mt-0.5">
                    {formatPackagingType(product.packaging_type)}
                    {packagingHasPaid && (
                      <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                        BOX — Paid
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {product.production_capacity_per_day && (
              <div className="flex items-start gap-3 p-4 bg-subtle rounded-xl border border-border-subtle">
                <div className="w-9 h-9 rounded-lg bg-accent-green/10 flex items-center justify-center shrink-0">
                  <FactoryIcon className="w-4.5 h-4.5 text-accent-green" />
                </div>
                <div>
                  <span className="text-xs text-text-muted uppercase font-semibold">Production Capacity / Day</span>
                  <p className="text-sm text-text-primary font-medium mt-0.5">{product.production_capacity_per_day}</p>
                </div>
              </div>
            )}

            {product.delivery_time && (
              <div className="flex items-start gap-3 p-4 bg-subtle rounded-xl border border-border-subtle">
                <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <TruckIcon className="w-4.5 h-4.5 text-[#25D366]" />
                </div>
                <div>
                  <span className="text-xs text-text-muted uppercase font-semibold">Delivery Time</span>
                  <p className="text-sm text-text-primary font-medium mt-0.5">{product.delivery_time}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {(staticSpecs.length > 0 || hasPrivateSpecs) && (
        <div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Complete Technical Specs</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-0 text-sm border-t border-border-subtle">
            {/* Render Static Standard Keys */}
            {staticSpecs.map((spec) => (
              <div key={spec.key} className="flex justify-between py-3 border-b border-border-subtle px-2 group hover:bg-subtle transition-colors">
                <span className="text-text-muted font-medium">{spec.key}</span>
                <span className="text-text-primary font-semibold text-right max-w-[50%]">{spec.value}</span>
              </div>
            ))}
            
            {/* Render Database-driven Private Specs */}
            {product.private_specs.map((spec) => (
              <div key={spec.spec_key} className="flex justify-between py-3 border-b border-border-subtle px-2 group hover:bg-subtle transition-colors">
                <span className="text-text-muted font-medium">{spec.spec_key}</span>
                <span className="text-text-primary font-semibold text-right max-w-[50%]">{spec.spec_value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
