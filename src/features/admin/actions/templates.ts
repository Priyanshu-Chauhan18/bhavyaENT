'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/guards';
import { createAdminSupabaseClient } from '@/lib/db/server';
import { ROUTES } from '@/lib/config/constants';
import { AdminTemplateSchema, type AdminTemplateFormContext } from '../validations/template';
import { actionSuccess, actionError, mapValidationError, mapDbError } from '@/lib/api/action-response';

// Internal helper protecting against duplicate active templates in the exact same scope
async function checkDuplicateScope(
  supabase: any, 
  data: AdminTemplateFormContext, 
  excludeId?: string
): Promise<string | null> {
  if (!data.is_active) return null; // Inactive templates don't cause routing conflicts

  let query = supabase.from('enquiry_templates').select('id').eq('is_active', true);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  if (data.is_default) {
    const { data: existingDefaults } = await query.eq('is_default', true);
    if (existingDefaults && existingDefaults.length > 0) {
      return 'An active Global Default template already exists. Please deactivate the existing one first to prevent routing conflicts.';
    }
  } else if (data.product_id) {
    const { data: existingProductTpls } = await query.eq('product_id', data.product_id);
    if (existingProductTpls && existingProductTpls.length > 0) {
      return 'An active template already targets this specific Product. Please deactivate the existing override first.';
    }
  } else if (data.category_id) {
    const { data: existingCategoryTpls } = await query.eq('category_id', data.category_id);
    if (existingCategoryTpls && existingCategoryTpls.length > 0) {
      return 'An active template already targets this specific Category. Please deactivate the existing override first.';
    }
  } else {
    return 'Template must have a defined scope (Global, Category, or Product).';
  }

  return null;
}

export async function createTemplateAction(payload: AdminTemplateFormContext) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const parseResult = AdminTemplateSchema.safeParse(payload);
  if (!parseResult.success) {
    return mapValidationError(parseResult.error);
  }

  const { product_id, category_id, ...data } = parseResult.data;

  // Clean empty strings to genuine nulls for DB integrity
  const cleanProductId = product_id || null;
  const cleanCategoryId = category_id || null;

  // Verify business constraints (no overlapping priorities)
  const duplicateError = await checkDuplicateScope(supabase, { ...data, product_id: cleanProductId, category_id: cleanCategoryId });
  if (duplicateError) return actionError(duplicateError, 'DUPLICATE_SCOPE');

  const { data: newTemplate, error } = await supabase
    .from('enquiry_templates')
    .insert({
      template_name: data.template_name,
      template_text: data.template_text,
      whatsapp_number: data.whatsapp_number,
      product_id: cleanProductId,
      category_id: cleanCategoryId,
      is_default: data.is_default,
      is_active: data.is_active
    })
    .select('id')
    .single();

  if (error || !newTemplate) {
    return mapDbError(error!, 'Template');
  }

  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'enquiry_template',
    entity_id: newTemplate.id,
    action: 'create',
    before_json: {},
    after_json: { ...data, product_id: cleanProductId, category_id: cleanCategoryId, id: newTemplate.id }
  });

  revalidatePath(ROUTES.ADMIN_TEMPLATES);
  return actionSuccess({ templateId: newTemplate.id });
}

export async function updateTemplateAction(id: string, payload: AdminTemplateFormContext) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const parseResult = AdminTemplateSchema.safeParse(payload);
  if (!parseResult.success) {
    return mapValidationError(parseResult.error);
  }

  const { product_id, category_id, ...data } = parseResult.data;

  const cleanProductId = product_id || null;
  const cleanCategoryId = category_id || null;

  const duplicateError = await checkDuplicateScope(supabase, { ...data, product_id: cleanProductId, category_id: cleanCategoryId }, id);
  if (duplicateError) return actionError(duplicateError, 'DUPLICATE_SCOPE');

  const { data: beforeState } = await supabase.from('enquiry_templates').select('*').eq('id', id).single();

  const { error } = await supabase
    .from('enquiry_templates')
    .update({
      template_name: data.template_name,
      template_text: data.template_text,
      whatsapp_number: data.whatsapp_number,
      product_id: cleanProductId,
      category_id: cleanCategoryId,
      is_default: data.is_default,
      is_active: data.is_active,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    return mapDbError(error, 'Template');
  }

  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'enquiry_template',
    entity_id: id,
    action: 'update',
    before_json: beforeState || {},
    after_json: { ...data, product_id: cleanProductId, category_id: cleanCategoryId, id }
  });

  revalidatePath(ROUTES.ADMIN_TEMPLATES);
  return actionSuccess();
}

export async function deleteTemplateAction(id: string) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const { data: beforeState } = await supabase.from('enquiry_templates').select('*').eq('id', id).single();

  const { error } = await supabase.from('enquiry_templates').delete().eq('id', id);
  if (error) {
    return mapDbError(error, 'Template');
  }

  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'enquiry_template',
    entity_id: id,
    action: 'delete',
    before_json: beforeState || {},
    after_json: {}
  });

  revalidatePath(ROUTES.ADMIN_TEMPLATES);
  return actionSuccess();
}
