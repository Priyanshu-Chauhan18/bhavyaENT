-- ==============================================================================
-- PHASE 3: CATALOG, PRODUCTS, SETTINGS, AND ENQUIRIES SCHEMA
-- ==============================================================================

-- 1. catalogs
CREATE TABLE public.catalogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  banner_image_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_catalog_id_fkey FOREIGN KEY (catalog_id) REFERENCES public.catalogs(id) ON DELETE RESTRICT
);

-- 3. products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sku text NOT NULL UNIQUE,
  short_description text,
  full_description text,
  color text,
  material text,
  finish text,
  neck_size text,
  moq text,
  lead_time text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  publish_status text NOT NULL DEFAULT 'draft',
  meta_title text,
  meta_description text,
  created_by uuid,  -- referencing profiles, but leaving weak ref fine if we don't strictly bind constraints.
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT,
  CONSTRAINT publish_status_check CHECK (publish_status IN ('draft', 'published', 'archived')),
  CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT products_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 4. product_images
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- 5. product_specs
CREATE TABLE public.product_specs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  spec_key text NOT NULL,
  spec_value text NOT NULL,
  is_public boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT product_specs_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- 6. enquiry_templates
CREATE TABLE public.enquiry_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid,
  category_id uuid,
  template_name text NOT NULL,
  template_text text NOT NULL,
  whatsapp_number text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enquiry_templates_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT enquiry_templates_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE
);

-- 7. enquiries
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  product_id uuid NOT NULL,
  channel text NOT NULL DEFAULT 'whatsapp',
  generated_message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enquiries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT enquiries_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT channel_check CHECK (channel IN ('whatsapp'))
);

-- 8. site_settings
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value_json jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 9. audit_logs
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid,
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT audit_logs_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================

-- catalogs
CREATE INDEX idx_catalogs_is_active ON public.catalogs(is_active);
CREATE INDEX idx_catalogs_sort_order ON public.catalogs(sort_order);

-- categories
CREATE INDEX idx_categories_catalog_id ON public.categories(catalog_id);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);
CREATE INDEX idx_categories_sort_order ON public.categories(sort_order);

-- products
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_publish_status ON public.products(publish_status);
CREATE INDEX idx_products_is_featured ON public.products(is_featured);

-- images & specs
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON public.product_images(is_primary);
CREATE INDEX idx_product_images_sort_order ON public.product_images(sort_order);
CREATE INDEX idx_product_specs_product_id ON public.product_specs(product_id);
CREATE INDEX idx_product_specs_is_public ON public.product_specs(is_public);

-- templates & enquiries
CREATE INDEX idx_templates_product_id ON public.enquiry_templates(product_id);
CREATE INDEX idx_templates_category_id ON public.enquiry_templates(category_id);
CREATE INDEX idx_templates_is_default ON public.enquiry_templates(is_default);
CREATE INDEX idx_templates_is_active ON public.enquiry_templates(is_active);
CREATE INDEX idx_enquiries_user_id ON public.enquiries(user_id);
CREATE INDEX idx_enquiries_product_id ON public.enquiries(product_id);
CREATE INDEX idx_enquiries_created_at ON public.enquiries(created_at);

-- audit
CREATE INDEX idx_audit_logs_actor_user_id ON public.audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Phase 3: All access goes through secure backend routes/repos without explicitly opening up to anon queries.
-- We will enable RLS but deliberately leave "anon" policies off.
-- authenticated / service role are standard.
-- ==============================================================================

ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- No generic "public read" policies will be added. 
-- Data is queried using server side Supabase client instances.
-- RLS default-deny behavior ensures any leaking queries from frontend return 0 rows.

-- ==============================================================================
-- UPDATED_AT TRIGGERS
-- ==============================================================================

CREATE TRIGGER update_catalogs_modtime
BEFORE UPDATE ON public.catalogs FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_categories_modtime
BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_enquiry_templates_modtime
BEFORE UPDATE ON public.enquiry_templates FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_site_settings_modtime
BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
