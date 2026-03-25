import { createAdminSupabaseClient } from '@/lib/db/server';

export type AdminTemplateRow = {
  id: string;
  template_name: string;
  template_text: string;
  whatsapp_number: string;
  product_id: string | null;
  category_id: string | null;
  is_default: boolean;
  is_active: boolean;
  updated_at: string;
  product: { name: string } | null;
  category: { name: string } | null;
};

export async function getAdminTemplatesList(): Promise<AdminTemplateRow[]> {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase
    .from('enquiry_templates')
    .select(`
      id,
      template_name,
      template_text,
      whatsapp_number,
      product_id,
      category_id,
      is_default,
      is_active,
      updated_at,
      product:products(name),
      category:categories(name)
    `)
    .order('is_default', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin templates list:', error);
    return [];
  }

  return data.map((row: any) => ({
    ...row,
    product: row.product ? { name: row.product.name } : null,
    category: row.category ? { name: row.category.name } : null
  })) as AdminTemplateRow[];
}

export async function getAdminTemplateById(id: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('enquiry_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}
