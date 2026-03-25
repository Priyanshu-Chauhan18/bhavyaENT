import { AuthenticatedProductDetail } from '../db/products';

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
  
  if (staticSpecs.length === 0 && !hasPrivateSpecs && !product.full_description) return null;

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

      {(staticSpecs.length > 0 || hasPrivateSpecs) && (
        <div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Complete Technical Specs</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-0 text-sm border-t border-border-subtle">
            {/* Render Static Standard Keys */}
            {staticSpecs.map((spec, index) => (
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
