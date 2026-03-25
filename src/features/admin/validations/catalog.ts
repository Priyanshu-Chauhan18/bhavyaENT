import { z } from 'zod';

export const AdminCatalogSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Name is required').max(100),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).nullable().optional(),
  is_active: z.boolean(),
  sort_order: z.number().int(),
});

export type AdminCatalogFormContext = z.infer<typeof AdminCatalogSchema>;
