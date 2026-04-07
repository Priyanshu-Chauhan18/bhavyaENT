import { z } from 'zod';

// Sub-schema for Dynamic Arrays
export const SpecSchema = z.object({
  spec_key: z.string().min(1, 'Key is required'),
  spec_value: z.string().min(1, 'Value is required'),
});

export const ImageUrlSchema = z.object({
  image_url: z.string().url('Must be a valid URL'),
  alt_text: z.string().optional(),
  is_primary: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

// The Unified Composition Form
export const AdminProductSchema = z.object({
  // Core Reference
  id: z.string().uuid().optional(),
  category_id: z.string().min(1, 'Category is required'),
  
  // Naming & Slugs
  name: z.string().min(3, 'Product name must be at least 3 characters').max(150),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  sku: z.string().max(50).nullable().optional(),
  
  // Content & Configs
  short_description: z.string().max(300).nullable().optional(),
  full_description: z.string().nullable().optional(),
  color: z.string().max(50).nullable().optional(),
  material: z.string().max(50).nullable().optional(),
  finish: z.string().max(50).nullable().optional(),
  neck_size: z.string().max(50).nullable().optional(),
  
  // Locked B2B Metrics
  min_order_quantity: z.preprocess((v) => (v === '' || Number.isNaN(v) ? null : Number(v)), z.number().int().min(1).nullable().optional()),
  lead_time_days: z.preprocess((v) => (v === '' || Number.isNaN(v) ? null : Number(v)), z.number().int().min(1).nullable().optional()),
  
  // NEW FIELDS
  dimensions: z.string().max(100).nullable().optional(),
  packaging_type: z.string().default('BAG | BOX (Paid)'),
  production_capacity_per_day: z.string().max(100).nullable().optional(),
  delivery_time: z.string().default('1 to 7 Days'),

  // States
  is_active: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  publish_status: z.enum(['draft', 'published', 'archived']).default('draft'),
  
  // SEO
  meta_title: z.string().max(100).nullable().optional(),
  meta_description: z.string().max(255).nullable().optional(),

  // Relationships (Managed as nested arrays in React Hook Form)
  public_specs: z.array(SpecSchema).default([]),
  private_specs: z.array(SpecSchema).default([]),
  media_urls: z.array(ImageUrlSchema).default([]),
});

export type AdminProductFormContext = z.infer<typeof AdminProductSchema>;
