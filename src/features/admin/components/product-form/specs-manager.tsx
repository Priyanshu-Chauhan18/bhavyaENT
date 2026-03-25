'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { AdminProductFormContext } from '../../validations/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

type SpecType = 'public_specs' | 'private_specs';

export function SpecsManager({ type, title, description }: { type: SpecType, title: string, description: string }) {
  const { control, register, formState: { errors } } = useFormContext<AdminProductFormContext>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: type,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => append({ spec_key: '', spec_value: '' })}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Row
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {fields.length === 0 ? (
          <div className="text-sm text-slate-500 italic p-4 text-center border border-dashed rounded-lg">
            No specifications attached yet.
          </div>
        ) : (
          fields.map((field, index) => {
            const fieldErrors = errors[type]?.[index];
            return (
              <div key={field.id} className="flex flex-col sm:flex-row gap-3 items-start">
                <div className="flex-1 w-full space-y-1">
                  <Input 
                    {...register(`${type}.${index}.spec_key`)} 
                    placeholder="Key (e.g. Dimensions)" 
                  />
                  {fieldErrors?.spec_key && <p className="text-xs text-red-500">{fieldErrors.spec_key.message}</p>}
                </div>
                <div className="flex-[2] w-full space-y-1">
                  <Input 
                    {...register(`${type}.${index}.spec_value`)} 
                    placeholder="Value (e.g. 26mm x 6mm)" 
                  />
                  {fieldErrors?.spec_value && <p className="text-xs text-red-500">{fieldErrors.spec_value.message}</p>}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  className="shrink-0 w-10 h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
