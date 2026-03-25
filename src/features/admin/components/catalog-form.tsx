'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { AdminCatalogSchema, type AdminCatalogFormContext } from '../validations/catalog';
import { createCatalogAction, updateCatalogAction } from '../actions/catalogs';
import { ROUTES } from '@/lib/config/constants';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '../../../components/ui/switch';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function CatalogForm({ initialData }: { initialData?: AdminCatalogFormContext }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AdminCatalogFormContext>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(AdminCatalogSchema) as any,
    defaultValues: initialData || {
      is_active: true,
      sort_order: 0,
      name: '',
      slug: '',
      description: ''
    }
  });

  const isActive = watch('is_active');

  const onSubmit = async (data: AdminCatalogFormContext) => {
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const isCreate = !initialData?.id;
      const response = isCreate 
        ? await createCatalogAction(data)
        : await updateCatalogAction(initialData.id!, data);

      if (!response.success) {
        setGlobalError(response.error);
        return;
      }

      router.push(ROUTES.ADMIN_CATALOGS);
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
        <Link href={ROUTES.ADMIN_CATALOGS} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {initialData ? 'Edit Catalog' : 'Create New Catalog'}
          </h1>
        </div>
      </div>

      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium tracking-tight">
          Warning: {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Catalog Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catalog Name *</label>
                <Input 
                  {...register('name')} 
                  onChange={(e) => {
                    register('name').onChange(e);
                    const val = e.target.value;
                    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setValue('slug', slug, { shouldValidate: true, shouldDirty: true });
                  }}
                  placeholder="e.g. Standard Closures" 
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug *</label>
                <Input {...register('slug')} placeholder="e.g. standard-closures" />
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
              <Textarea {...register('description')} placeholder="Brief overview of the catalog assortment..." rows={3} />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-lg mt-4">
              <div>
                <div className="font-semibold text-slate-800">Catalog Visibility</div>
                <div className="text-sm text-slate-500">Toggle public display of this catalog. Hiding a catalog implicitly hides its categories visually.</div>
              </div>
              <Switch 
                checked={isActive} 
                onCheckedChange={(checked: boolean) => setValue('is_active', checked, { shouldDirty: true })} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Link href={ROUTES.ADMIN_CATALOGS}>
            <Button variant="outline" type="button" className="h-11">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="h-11 px-8 font-semibold bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            {initialData ? 'Commit Update' : 'Initialize Catalog'}
          </Button>
        </div>
      </form>
    </div>
  );
}
