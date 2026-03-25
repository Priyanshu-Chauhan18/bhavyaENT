import { createAnonSupabaseClient } from '@/lib/db/server';
import { unstable_cache } from 'next/cache';

export type CategoryPreview = {
  id: string;
  catalog_id: string;
  name: string;
  slug: string;
  description: string | null;
  banner_image_url: string | null;
};

/**
 * Public repository reading active categories.
 * Safe for anonymous preview caching across the storefront.
 */
export const getPublicActiveCategories = unstable_cache(
  async (): Promise<CategoryPreview[]> => {
    const supabase = createAnonSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, catalog_id, name, slug, description, banner_image_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('getPublicActiveCategories error:', error);
      return [];
    }
    
    return data || [];
  },
  ['public-active-categories'],
  { tags: ['categories'], revalidate: 3600 }
);

/**
 * Public repository reading active categories scoped to a specific catalog.
 */
export const getPublicCategoriesForCatalog = unstable_cache(
  async (catalogId: string): Promise<CategoryPreview[]> => {
    const supabase = createAnonSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, catalog_id, name, slug, description, banner_image_url')
      .eq('catalog_id', catalogId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('getPublicCategoriesForCatalog error:', error);
      return [];
    }
    
    return data || [];
  },
  ['public-categories-for-catalog'],
  { tags: ['categories'], revalidate: 3600 }
);

/**
 * Public repository reading a specific category by its unique slug.
 */
export const getPublicActiveCategoryBySlug = unstable_cache(
  async (slug: string): Promise<CategoryPreview | null> => {
    const supabase = createAnonSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, catalog_id, name, slug, description, banner_image_url')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('getPublicActiveCategoryBySlug error:', error);
      return null;
    }
    
    return data;
  },
  ['public-active-category-by-slug'],
  { tags: ['categories'], revalidate: 3600 }
);

/**
 * Dedicated SEO fetcher to avoid fetching full Category detail or leaking caching across features.
 */
export const getCategorySeoMeta = unstable_cache(
  async (slug: string): Promise<{ name: string; description: string | null; meta_title: string | null; meta_description: string | null } | null> => {
    const supabase = createAnonSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('name, description, meta_title, meta_description')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('getCategorySeoMeta error:', error);
      return null;
    }
    
    return data;
  },
  ['public-category-seo-meta-by-slug'],
  { tags: ['categories'], revalidate: 3600 }
);
