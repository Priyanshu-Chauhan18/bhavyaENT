'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingsSchema, type SettingsFormContext } from '../validations/settings';
import { saveSettingsAction } from '../actions/settings';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SettingsForm({ initialData }: { initialData: SettingsFormContext }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormContext>({
    resolver: zodResolver(SettingsSchema) as any,
    defaultValues: initialData
  });

  const onSubmit = async (data: SettingsFormContext) => {
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const response = await saveSettingsAction(data);
      if (!response.success) {
        setGlobalError(response.error);
        return;
      }
      
      router.refresh(); // Update the server component UI above
    } catch (err) {
      console.error(err);
      setGlobalError('Unexpected connection failure while syncing settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium tracking-tight">
          Warning: {globalError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Enterprise Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input {...register('company_name')} placeholder="e.g. Acme Industries" />
              {errors.company_name && <p className="text-sm text-red-500">{errors.company_name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Public Contact Email</label>
              <Input type="email" {...register('company_email')} placeholder="hello@example.com" />
              {errors.company_email && <p className="text-sm text-red-500">{errors.company_email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Physical Address</label>
              <Textarea {...register('company_address')} placeholder="123 Industrial Park..." rows={3} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Service Phone</label>
              <Input {...register('company_phone')} placeholder="+1 (555) 000-0000" />
            </div>
          </CardContent>
        </Card>

        {/* Technical Configurations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Telemetry & SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Global WhatsApp Target (Override)</label>
              <Input {...register('whatsapp_number')} placeholder="+919876543210" />
              <p className="text-xs text-slate-500">Leaving this blank reverts to hardcoded `.env` default if present.</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default SEO Title</label>
                <Input {...register('default_seo_title')} placeholder="Premium Cap Manufacturers" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default SEO Description</label>
                <Textarea {...register('default_seo_description')} placeholder="Leading supplier of standard..." rows={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Overrides */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Storefront Marketing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Homepage Hero Headline</label>
              <Input {...register('hero_headline')} placeholder="Unmatched Quality at Scale" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Homepage Hero Subheadline</label>
              <Input {...register('hero_subheadline')} placeholder="View our wholesale selection..." />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 -mx-6 -mb-6 p-6 bg-slate-50 border-t border-slate-200 mt-8 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Syncing Systems...</>
          ) : (
            <><Save className="w-5 h-5 mr-2" /> Commit Global Configuration</>
          )}
        </Button>
      </div>
    </form>
  );
}
