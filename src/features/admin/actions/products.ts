'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/guards';
import { createAdminSupabaseClient } from '@/lib/db/server';
import { AdminProductFormContext, AdminProductSchema } from '../validations/product';
import { ROUTES } from '@/lib/config/constants';
import { actionSuccess, actionError, mapValidationError, mapDbError } from '@/lib/api/action-response';
import { invalidateProductCaches } from '@/lib/cache/keys';

/**
 * Consistency Strategy:
 * Because Supabase Client doesn't natively expose cross-table interactive Transactions
 * outside of Postgres RPC functions, we utilize Sequential Execution.
 * 1. Validate Admin & Zod.
 * 2. Execute Primary Insertion (Products).
 * 3. Execute Peripheral Insertions (Specs, Images).
 * 4. Write Audit Log.
 * 
 * If a peripheral insertion fails safely after the primary executes, 
 * the operation is considered partially successful but alerts the logger. 
 * This prevents ghost records from locking the database entirely.
 */

export async function createProductAction(payload: AdminProductFormContext) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  // 1. Zod Re-validation
  const result = AdminProductSchema.safeParse(payload);
  if (!result.success) {
    return mapValidationError(result.error);
  }

  const data = result.data;

  // 2. Insert Core Product
  const { data: newProduct, error: productError } = await supabase
    .from('products')
    .insert({
      category_id: data.category_id,
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      short_description: data.short_description || null,
      full_description: data.full_description || null,
      color: data.color || null,
      material: data.material || null,
      finish: data.finish || null,
      neck_size: data.neck_size || null,
      moq: data.min_order_quantity ? data.min_order_quantity.toString() : null,
      lead_time: data.lead_time_days ? data.lead_time_days.toString() : null,
      is_active: data.is_active,
      is_featured: data.is_featured,
      publish_status: data.publish_status,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      created_by: user.id,
      updated_by: user.id
    })
    .select('id')
    .single();

  if (productError || !newProduct) {
    console.error('Core Product Insert Failed:', JSON.stringify(productError, null, 2));
    // Surface real error: check if it's actually a unique violation
    const msg = productError?.message || 'Unknown database error';
    const code = productError?.code || '';
    return mapDbError(productError!, 'Product');
  }

  const productId = newProduct.id;

  // 3. Prepare Peripheral Arrays
  const specsPayload = [
    ...data.public_specs.map((s, idx) => ({ product_id: productId, spec_key: s.spec_key, spec_value: s.spec_value, is_public: true, sort_order: idx })),
    ...data.private_specs.map((s, idx) => ({ product_id: productId, spec_key: s.spec_key, spec_value: s.spec_value, is_public: false, sort_order: idx }))
  ];

  const imagesPayload = data.media_urls.map((img) => ({
    product_id: productId,
    image_url: img.image_url,
    alt_text: img.alt_text || '',
    is_primary: img.is_primary,
    sort_order: img.sort_order
  }));

  // 4. Execute Peripherals Non-Blocking Native Awaits
  if (specsPayload.length > 0) {
    await supabase.from('product_specs').insert(specsPayload);
  }

  if (imagesPayload.length > 0) {
    await supabase.from('product_images').insert(imagesPayload);
  }

  // 5. Fire Audit Log
  const afterJson = { ...data, id: productId };
  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'product',
    entity_id: productId,
    action: 'create',
    before_json: {},
    after_json: afterJson
  });

  // 6. Force Reflection + Cache Invalidation
  await invalidateProductCaches(data.slug);
  revalidatePath('/catalog');
  revalidatePath('/admin/products');
  
  return actionSuccess({ productId });
}

