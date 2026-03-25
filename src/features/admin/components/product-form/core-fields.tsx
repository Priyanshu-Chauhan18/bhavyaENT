'use client';

import { useFormContext } from 'react-hook-form';
import { AdminProductFormContext } from '../../validations/product';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function CoreFields({ categories }: { categories: { id: string, name: string }[] }) {
  const { register, setValue, formState: { errors } } = useFormContext<AdminProductFormContext>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Identity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name *</label>
            <Input 
              {...register('name')} 
              onChange={(e) => {
                register('name').onChange(e);
                const generatedSlug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true });
              }}
              placeholder="e.g. 26mm Standard Crown" 
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL Slug *</label>
            <Input {...register('slug')} placeholder="e.g. 26mm-standard-crown" />
            {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Internal SKU *</label>
            <Input {...register('sku')} placeholder="e.g. CROWN-001" />
            {errors.sku && <p className="text-sm text-red-500">{errors.sku.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <select 
              {...register('category_id')}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            >
              <option value="">Select Category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-sm text-red-500">{errors.category_id.message}</p>}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium">Short Teaser Description</label>
          <Textarea {...register('short_description')} placeholder="Brief overview for the storefront..." rows={2} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Full Technical Description</label>
          <Textarea {...register('full_description')} placeholder="Detailed deep dive..." rows={4} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <Input {...register('color')} placeholder="e.g. Silver, Gold" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Material</label>
            <Input {...register('material')} placeholder="e.g. Tinplate" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">MOQ</label>
            <Input type="number" {...register('min_order_quantity', { valueAsNumber: true })} placeholder="100000" />
            {errors.min_order_quantity && <p className="text-sm text-red-500">{errors.min_order_quantity.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Lead Time (Days)</label>
            <Input type="number" {...register('lead_time_days', { valueAsNumber: true })} placeholder="14" />
            {errors.lead_time_days && <p className="text-sm text-red-500">{errors.lead_time_days.message}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
