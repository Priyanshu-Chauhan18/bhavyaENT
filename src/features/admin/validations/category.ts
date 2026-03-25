import { z } from 'zod';

export const AdminCategorySchema = z.object({
  id: z.string().uuid().optional(),
  catalog_id: z.string().uuid('Catalog mapping is required'),
  name: z.string().min(2, 'Name is required').max(100),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).nullable().optional(),
  banner_image: z.string().url('Banner must be a valid HTTPS URL').or(z.literal('')).nullable().optional(),
  is_active: z.boolean(),
  sort_order: z.number().int(),
});

export type AdminCategoryFormContext = z.infer<typeof AdminCategorySchema>;
