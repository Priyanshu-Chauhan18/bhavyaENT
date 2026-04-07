-- ==============================================================================
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- This applies the requested DB changes for optional SKU and new Product fields
-- ==============================================================================

-- 1. Make SKU Optional
ALTER TABLE public.products ALTER COLUMN sku DROP NOT NULL;

-- 2. By default, PostgreSQL allows multiple NULLs in a UNIQUE constraint. 
-- However, just to be extremely safe, if you encounter SKU uniqueness errors on empty SKUs:
-- ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_sku_key;
-- CREATE UNIQUE INDEX idx_products_sku ON public.products (sku) WHERE sku IS NOT NULL AND sku != '';

-- 3. Add the missing product columns (for Dimension, Packaging, Capacity, Delivery)
ALTER TABLE public.products 
  ADD COLUMN dimensions text,
  ADD COLUMN packaging_type text DEFAULT 'BAG',
  ADD COLUMN production_capacity_per_day text,
  ADD COLUMN delivery_time text DEFAULT '1 to 7 days';

-- Note: We didn't enforce bagging types at DB level to keep it flexible.
-- The UI handles the 'BAG | BOX(Paid)' hardcoding anyway, but these columns 
-- are now available if you decide to edit them in the Admin Panel later.
