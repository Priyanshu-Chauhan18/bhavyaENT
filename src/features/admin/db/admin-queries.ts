import { createServerSupabaseClient } from '@/lib/db/server';

/**
 * Returns unfiltered admin views of products.
 * Should only be called by admin guards/actions.
 */
export async function getAdminProducts() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Fetch products failed: ${error.message}`);
  return data;
}

export async function getAdminProductById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_specs(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Fetch product failed: ${error.message}`);
  return data;
}

// ------------------------------------------------------------------
// ADMIN WRITES / MUTATIONS
// Below are scaffolded functions ready to be implemented with UI in later phases.
// They assume that the calling layer has already executed `requireAdmin()`.
// ------------------------------------------------------------------

async function logAuditAction(supabase: any, actorId: string, entityType: string, entityId: string, action: string, beforeMap: any, afterMap: any) {
  await supabase.from('audit_logs').insert({
    actor_user_id: actorId,
    entity_type: entityType,
    entity_id: entityId,
    action: action,
    before_json: beforeMap || null,
    after_json: afterMap || null,
  });
}

export async function createProduct(actorId: string, payload: any) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase.from('products').insert([payload]).select().single();
  if (error) throw new Error(`Create product failed: ${error.message}`);
  
  await logAuditAction(supabase, actorId, 'product', data.id, 'CREATE', null, data);
  return data;
}

export async function updateProduct(actorId: string, id: string, payload: any) {
  const supabase = await createServerSupabaseClient();

  const { data: beforeState } = await supabase.from('products').select('*').eq('id', id).single();
  
  const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single();
  if (error) throw new Error(`Update product failed: ${error.message}`);

  await logAuditAction(supabase, actorId, 'product', id, 'UPDATE', beforeState, data);
  return data;
}

export async function archiveProduct(actorId: string, id: string) {
  const supabase = await createServerSupabaseClient();

  // "Soft delete" via archiving the publish_status
  const { data: beforeState } = await supabase.from('products').select('*').eq('id', id).single();

  const { data, error } = await supabase
    .from('products')
    .update({ publish_status: 'archived', is_active: false })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Archive product failed: ${error.message}`);

  await logAuditAction(supabase, actorId, 'product', id, 'ARCHIVE', beforeState, data);
  return data;
}
