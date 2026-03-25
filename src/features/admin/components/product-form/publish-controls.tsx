'use client';

import { useFormContext } from 'react-hook-form';
import { AdminProductFormContext } from '../../validations/product';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function PublishControls() {
  const { register } = useFormContext<AdminProductFormContext>();

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Governance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-900 border-b pb-2 block">Storefront Visibility</label>
          <div className="space-y-2">
            <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="radio" value="published" {...register('publish_status')} className="mt-1" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Published</p>
                <p className="text-xs text-slate-500">Indexable and visible if Active is checked.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="radio" value="draft" {...register('publish_status')} className="mt-1" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Draft</p>
                <p className="text-xs text-slate-500">Hidden from the storefront. Work in progress.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50/30 cursor-pointer hover:bg-red-50 transition-colors">
              <input type="radio" value="archived" {...register('publish_status')} className="mt-1" />
              <div>
                <p className="text-sm font-semibold text-red-900">Archived</p>
                <p className="text-xs text-red-700">Soft-deleted. Hard-hidden across the entire platform.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="flex items-center justify-between cursor-pointer group">
            <div>
              <p className="text-sm font-semibold text-slate-900">Active Toggle</p>
              <p className="text-xs text-slate-500">Immediately strips product from public payload if disabled.</p>
            </div>
            <input type="checkbox" {...register('is_active')} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <div>
              <p className="text-sm font-semibold text-slate-900">Featured Placement</p>
              <p className="text-xs text-slate-500">Maps product to priority carousel locations.</p>
            </div>
            <input type="checkbox" {...register('is_featured')} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
