'use client';

import { useFormContext } from 'react-hook-form';
import { AdminProductFormContext } from '../../validations/product';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function SeoFields() {
  const { register, formState: { errors } } = useFormContext<AdminProductFormContext>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Engine Optimization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Title</label>
          <Input {...register('meta_title')} placeholder="Overrides default Product Name in browser tab..." />
          {errors.meta_title && <p className="text-sm text-red-500">{errors.meta_title.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Description</label>
          <Textarea {...register('meta_description')} placeholder="Search engine snippet preview..." rows={2} />
          {errors.meta_description && <p className="text-sm text-red-500">{errors.meta_description.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
