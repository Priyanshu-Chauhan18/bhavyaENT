'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/guards';
import { createAdminSupabaseClient } from '@/lib/db/server';
import { SETTINGS_KEYS } from '@/lib/config/constants';
import { SettingsSchema, type SettingsFormContext } from '../validations/settings';
import { actionSuccess, mapValidationError } from '@/lib/api/action-response';
import { invalidateSettingsCaches } from '@/lib/cache/keys';

export async function saveSettingsAction(payload: SettingsFormContext) {
  const { user } = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const parseResult = SettingsSchema.safeParse(payload);
  if (!parseResult.success) {
    return mapValidationError(parseResult.error);
  }

  const data = parseResult.data as Record<string, string | null | undefined>;
  const keysToUpdate = Object.values(SETTINGS_KEYS);

  // 1. Fetch before state generically for the Audit Log
  const { data: beforeState } = await supabase.from('site_settings').select('*');

  // 2. Perform Upsert for explicit recognized keys
  for (const key of keysToUpdate) {
    const newVal = data[key];
    if (newVal !== undefined) {
      await supabase
        .from('site_settings')
        .upsert(
          { key, value_json: newVal ?? null },
          { onConflict: 'key' }
        );
    }
  }

  // 3. Fetch after state
  const { data: afterState } = await supabase.from('site_settings').select('*');

  // 4. Trace Audit Log
  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    entity_type: 'site_settings',
    entity_id: null, // Global KV, no specific ID
    action: 'update',
    before_json: beforeState || {},
    after_json: afterState || {}
  });

  // 5. Cache Invalidation + Hard Revalidate
  await invalidateSettingsCaches();
  revalidatePath('/', 'layout');

  return actionSuccess();
}
