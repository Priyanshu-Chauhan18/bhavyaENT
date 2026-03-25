import { z, ZodSchema } from 'zod';

/**
 * Shared Zod parse helper.
 * Returns { success, data, errors } — maps Zod issues to field-level errors.
 */
export function validateWithSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.') || '_root';
    errors[path] = issue.message;
  }

  return { success: false, errors };
}

/**
 * Parse JSON body from Request safely.
 * Returns parsed data or null if invalid.
 */
export async function parseJsonBody(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
