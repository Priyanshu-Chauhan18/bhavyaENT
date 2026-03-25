'use client';

import { useState, useRef } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { AdminProductFormContext } from '../../validations/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Upload, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/db/client';
import { validateImageFile, normalizeFilename } from '@/lib/validation/media-validation';

export function ImageManager() {
  const { control, register, setValue, formState: { errors } } = useFormContext<AdminProductFormContext>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'media_urls',
  });

  const [uploading, setUploading] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  async function handleFileUpload(file: File, index: number) {
    setUploadError(null);

    // Validate
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setUploading(index);

    try {
      const supabase = createClient();
      const fileName = normalizeFilename(file.name);
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { upsert: false });

      if (error) {
        setUploadError(`Upload failed: ${error.message}`);
        setUploading(null);
        return;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Set the URL into the form field
      setValue(`media_urls.${index}.image_url`, data.publicUrl, { shouldDirty: true });
      
      // Auto-fill alt text from filename
      if (!fields[index]?.alt_text) {
        setValue(`media_urls.${index}.alt_text`, file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    } catch (err) {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Images</CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Upload images or paste external URLs.
          </p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => append({ image_url: '', alt_text: '', is_primary: fields.length === 0, sort_order: fields.length })}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Image
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {uploadError}
          </div>
        )}

        {fields.length === 0 ? (
          <div className="text-sm text-slate-500 italic p-6 text-center border border-dashed rounded-lg bg-slate-50">
            No images attached. Click "Add Image" to upload or paste a URL.
          </div>
        ) : (
          fields.map((field, index) => {
            const fieldErrors = errors?.media_urls?.[index];
            const currentUrl = field.image_url;
            const isUploading = uploading === index;
            
            return (
              <div key={field.id} className="flex flex-col gap-3 p-4 bg-slate-50/50 border border-slate-200 rounded-lg">
                <div className="flex items-start gap-4">
                  {/* Thumbnail preview */}
                  <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {currentUrl ? (
                      <img 
                        src={currentUrl} 
                        alt={field.alt_text || 'Preview'} 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    {/* Upload button + URL input */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Image Source</label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isUploading}
                          onClick={() => fileInputRefs.current[index]?.click()}
                          className="gap-2 shrink-0"
                        >
                          {isUploading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                          ) : (
                            <><Upload className="w-4 h-4" /> Upload File</>
                          )}
                        </Button>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          ref={(el) => { fileInputRefs.current[index] = el; }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, index);
                            e.target.value = ''; // reset so same file can be selected again
                          }}
                        />
                        <Input 
                          {...register(`media_urls.${index}.image_url`)} 
                          placeholder="Or paste URL: https://..." 
                          className="flex-1"
                        />
                      </div>
                      {fieldErrors?.image_url && <p className="text-xs text-red-500">{fieldErrors.image_url.message}</p>}
                    </div>
                    
                    {/* Alt text */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Alt Text</label>
                      <Input 
                        {...register(`media_urls.${index}.alt_text`)} 
                        placeholder="Describe this image" 
                      />
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          {...register(`media_urls.${index}.is_primary`)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" 
                        />
                        <span className="text-sm font-medium">Primary Image</span>
                      </label>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-500">Order:</label>
                        <Input 
                          type="number" 
                          className="w-20 h-8" 
                          {...register(`media_urls.${index}.sort_order`, { valueAsNumber: true })} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
