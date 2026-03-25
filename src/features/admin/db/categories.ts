import { createAdminSupabaseClient } from '@/lib/db/server';

export type AdminCategoryRow = {
  id: string;
  catalog_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  catalog: { name: string } | null;
  updated_at: string;
};

export async function getAdminCategoriesList(): Promise<AdminCategoryRow[]> {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      catalog_id,
      name,
      slug,
      is_active,
      sort_order,
      updated_at,
      catalog:catalogs(name)
    `)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to fetch admin categories list:', error);
    return [];
  }

  // Map the single relationship (n to 1) safely
  return data.map((row: any) => ({
    ...row,
    catalog: row.catalog ? { name: row.catalog.name } : null
  })) as AdminCategoryRow[];
}

export async function getAdminCategoryById(id: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}
