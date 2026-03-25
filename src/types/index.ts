/**
 * Shared TypeScript types.
 * Add domain types as they are created in future phases.
 */

/** Standard API response envelope */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  } | null;
  meta: {
    requestId: string;
  };
}

/** Pagination params */
export interface PaginationParams {
  page: number;
  limit: number;
}

/** Paginated response wrapper */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
