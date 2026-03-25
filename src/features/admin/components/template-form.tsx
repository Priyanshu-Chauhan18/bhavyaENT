'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { AdminTemplateSchema, type AdminTemplateFormContext } from '../validations/template';
import { createTemplateAction, updateTemplateAction } from '../actions/templates';
import { ROUTES } from '@/lib/config/constants';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '../../../components/ui/switch';
import { Select } from '@/components/ui/select';
import { Loader2, Save, ArrowLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export function TemplateForm({ 
  initialData, 
  categories,
  products
}: { 
  initialData?: AdminTemplateFormContext,
  categories: { id: string; name: string }[],
  products: { id: string; name: string }[]
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Derive initial scope radio based on existing data
  let defaultScope = 'global';
  if (initialData?.product_id) defaultScope = 'product';
  else if (initialData?.category_id) defaultScope = 'category';

  const [scope, setScope] = useState<'global' | 'category' | 'product'>(defaultScope as any);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AdminTemplateFormContext>({
    resolver: zodResolver(AdminTemplateSchema) as any,
    defaultValues: initialData || {
      is_active: true,
      is_default: true,
      template_name: '',
      template_text: 'Hi, I want the {{product_name}} ({{sku}}) !',
      whatsapp_number: '',
      product_id: '',
      category_id: ''
    }
  });

  const isActive = watch('is_active');
  const watchCategoryId = watch('category_id');
  const watchProductId = watch('product_id');

  const onSubmit = async (data: AdminTemplateFormContext) => {
    setIsSubmitting(true);
    setGlobalError(null);

    // Enforce Scope cleanliness
    if (scope === 'global') {
      data.is_default = true;
      data.category_id = '';
      data.product_id = '';
    } else if (scope === 'category') {
      data.is_default = false;
      data.product_id = '';
      if (!data.category_id) {
         setGlobalError('You must select a target Category for a Category Override.');
         setIsSubmitting(false);
         return;
      }
    } else if (scope === 'product') {
      data.is_default = false;
      data.category_id = '';
      if (!data.product_id) {
         setGlobalError('You must select a target Product for a Product Override.');
         setIsSubmitting(false);
         return;
      }
    }

    try {
      const isCreate = !initialData?.id;
      const response = isCreate 
        ? await createTemplateAction(data)
        : await updateTemplateAction(initialData.id!, data);

      if (!response.success) {
        setGlobalError(response.error);
        return;
      }

      router.push(ROUTES.ADMIN_TEMPLATES);
      router.refresh();
    } catch (err) {
      setGlobalError('Unexpected error communicating with the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <Link href={ROUTES.ADMIN_TEMPLATES} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {initialData ? 'Edit Enquiry Template' : 'Create New Template'}
          </h1>
        </div>
      </div>

      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium tracking-tight">
          <strong>Validation Warning:</strong> {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle>Template Targeting Priority</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <label className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-colors ${scope === 'global' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
                 <input type="radio" className="sr-only" checked={scope === 'global'} onChange={() => setScope('global')} />
                 <div className="font-semibold text-slate-800">Global Default</div>
                 <div className="text-xs text-slate-500 mt-1">Fallback if no overrides exist</div>
              </label>
              <label className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-colors ${scope === 'category' ? 'border-purple-600 bg-purple-50' : 'border-slate-200 bg-white hover:border-purple-300'}`}>
                 <input type="radio" className="sr-only" checked={scope === 'category'} onChange={() => setScope('category')} />
                 <div className="font-semibold text-slate-800">Category Override</div>
                 <div className="text-xs text-slate-500 mt-1">Applies to all products inside</div>
              </label>
              <label className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-colors ${scope === 'product' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-300'}`}>
                 <input type="radio" className="sr-only" checked={scope === 'product'} onChange={() => setScope('product')} />
                 <div className="font-semibold text-slate-800">Product Specific</div>
                 <div className="text-xs text-slate-500 mt-1">Highest precision override</div>
              </label>
            </div>

            {scope === 'category' && (
              <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium">Select Target Category *</label>
                <Select 
                  options={categories.map(c => ({ value: c.id, label: c.name }))}
                  value={watchCategoryId || ''} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setValue('category_id', e.target.value)}
                  placeholder="Choose Category..."
                />
              </div>
            )}

            {scope === 'product' && (
              <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium">Select Target Product *</label>
                <Select 
                  options={products.map(p => ({ value: p.id, label: p.name }))}
                  value={watchProductId || ''} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setValue('product_id', e.target.value)}
                  placeholder="Choose Product..."
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Internal Template Reference Name *</label>
                <Input {...register('template_name')} placeholder="e.g. Standard Closures Enquiry" />
                {errors.template_name && <p className="text-sm text-red-500">{errors.template_name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp Phone Destination *</label>
                <Input {...register('whatsapp_number')} placeholder="+919876543210" />
                {errors.whatsapp_number && <p className="text-sm text-red-500">{errors.whatsapp_number.message}</p>}
              </div>
            </div>

            <div className="space-y-2 pt-2 relative">
              <div className="flex items-center justify-between">
                 <label className="text-sm font-medium">Message Body *</label>
              </div>
              <Textarea 
                {...register('template_text')} 
                placeholder="Hi, I am interested in {{product_name}}." 
                rows={5} 
                className="font-mono text-sm leading-relaxed"
              />
              {errors.template_text && <p className="text-sm text-red-500">{errors.template_text.message}</p>}
              
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 mt-2 border border-slate-100 leading-relaxed grid gap-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1 mb-1"><Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Supported Injection Variables:</div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-blue-700">
                  <span>{`{{product_name}}`}</span>
                  <span>{`{{sku}}`}</span>
                  <span>{`{{color}}`}</span>
                  <span>{`{{product_url}}`}</span>
                  <span>{`{{user_name}}`}</span>
                  <span>{`{{company_name}}`}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-lg mt-4">
              <div>
                <div className="font-semibold text-slate-800">Template Activation</div>
                <div className="text-sm text-slate-500">Enable this template for immediate routing intercept.</div>
              </div>
              <Switch 
                checked={isActive} 
                onCheckedChange={(checked: boolean) => setValue('is_active', checked, { shouldDirty: true })} 
              />
            </div>

          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Link href={ROUTES.ADMIN_TEMPLATES}>
            <Button variant="outline" type="button" className="h-11">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="h-11 px-8 font-semibold bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            {initialData ? 'Commit Template' : 'Initialize Template'}
          </Button>
        </div>
      </form>
    </div>
  );
}
