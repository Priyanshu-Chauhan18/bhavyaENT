'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminProductSchema, AdminProductFormContext } from '../../validations/product';
import { createProductAction, updateProductAction } from '../../actions/products';

import { CoreFields } from './core-fields';
import { SeoFields } from './seo-fields';
import { SpecsManager } from './specs-manager';
import { ImageManager } from './image-manager';
import { PublishControls } from './publish-controls';

import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { ROUTES } from '@/lib/config/constants';
import Link from 'next/link';

interface ProductFormProps {
  initialData?: AdminProductFormContext;
  categories: { id: string; name: string }[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const methods = useForm<AdminProductFormContext>({
    resolver: zodResolver(AdminProductSchema) as any,
    defaultValues: initialData || {
      public_specs: [],
      private_specs: [],
      media_urls: [],
      is_active: false,
      is_featured: false,
      publish_status: 'draft',
      category_id: categories.length > 0 ? categories[0].id : ''
    }
  });

  const onSubmit = async (data: AdminProductFormContext) => {
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const isCreate = !initialData?.id;
      const response = isCreate 
        ? await createProductAction(data)
        : await updateProductAction(initialData.id!, data);

      if (!response.success) {
        setGlobalError(response.error);
        return;
      }

      // Success Redirect
      router.push(ROUTES.ADMIN_PRODUCTS);
      router.refresh();

    } catch (err: any) {
      console.error('Submission crash:', err);
      setGlobalError('An unexpected error occurred while communicating with the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Top Header Nav */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <Link href={ROUTES.ADMIN_PRODUCTS} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {initialData ? 'Edit Product' : 'Create New Product'}
            </h1>
            <p className="text-sm text-slate-500">
              {initialData ? `Governing product identity for: ${initialData.name}` : 'Instantiate a new physical good into the system.'}
            </p>
          </div>
        </div>
      </div>

      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium tracking-tight">
          Warning: {globalError}
        </div>
      )}

      {/* Primary Builder Interface */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit as any)} className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Left Column (70%) */}
          <div className="flex-1 w-full space-y-6">
            <CoreFields categories={categories} />
            <SeoFields />
            <SpecsManager 
              type="public_specs" 
              title="Public Specifications" 
              description="Metrics permanently visible to all Guests and authenticated users." 
            />
            <SpecsManager 
              type="private_specs" 
              title="Protected Specifications" 
              description="Highly guarded metrics exclusive ONLY to safely authenticated sessions." 
            />
            <ImageManager />
          </div>

          {/* Right Sidebar (30%) */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <PublishControls />
            
            {/* Sticky Action Footer purely for saving */}
            <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl sticky top-[60vh]">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Committing...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" /> 
                    {initialData ? 'Commit Update' : 'Initialize Product'}
                  </>
                )}
              </Button>
            </div>
          </div>

        </form>
      </FormProvider>
    </div>
  );
}
