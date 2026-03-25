'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { AdminCategorySchema, type AdminCategoryFormContext } from '../validations/category';
import { createCategoryAction, updateCategoryAction } from '../actions/categories';
import { ROUTES } from '@/lib/config/constants';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '../../../components/ui/switch';
import { Select } from '@/components/ui/select';
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export function CategoryForm({ 
  initialData, 
  catalogs 
}: { 
  initialData?: AdminCategoryFormContext,
  catalogs: { id: string; name: string }[]
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AdminCategoryFormContext>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(AdminCategorySchema) as any,
    defaultValues: initialData || {
      is_active: true,
      sort_order: 0,
      name: '',
      slug: '',
      description: '',
      banner_image: '',
      catalog_id: catalogs[0]?.id || ''
    }
  });

  const isActive = watch('is_active');
  const catalogId = watch('catalog_id');

  const onSubmit = async (data: AdminCategoryFormContext) => {
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const isCreate = !initialData?.id;
      const response = isCreate 
        ? await createCategoryAction(data)
        : await updateCategoryAction(initialData.id!, data);

      if (!response.success) {
        setGlobalError(response.error);
        return;
      }

      router.push(ROUTES.ADMIN_CATEGORIES);
      router.refresh();
    } catch (e) {
      setGlobalError('An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <Link href={ROUTES.ADMIN_CATEGORIES} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {initialData ? 'Edit Category' : 'Create New Category'}
          </h1>
        </div>
      </div>

      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium tracking-tight">
          Warning: {globalError}
        </div>
      )}

      {catalogs.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm mb-6">
          <strong>No Active Catalogs Found:</strong> You must create a Catalog before configuring Categories.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium">Mapped Catalog Parent *</label>
              <Select 
                options={catalogs.map(c => ({ value: c.id, label: c.name }))}
                value={catalogId} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setValue('catalog_id', e.target.value, { shouldValidate: true })}
                placeholder="Select a parent catalog"
              />
              {errors.catalog_id && <p className="text-sm text-red-500">{errors.catalog_id.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name *</label>
                <Input 
                  {...register('name')} 
                  onChange={(e) => {
                    register('name').onChange(e);
                    const val = e.target.value;
                    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setValue('slug', slug, { shouldValidate: true, shouldDirty: true });
                  }}
                  placeholder="e.g. 26mm Crown Caps" 
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug *</label>
                <Input {...register('slug')} placeholder="e.g. 26mm-crown-caps" />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <Input type="number" {...register('sort_order', { valueAsNumber: true })} />
                {errors.sort_order && <p className="text-sm text-red-500">{errors.sort_order.message}</p>}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea {...register('description')} placeholder="Specific sub-grouping context..." rows={3} />
            </div>

            {/* Simple Image URL handler matching Phase 7 semantics */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Banner Image URL
              </label>
              <Input {...register('banner_image')} placeholder="https://..." />
              {errors.banner_image && <p className="text-sm text-red-500">{errors.banner_image.message}</p>}
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-lg mt-4">
              <div>
                <div className="font-semibold text-slate-800">Category Visibility</div>
                <div className="text-sm text-slate-500">Toggle public display of this specific structural branch.</div>
              </div>
              <Switch 
                checked={isActive} 
                onCheckedChange={(checked: boolean) => setValue('is_active', checked, { shouldDirty: true })} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Link href={ROUTES.ADMIN_CATEGORIES}>
            <Button variant="outline" type="button" className="h-11">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting || catalogs.length === 0} className="h-11 px-8 font-semibold bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            {initialData ? 'Commit Update' : 'Initialize Category'}
          </Button>
        </div>
      </form>
    </div>
  );
}
