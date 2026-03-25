import { z } from 'zod';

export const CatalogSortEnum = z.enum(['newest', 'alphabetical', 'featured']);
export type CatalogSortOption = z.infer<typeof CatalogSortEnum>;

export const CatalogSearchParamsSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  sort: CatalogSortEnum.default('newest'),
});

export type CatalogSearchParams = z.infer<typeof CatalogSearchParamsSchema>;
