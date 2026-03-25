-- Add SEO metadata columns to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text;
