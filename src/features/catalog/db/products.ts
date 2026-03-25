import { createServerSupabaseClient } from '@/lib/db/server';

// ------------------------------------------------------------------
// TYPES
// ------------------------------------------------------------------

export type ProductImage = {
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
};

export type ProductSpec = {
  spec_key: string;
  spec_value: string;
  is_public: boolean;
};

export type PublicProductPreview = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  is_featured: boolean;
  images: ProductImage[];
  public_specs: Omit<ProductSpec, 'is_public'>[];
};

export type AuthenticatedProductDetail = PublicProductPreview & {
  sku: string;
  full_description: string | null;
  color: string | null;
  material: string | null;
  finish: string | null;
  neck_size: string | null;
  moq: string | null;
  lead_time: string | null;
  private_specs: ProductSpec[];
};

// ------------------------------------------------------------------
// PUBLIC REPOSITORIES
// ------------------------------------------------------------------

const PUBLIC_PRODUCT_COLUMNS = 'id, category_id, name, slug, sku, short_description, is_featured';

function mapPublicPreview(productRow: any, imagesRow: any[], specsRow: any[]): PublicProductPreview {
  return {
    id: productRow.id,
    category_id: productRow.category_id,
    name: productRow.name,
    slug: productRow.slug,
    sku: productRow.sku,
    short_description: productRow.short_description,
    is_featured: productRow.is_featured,
    images: imagesRow || [],
    public_specs: specsRow.map(s => ({ spec_key: s.spec_key, spec_value: s.spec_value })),
  };
}

/**
 * SEO metadata getter — queries the full products table (not the view)
 * for meta_title and meta_description to feed into generateMetadata().
 */
export async function getProductSeoMeta(slug: string): Promise<{ name: string; short_description: string | null; meta_title: string | null; meta_description: string | null } | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('products')
    .select('name, short_description, meta_title, meta_description')
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('publish_status', 'published')
    .single();
  return data;
}

export async function getPublicProductPreviewBySlug(slug: string): Promise<PublicProductPreview | null> {
  const supabase = await createServerSupabaseClient();
  
  // 1. Fetch only public columns of the product
  const { data: product, error: productErr } = await supabase
    .from('product_previews')
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('publish_status', 'published')
    .single();

  if (productErr || !product) return null;

  // 2. Fetch images concurrently
  const imgsPromise = supabase
    .from('product_images')
    .select('image_url, alt_text, is_primary')
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true });

  // 3. Fetch only PUBLIC specs directly from DB (satisfies explicitly "never fetch all specs and filter in JS")
  const specsPromise = supabase
    .from('product_specs')
    .select('spec_key, spec_value')
    .eq('product_id', product.id)
    .eq('is_public', true)
    .order('sort_order', { ascending: true });

  const [imgsRes, specsRes] = await Promise.all([imgsPromise, specsPromise]);

  return mapPublicPreview(product, imgsRes.data || [], specsRes.data || []);
}

/**
 * Batch hydrate: fetches images + public specs for multiple products in 2 queries total.
 * Eliminates N+1 pattern by doing: 1 images query + 1 specs query for all products.
 */
async function batchHydratePublicPreviews(
  products: any[]
): Promise<PublicProductPreview[]> {
  if (products.length === 0) return [];

  const supabase = await createServerSupabaseClient();
  const productIds = products.map(p => p.id);

  // 2 batch queries instead of 2N individual queries
  const [imgsRes, specsRes] = await Promise.all([
    supabase
      .from('product_images')
      .select('product_id, image_url, alt_text, is_primary')
      .in('product_id', productIds)
      .order('sort_order', { ascending: true }),
    supabase
      .from('product_specs')
      .select('product_id, spec_key, spec_value')
      .in('product_id', productIds)
      .eq('is_public', true)
      .order('sort_order', { ascending: true }),
  ]);

  // Group by product_id in memory
  const imagesByProduct = new Map<string, ProductImage[]>();
  const specsByProduct = new Map<string, { spec_key: string; spec_value: string }[]>();

  for (const img of imgsRes.data || []) {
    const existing = imagesByProduct.get(img.product_id) || [];
    existing.push({ image_url: img.image_url, alt_text: img.alt_text, is_primary: img.is_primary });
    imagesByProduct.set(img.product_id, existing);
  }

  for (const spec of specsRes.data || []) {
    const existing = specsByProduct.get(spec.product_id) || [];
    existing.push({ spec_key: spec.spec_key, spec_value: spec.spec_value });
    specsByProduct.set(spec.product_id, existing);
  }

  return products.map(p => mapPublicPreview(
    p,
    imagesByProduct.get(p.id) || [],
    specsByProduct.get(p.id) || []
  ));
}

