import { createAdminSupabaseClient } from '@/lib/db/server';

export type AdminCatalogRow = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  updated_at: string;
};

export async function getAdminCatalogsList(): Promise<AdminCatalogRow[]> {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase
    .from('catalogs')
    .select(`
      id,
      name,
      slug,
      is_active,
      sort_order,
      updated_at
    `)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to fetch admin catalogs list:', error);
    return [];
  }

  return data as AdminCatalogRow[];
}

export async function getAdminCatalogById(id: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('catalogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}
