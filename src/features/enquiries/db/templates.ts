import { createServerSupabaseClient } from '@/lib/db/server';

export type EnquiryTemplate = {
  id: string;
  template_name: string;
  template_text: string;
  whatsapp_number: string;
};

export async function getProductTemplate(productId: string): Promise<EnquiryTemplate | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('enquiry_templates')
    .select('id, template_name, template_text, whatsapp_number')
    .eq('product_id', productId)
    .eq('is_active', true)
    .single();

  return data;
}

export async function getCategoryTemplate(categoryId: string): Promise<EnquiryTemplate | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('enquiry_templates')
    .select('id, template_name, template_text, whatsapp_number')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .single();

  return data;
}

export async function getDefaultTemplate(): Promise<EnquiryTemplate | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('enquiry_templates')
    .select('id, template_name, template_text, whatsapp_number')
    .eq('is_default', true)
    .eq('is_active', true)
    .limit(1)
    .single();

  return data;
}

/**
 * Resolves the hierarchical template applying Fallback Rules:
 * Product-specific -> Category-specific -> Default.
 */
export async function getApplicableEnquiryTemplate(productId: string, categoryId: string): Promise<EnquiryTemplate | null> {
  let template = await getProductTemplate(productId);
  if (template) return template;

  template = await getCategoryTemplate(categoryId);
  if (template) return template;

  return getDefaultTemplate();
}