export async function getPublicFeaturedProducts(limit = 10): Promise<PublicProductPreview[]> {
  const supabase = await createServerSupabaseClient();
  const { data: products } = await supabase
    .from('products')
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq('is_active', true)
    .eq('publish_status', 'published')
    .eq('is_featured', true)
    .limit(limit);

  if (!products) return [];

  // Batch hydrate: 1 query for products + 2 queries for images/specs = 3 total
  return batchHydratePublicPreviews(products);
}

export async function getPublicPublishedProducts(): Promise<PublicProductPreview[]> {
  const supabase = await createServerSupabaseClient();
  const { data: products } = await supabase
    .from('products')
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq('is_active', true)
    .eq('publish_status', 'published');

  if (!products) return [];

  return batchHydratePublicPreviews(products);
}

export async function getPublicPublishedProductsByCategorySlug(categorySlug: string): Promise<PublicProductPreview[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!category) return [];

  const { data: products } = await supabase
    .from('products')
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq('category_id', category.id)
    .eq('is_active', true)
    .eq('publish_status', 'published');

  if (!products) return [];

  return batchHydratePublicPreviews(products);
}

export type SearchPublicProductsParams = {
  query?: string;
  categoryId?: string;
  sort?: 'newest' | 'alphabetical' | 'featured';
  page?: number;
  limit?: number;
};

/**
 * Robust paginated search strictly isolating public product columns.
 * Performs explicit count to drive URL-driven SSR pagination.
 */
export async function searchPublicProducts(
  params: SearchPublicProductsParams
): Promise<{ data: PublicProductPreview[]; total: number }> {
  const supabase = await createServerSupabaseClient();
  const page = params.page || 1;
  const limit = params.limit || 12;
  const sort = params.sort || 'newest';

  let query = supabase
    .from('product_previews')
    .select(PUBLIC_PRODUCT_COLUMNS, { count: 'exact' })
    .eq('is_active', true)
    .eq('publish_status', 'published');

  if (params.categoryId) {
    query = query.eq('category_id', params.categoryId);
  }

  if (params.query) {
    // Simple wildcard search matching name or description
    query = query.or(`name.ilike.%${params.query}%,short_description.ilike.%${params.query}%`);
  }

  // Handle distinct sort intents matching UI enum
  switch (sort) {
    case 'alphabetical':
      query = query.order('name', { ascending: true });
      break;
    case 'featured':
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data: products, count } = await query;

  if (!products) return { data: [], total: 0 };

  // Batch hydrate: 1 search query + 2 batch queries for images/specs = 3 total
  const resolved = await batchHydratePublicPreviews(products);

  return { data: resolved, total: count || 0 };
}

// ------------------------------------------------------------------
// AUTHENTICATED REPOSITORIES
// ------------------------------------------------------------------

const AUTHENTICATED_PRODUCT_COLUMNS = `
  id, category_id, name, slug, sku, short_description, full_description, 
  color, material, finish, neck_size, moq, lead_time, is_featured
`;

/**
 * Returns the full dataset for a product, spanning public previews and all private specs.
 * MUST only be invoked in a Server Action/Component where requireAuth() or requireActiveUser() has succeeded.
 */
export async function getAuthenticatedProductDetailBySlug(slug: string): Promise<AuthenticatedProductDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data: product, error: productErr } = await supabase
    .from('products')
    .select(AUTHENTICATED_PRODUCT_COLUMNS)
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('publish_status', 'published')
    .single();

  if (productErr || !product) return null;

  const imgsPromise = supabase
    .from('product_images')
    .select('image_url, alt_text, is_primary')
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true });

  const specsPromise = supabase
    .from('product_specs')
    .select('spec_key, spec_value, is_public')
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true });

  const [imgsRes, specsRes] = await Promise.all([imgsPromise, specsPromise]);
  const allSpecs = specsRes.data || [];

  return {
    id: product.id,
    category_id: product.category_id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    short_description: product.short_description,
    full_description: product.full_description,
    color: product.color,
    material: product.material,
    finish: product.finish,
    neck_size: product.neck_size,
    moq: product.moq,
    lead_time: product.lead_time,
    is_featured: product.is_featured,
    images: imgsRes.data || [],
    public_specs: allSpecs.filter(s => s.is_public).map(s => ({ spec_key: s.spec_key, spec_value: s.spec_value })),
    private_specs: allSpecs.filter(s => !s.is_public),
  };
}
