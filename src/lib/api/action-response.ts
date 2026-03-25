/**
 * Standardized Server Action response type.
 * 
 * Server Actions are NOT HTTP — they are function calls.
 * This type keeps them simple and predictable without overforcing
 * API structure (no status codes, no headers, no requestId by default).
 */

import type { ZodError } from 'zod';

// ─── Types ────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; code?: string; details?: Record<string, string[]> };

// ─── Success ──────────────────────────────────────────────────────────

export function actionSuccess<T = void>(data?: T): ActionResult<T> {
  if (data !== undefined) {
    return { success: true, data };
  }
  return { success: true };
}

// ─── Error ────────────────────────────────────────────────────────────

export function actionError(message: string, code?: string, details?: Record<string, string[]>): ActionResult<never> {
  return { 
    success: false, 
    error: message, 
    ...(code && { code }),
    ...(details && { details }),
  };
}

// ─── Validation Error (from Zod) ──────────────────────────────────────

export function mapValidationError(zodError: ZodError): ActionResult<never> {
  const flat = zodError.flatten();
  const fields: Record<string, string[]> = {};
  
  for (const [key, messages] of Object.entries(flat.fieldErrors)) {
    if (messages) {
      fields[key] = messages as string[];
    }
  }

  return actionError('Validation failed', 'VALIDATION_ERROR', fields);
}

// ─── DB Error (from Supabase/Postgrest) ───────────────────────────────

export function mapDbError(error: { code?: string; message: string }, entityName = 'Record'): ActionResult<never> {
  // Unique constraint violation
  if (error.code === '23505') {
    return actionError(`A ${entityName} with this value already exists.`, 'DUPLICATE');
  }
  // Foreign key violation
  if (error.code === '23503') {
    return actionError(`Cannot complete: referenced ${entityName} not found.`, 'FK_VIOLATION');
  }
  // Check constraint violation
  if (error.code === '23514') {
    return actionError(`Invalid ${entityName} data provided (Check constraint failed).`, 'CHECK_VIOLATION');
  }
  // Generic fallback catching all other DB errors
  return actionError(`Operation failed: ${error.message}`, 'DB_ERROR');
}
