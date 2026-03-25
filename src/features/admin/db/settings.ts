import { createAdminSupabaseClient } from '@/lib/db/server';

export type SiteSetting = {
  key: string;
  value_json: any;
};

/**
 * Get a single setting by key.
 * Uses admin client to bypass RLS (site_settings has no public read policy).
 */
export async function getSettingByKey<T = any>(key: string): Promise<T | null> {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from('site_settings')
    .select('value_json')
    .eq('key', key)
    .single();

  if (!data) return null;

  // value_json is stored as JSON-stringified, so parse it back
  try {
    return typeof data.value_json === 'string' ? JSON.parse(data.value_json) : data.value_json;
  } catch {
    return data.value_json as T;
  }
}

/**
 * Get multiple settings by keys as a flat Record.
 * Uses admin client to bypass RLS (site_settings has no public read policy).
 */
export async function getManySettings(keys: string[]): Promise<Record<string, any>> {
  if (!keys.length) return {};
  
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from('site_settings')
    .select('key, value_json')
    .in('key', keys);

  if (!data) return {};

  const result: Record<string, any> = {};
  data.forEach((row: any) => {
    // value_json may be a JSON-stringified string from the upsert, so parse it
    try {
      result[row.key] = typeof row.value_json === 'string' ? JSON.parse(row.value_json) : row.value_json;
    } catch {
      result[row.key] = row.value_json;
    }
  });

  return result;
}

/**
 * Admin-only: get all settings rows for the admin settings page.
 */
export async function getAdminSettings(): Promise<SiteSetting[]> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key', { ascending: true });

  if (error) {
    console.error('Failed to fetch admin settings:', error);
    return [];
  }

  // Parse value_json back to plain strings for form pre-population
  return (data || []).map((row: any) => {
    let parsed = row.value_json;
    try {
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
    } catch { /* keep as-is */ }
    return { key: row.key, value_json: parsed };
  }) as SiteSetting[];
}