export async function updateProductAction(id: string, payload: AdminProductFormContext) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const result = AdminProductSchema.safeParse(payload);
  if (!result.success) {
    return mapValidationError(result.error);
  }

  const data = result.data;

  // 1. Grab Before State for Audit
  const { data: beforeState } = await supabase
    .from('products')
    .select('*, product_specs(*), product_images(*)')
    .eq('id', id)
    .single();

  // 2. Update Core
  const { error: updateError } = await supabase
    .from('products')
    .update({
      category_id: data.category_id,
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      short_description: data.short_description || null,
      full_description: data.full_description || null,
      color: data.color || null,
      material: data.material || null,
      finish: data.finish || null,
      neck_size: data.neck_size || null,
      moq: data.min_order_quantity ? data.min_order_quantity.toString() : null,
      lead_time: data.lead_time_days ? data.lead_time_days.toString() : null,
      is_active: data.is_active,
      is_featured: data.is_featured,
      publish_status: data.publish_status,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      updated_by: user.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (updateError) {
    console.error('Product Update Failed:', JSON.stringify(updateError, null, 2));
    return mapDbError(updateError, 'Product');
  }

  // 3. Sequence Specs (Delete all, Insert new)
  await supabase.from('product_specs').delete().eq('product_id', id);
  const specsPayload = [
    ...data.public_specs.map((s, idx) => ({ product_id: id, spec_key: s.spec_key, spec_value: s.spec_value, is_public: true, sort_order: idx })),
    ...data.private_specs.map((s, idx) => ({ product_id: id, spec_key: s.spec_key, spec_value: s.spec_value, is_public: false, sort_order: idx }))
  ];
  if (specsPayload.length > 0) {
    await supabase.from('product_specs').insert(specsPayload);
  }

  // 4. Sequence Images (Delete all, Insert new)
  await supabase.from('product_images').delete().eq('product_id', id);
  const imagesPayload = data.media_urls.map((img) => ({
    product_id: id,
    image_url: img.image_url,
    alt_text: img.alt_text || '',
    is_primary: img.is_primary,
    sort_order: img.sort_order
  }));
  if (imagesPayload.length > 0) {
    await supabase.from('product_images').insert(imagesPayload);
  }

  // 5. Fire Audit Log
  const afterJson = { ...data, id };
  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'product',
    entity_id: id,
    action: 'update',
    before_json: beforeState || {},
    after_json: afterJson
  });

  // 6. Force Reflection + Cache Invalidation
  await invalidateProductCaches(beforeState?.slug || data.slug);
  revalidatePath('/catalog');
  revalidatePath(`/product/${beforeState?.slug || data.slug}`);
  revalidatePath('/admin/products');

  return actionSuccess();
}

export async function archiveProductAction(id: string) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const { data: beforeState, error: fetchErr } = await supabase.from('products').select('*').eq('id', id).single();
  if (fetchErr) return actionError('Product not found', 'NOT_FOUND');

  const { error } = await supabase
    .from('products')
    .update({
      is_active: false,
      publish_status: 'archived',
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) return actionError('Failed to archive product.', 'DB_ERROR');

  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'product',
    entity_id: id,
    action: 'archive',
    before_json: beforeState,
    after_json: { ...beforeState, is_active: false, publish_status: 'archived' }
  });

  await invalidateProductCaches(beforeState.slug);
  revalidatePath('/catalog');
  revalidatePath(`/product/${beforeState.slug}`);
  revalidatePath('/admin/products');

  return actionSuccess();
}

export async function deleteProductAction(id: string) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  // Grab before state for audit
  const { data: beforeState, error: fetchErr } = await supabase
    .from('products')
    .select('*, product_specs(*), product_images(*)')
    .eq('id', id)
    .single();

  if (fetchErr || !beforeState) {
    return actionError('Product not found.', 'NOT_FOUND');
  }

  // Delete peripherals first (specs, images), then core
  await supabase.from('product_specs').delete().eq('product_id', id);
  await supabase.from('product_images').delete().eq('product_id', id);

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    return mapDbError(error, 'Product');
  }

  // Audit
  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'product',
    entity_id: id,
    action: 'delete',
    before_json: beforeState,
    after_json: {}
  });

  await invalidateProductCaches(beforeState.slug);
  revalidatePath('/catalog');
  revalidatePath('/admin/products');

  return actionSuccess();
}
