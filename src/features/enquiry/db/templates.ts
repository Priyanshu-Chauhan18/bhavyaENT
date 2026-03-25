import { createServerSupabaseClient } from '@/lib/db/server';

export type EnquiryTemplate = {
  id: string;
  template_text: string;
  whatsapp_number: string;
};

/**
 * Resolves the active enquiry template following strict precedence:
 * 1. Product-specific template
 * 2. Category-specific template
 * 3. Default (Global) template
 * 
 * Executed purely via Server Client to prevent insecure client access.
 */
export async function resolveEnquiryTemplate(
  productId: string,
  categoryId: string
): Promise<EnquiryTemplate | null> {
  const supabase = await createServerSupabaseClient();

  // Prevent PostgREST syntax crashes by dynamically building the OR clause
  // It crashes if we pass 'category_id.eq.null' explicitly instead of 'category_id.is.null'
  let orClause = `product_id.eq.${productId},is_default.eq.true`;
  if (categoryId) {
    orClause += `,category_id.eq.${categoryId}`;
  }

  // Fetch all active templates that could legally match
  const { data: templates, error } = await supabase
    .from('enquiry_templates')
    .select('id, product_id, category_id, is_default, template_text, whatsapp_number')
    .eq('is_active', true)
    .or(orClause);

  if (error || !templates || templates.length === 0) {
    return null;
  }

  // 1. Try Product Match
  const productMatch = templates.find((t) => t.product_id === productId);
  if (productMatch) {
    return {
      id: productMatch.id,
      template_text: productMatch.template_text,
      whatsapp_number: productMatch.whatsapp_number,
    };
  }

  // 2. Try Category Match
  const categoryMatch = templates.find((t) => t.category_id === categoryId);
  if (categoryMatch) {
    return {
      id: categoryMatch.id,
      template_text: categoryMatch.template_text,
      whatsapp_number: categoryMatch.whatsapp_number,
    };
  }

  // 3. Try Default Match
  const defaultMatch = templates.find((t) => t.is_default === true);
  if (defaultMatch) {
    return {
      id: defaultMatch.id,
      template_text: defaultMatch.template_text,
      whatsapp_number: defaultMatch.whatsapp_number,
    };
  }

  return null;
}
