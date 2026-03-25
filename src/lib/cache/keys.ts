/**
 * Centralized cache key definitions.
 * 
 * Single source of truth for cache key patterns.
 * Used by both the cache-aside reads and the admin invalidation logic.
 * 
 * When CACHE_PROVIDER='none', these are no-ops.
 * When CACHE_PROVIDER='redis', these drive Redis key management.
 * When CACHE_PROVIDER='varnish', invalidation is handled by revalidatePath.
 */

// ─── Key Builders ─────────────────────────────────────────

export const CACHE_KEYS = {
  /** Featured products list */
  featuredProducts: () => 'products:featured',

  /** All published products */
  publishedProducts: () => 'products:published',

  /** Products by category */
  productsByCategory: (categoryId: string) => `products:category:${categoryId}`,

  /** Single product preview by slug */
  productPreview: (slug: string) => `product:preview:${slug}`,

  /** Single product full detail by slug */
  productDetail: (slug: string) => `product:detail:${slug}`,

  /** Product SEO metadata */
  productSeo: (slug: string) => `product:seo:${slug}`,

  /** All active categories */
  activeCategories: () => 'categories:active',

  /** Categories for a catalog */
  categoriesForCatalog: (catalogId: string) => `categories:catalog:${catalogId}`,

  /** Category by slug */
  categoryBySlug: (slug: string) => `category:slug:${slug}`,

  /** Category SEO */
  categorySeo: (slug: string) => `category:seo:${slug}`,

  /** All active catalogs */
  activeCatalogs: () => 'catalogs:active',

  /** Site settings */
  siteSettings: () => 'settings:site',
} as const;

// ─── Invalidation Groups ──────────────────────────────────
// Used after admin mutations to invalidate related cache entries.

import { invalidateCache, invalidateCacheByPattern } from './index';

/**
 * Invalidate all product-related caches.
 * Called after product create/update/delete/archive.
 */
export async function invalidateProductCaches(slug?: string): Promise<void> {
  await Promise.all([
    invalidateCache(CACHE_KEYS.featuredProducts()),
    invalidateCache(CACHE_KEYS.publishedProducts()),
    ...(slug ? [
      invalidateCache(CACHE_KEYS.productPreview(slug)),
      invalidateCache(CACHE_KEYS.productDetail(slug)),
      invalidateCache(CACHE_KEYS.productSeo(slug)),
    ] : []),
    // Pattern-based: clear all category-scoped product caches
    invalidateCacheByPattern('products:category:*'),
  ]);
}

/**
 * Invalidate all category-related caches.
 * Called after category create/update/delete.
 */
export async function invalidateCategoryCaches(slug?: string): Promise<void> {
  await Promise.all([
    invalidateCache(CACHE_KEYS.activeCategories()),
    ...(slug ? [
      invalidateCache(CACHE_KEYS.categoryBySlug(slug)),
      invalidateCache(CACHE_KEYS.categorySeo(slug)),
    ] : []),
    invalidateCacheByPattern('categories:catalog:*'),
  ]);
}

/**
 * Invalidate all catalog-related caches.
 * Called after catalog create/update/delete.
 */
export async function invalidateCatalogCaches(): Promise<void> {
  await Promise.all([
    invalidateCache(CACHE_KEYS.activeCatalogs()),
    // Categories depend on catalogs
    invalidateCache(CACHE_KEYS.activeCategories()),
    invalidateCacheByPattern('categories:catalog:*'),
  ]);
}

/**
 * Invalidate site settings cache.
 */
export async function invalidateSettingsCaches(): Promise<void> {
  await invalidateCache(CACHE_KEYS.siteSettings());
}
