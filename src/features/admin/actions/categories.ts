'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/guards';
import { createAdminSupabaseClient } from '@/lib/db/server';
import { ROUTES } from '@/lib/config/constants';
import { AdminCategorySchema, type AdminCategoryFormContext } from '../validations/category';
import { actionSuccess, actionError, mapValidationError, mapDbError } from '@/lib/api/action-response';
import { invalidateCategoryCaches } from '@/lib/cache/keys';

export async function createCategoryAction(payload: AdminCategoryFormContext) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const parseResult = AdminCategorySchema.safeParse(payload);
  if (!parseResult.success) {
    return mapValidationError(parseResult.error);
  }

  const { banner_image, ...data } = parseResult.data;

  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert({
      catalog_id: data.catalog_id,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      banner_image_url: banner_image || null,
      is_active: data.is_active,
      sort_order: data.sort_order
    })
    .select('id')
    .single();

  if (error || !newCategory) {
    return mapDbError(error!, 'Category');
  }

  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'category',
    entity_id: newCategory.id,
    action: 'create',
    before_json: {},
    after_json: { ...data, banner_image, id: newCategory.id }
  });

  await invalidateCategoryCaches(data.slug);
  revalidatePath(ROUTES.CATALOG);
  revalidatePath(ROUTES.ADMIN_CATEGORIES);

  return actionSuccess({ categoryId: newCategory.id });
}

export async function updateCategoryAction(id: string, payload: AdminCategoryFormContext) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const parseResult = AdminCategorySchema.safeParse(payload);
  if (!parseResult.success) {
    return mapValidationError(parseResult.error);
  }

  const { banner_image, ...data } = parseResult.data;

  const { data: beforeState } = await supabase.from('categories').select('*').eq('id', id).single();

  const { error } = await supabase
    .from('categories')
    .update({
      catalog_id: data.catalog_id,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      banner_image_url: banner_image || null,
      is_active: data.is_active,
      sort_order: data.sort_order,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    return mapDbError(error, 'Category');
  }

  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'category',
    entity_id: id,
    action: 'update',
    before_json: beforeState || {},
    after_json: { ...data, banner_image, id }
  });

  await invalidateCategoryCaches(data.slug);
  revalidatePath(ROUTES.CATALOG);
  revalidatePath(ROUTES.ADMIN_CATEGORIES);
  revalidatePath(`/catalog/${data.slug}`);

  return actionSuccess();
}

export async function deleteCategoryAction(id: string) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  // Safety: check if any products depend on this category
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (count && count > 0) {
    return actionError(`Cannot delete: ${count} products still belong to this category. Reassign or delete them first.`, 'DEPENDENCY');
  }

  const { data: beforeState } = await supabase.from('categories').select('*').eq('id', id).single();

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    return mapDbError(error, 'Category');
  }

  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'category',
    entity_id: id,
    action: 'delete',
    before_json: beforeState || {},
    after_json: {}
  });

  await invalidateCategoryCaches(beforeState?.slug);
  revalidatePath(ROUTES.CATALOG);
  revalidatePath(ROUTES.ADMIN_CATEGORIES);

  return actionSuccess();
}
