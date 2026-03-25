'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/guards';
import { createAdminSupabaseClient } from '@/lib/db/server';
import { ROUTES } from '@/lib/config/constants';
import { AdminCatalogSchema, type AdminCatalogFormContext } from '../validations/catalog';
import { actionSuccess, actionError, mapValidationError, mapDbError } from '@/lib/api/action-response';
import { invalidateCatalogCaches } from '@/lib/cache/keys';

export async function createCatalogAction(payload: AdminCatalogFormContext) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const parseResult = AdminCatalogSchema.safeParse(payload);
  if (!parseResult.success) {
    return mapValidationError(parseResult.error);
  }

  const data = parseResult.data;

  const { data: newCatalog, error } = await supabase
    .from('catalogs')
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      is_active: data.is_active,
      sort_order: data.sort_order
    })
    .select('id')
    .single();

  if (error || !newCatalog) {
    return mapDbError(error!, 'Catalog');
  }

  // Audit
  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'catalog',
    entity_id: newCatalog.id,
    action: 'create',
    before_json: {},
    after_json: { ...data, id: newCatalog.id }
  });

  await invalidateCatalogCaches();
  revalidatePath(ROUTES.CATALOG);
  revalidatePath(ROUTES.ADMIN_CATALOGS);

  return actionSuccess({ catalogId: newCatalog.id });
}

export async function updateCatalogAction(id: string, payload: AdminCatalogFormContext) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const parseResult = AdminCatalogSchema.safeParse(payload);
  if (!parseResult.success) {
    return mapValidationError(parseResult.error);
  }

  const data = parseResult.data;

  const { data: beforeState } = await supabase.from('catalogs').select('*').eq('id', id).single();

  const { error } = await supabase
    .from('catalogs')
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      is_active: data.is_active,
      sort_order: data.sort_order,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    return mapDbError(error, 'Catalog');
  }

  // Audit
  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'catalog',
    entity_id: id,
    action: 'update',
    before_json: beforeState || {},
    after_json: { ...data, id }
  });

  await invalidateCatalogCaches();
  revalidatePath(ROUTES.CATALOG);
  revalidatePath(ROUTES.ADMIN_CATALOGS);

  return actionSuccess();
}

export async function deleteCatalogAction(id: string) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  // Safety: check if any categories depend on this catalog
  const { count } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('catalog_id', id);

  if (count && count > 0) {
    return actionError(`Cannot delete: ${count} categories still depend on this catalog. Reassign or delete them first.`, 'DEPENDENCY');
  }

  const { data: beforeState } = await supabase.from('catalogs').select('*').eq('id', id).single();

  const { error } = await supabase.from('catalogs').delete().eq('id', id);
  if (error) {
    return mapDbError(error, 'Catalog');
  }

  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'catalog',
    entity_id: id,
    action: 'delete',
    before_json: beforeState || {},
    after_json: {}
  });

  await invalidateCatalogCaches();
  revalidatePath(ROUTES.CATALOG);
  revalidatePath(ROUTES.ADMIN_CATALOGS);

  return actionSuccess();
}
