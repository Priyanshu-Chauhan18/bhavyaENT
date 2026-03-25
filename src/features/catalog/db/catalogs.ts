import { createServerSupabaseClient } from '@/lib/db/server';

export type CatalogPreview = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

/**
 * Public repository reading active catalogs.
 * Safe for anonymous preview caching.
 */
export async function getPublicActiveCatalogs(): Promise<CatalogPreview[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('catalogs')
    .select('id, name, slug, description')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('getPublicActiveCatalogs error:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Public repository reading a specific catalog by slug.
 * Excludes private attributes explicitly.
 */
export async function getPublicCatalogBySlug(slug: string): Promise<CatalogPreview | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('catalogs')
    .select('id, name, slug, description')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('getPublicCatalogBySlug error:', error);
    return null;
  }
  
  return data;
}
