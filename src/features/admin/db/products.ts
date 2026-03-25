import { createAdminSupabaseClient } from '@/lib/db/server';

export type AdminProductRow = {
  id: string;
  name: string;
  sku: string;
  slug: string;
  is_active: boolean;
  is_featured: boolean;
  publish_status: 'draft' | 'published' | 'archived';
  updated_at: string;
  categories: { name: string } | null;
};

/**
 * Admin repository bypasses `is_active` constraints natively
 * allowing total system oversight for dashboard analytics and CRUD rendering.
 */
export async function getAdminProductsList(): Promise<AdminProductRow[]> {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      sku,
      slug,
      is_active,
      is_featured,
      publish_status,
      updated_at,
      categories ( name )
    `)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin product list:', error);
    return [];
  }

  return data as unknown as AdminProductRow[];
}

export async function getAdminProductById(id: string) {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_specs(*),
      product_images(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getAdminCategories() {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from('categories').select('id, name').order('name');
  return data || [];
}
