'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/guards';
import { createAdminSupabaseClient } from '@/lib/db/server';
import { ROUTES } from '@/lib/config/constants';
import { actionSuccess, actionError } from '@/lib/api/action-response';

export async function toggleUserRoleAction(targetProfileId: string, currentRole: 'admin' | 'customer') {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  // Prevent self-demotion — admins cannot demote their own account
  if (currentRole === 'admin' && targetProfileId === user.id) {
    return actionError('Self-demotion is not allowed. Another admin must change your role.', 'SELF_DEMOTION');
  }

  // If attempting to demote an admin, ensure they are not the absolute last active admin
  if (currentRole === 'admin') {
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('role_key', 'admin')
      .eq('is_active', true);

    if (admins && admins.length <= 1) {
      return actionError('Critical System Guard: Cannot demote the final remaining System Administrator.', 'LAST_ADMIN');
    }
  }

  const newRole = currentRole === 'admin' ? 'customer' : 'admin';

  const { data: beforeState } = await supabase.from('profiles').select('*').eq('id', targetProfileId).single();

  const { error } = await supabase
    .from('profiles')
    .update({ 
      role_key: newRole,
      updated_at: new Date().toISOString()
    })
    .eq('id', targetProfileId);

  if (error) {
    return actionError(`Role modification failed: ${error.message}`, 'DB_ERROR');
  }

  // Trace it strictly back to the acting admin
  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'profile_role',
    entity_id: targetProfileId,
    action: 'update',
    before_json: beforeState || {},
    after_json: { role_key: newRole, id: targetProfileId }
  });

  revalidatePath(ROUTES.ADMIN_USERS);
  return actionSuccess();
}
