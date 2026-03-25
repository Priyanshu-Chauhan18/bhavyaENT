-- ==============================================================================
-- PHASE 3 SUPPLEMENT: PUBLIC READ POLICIES & SECURE VIEWS
-- ==============================================================================
-- To prevent anonymous users from retrieving private fields (moq, lead_time)
-- by directly querying the `products` table via the PostgREST API, we DO NOT 
-- apply an RLS SELECT policy to `products` for the `anon` role.
-- 
-- Instead, we create a secure PostgreSQL View (`product_previews`) exposing ONLY 
-- safe columns, and grant `anon` access to that view along with strictly public 
-- peripheral tables.

-- 1. Catalogs (Active Only)
CREATE POLICY "Allow public read on active catalogs" 
ON public.catalogs FOR SELECT
USING (is_active = true);

-- 2. Categories (Active Only)
CREATE POLICY "Allow public read on active categories" 
ON public.categories FOR SELECT
USING (is_active = true);

-- 3. Product Images (All allowed, restricted safely by frontend)
CREATE POLICY "Allow public read on product images" 
ON public.product_images FOR SELECT
USING (true);

-- 4. Product Specs (Public Only)
CREATE POLICY "Allow public read on public specs" 
ON public.product_specs FOR SELECT
USING (is_public = true);

-- 5. Secure Previews View (Exposing only safe columns for products)
-- Drops the old policy if it was temporarily executed
DROP POLICY IF EXISTS "Allow public read on active published products" ON public.products;

CREATE OR REPLACE VIEW public.product_previews AS
SELECT 
  id,
  category_id,
  name,
  slug,
  sku,
  short_description,
  is_featured,
  is_active,
  publish_status,
  created_at
FROM public.products
WHERE is_active = true AND publish_status = 'published';

-- Grant explicit access to this view to external roles so PostgREST resolves it
GRANT SELECT ON public.product_previews TO anon, authenticated;
