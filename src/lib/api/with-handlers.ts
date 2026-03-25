/**
 * Reusable API route handler wrappers.
 * 
 * Eliminates boilerplate try/catch, auth checks, and validation
 * across all API route handlers.
 * 
 * Usage:
 *   export const GET = withValidation(MySchema, async (data, ctx) => { ... })
 *   export const POST = withAdminGuard(async (req, ctx) => { ... })
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { requireAdmin, requireActiveUser, type ProfileData } from '@/lib/guards';
import {
  serverErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  validationErrorResponse,
} from '@/lib/api/api-response';
import { generateRequestId } from '@/lib/api/request-context';

// ─── Types ────────────────────────────────────────────────

type RequestContext = {
  requestId: string;
  user: { id: string; email?: string };
  profile: ProfileData;
};

type AdminHandler = (
  request: NextRequest,
  ctx: RequestContext
) => Promise<NextResponse>;

type ValidatedHandler<T> = (
  data: T,
  ctx: RequestContext & { request: NextRequest }
) => Promise<NextResponse>;

type PublicHandler = (
  request: NextRequest,
  ctx: { requestId: string }
) => Promise<NextResponse>;

// ─── withAdminGuard ───────────────────────────────────────
/**
 * Wraps an API route handler with admin authentication.
 * Automatically handles auth errors and generates requestId.
 */
export function withAdminGuard(handler: AdminHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId();

    try {
      const { user, profile } = await requireAdmin();
      return await handler(request, { requestId, user, profile });
    } catch (error: unknown) {
      return mapGuardError(error, requestId);
    }
  };
}

// ─── withAuthGuard ────────────────────────────────────────
/**
 * Wraps an API route handler with active-user authentication.
 */
export function withAuthGuard(handler: AdminHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId();

    try {
      const { user, profile } = await requireActiveUser();
      return await handler(request, { requestId, user, profile });
    } catch (error: unknown) {
      return mapGuardError(error, requestId);
    }
  };
}

// ─── withValidation ───────────────────────────────────────
/**
 * Wraps an API route handler with Zod validation + admin auth.
 * Parses the request body against the given schema before calling the handler.
 */
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: ValidatedHandler<T>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId();

    try {
      const { user, profile } = await requireAdmin();

      // Parse body
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return validationErrorResponse(
          { body: ['Request body must be valid JSON'] },
          requestId
        );
      }

      // Validate
      const result = schema.safeParse(body);
      if (!result.success) {
        const flat = result.error.flatten();
        const fields: Record<string, string[]> = {};
        for (const [key, messages] of Object.entries(flat.fieldErrors)) {
          if (messages) {
            fields[key] = messages as string[];
          }
        }
        return validationErrorResponse(fields, requestId);
      }

      return await handler(result.data, {
        requestId,
        user,
        profile,
        request,
      });
    } catch (error: unknown) {
      return mapGuardError(error, requestId);
    }
  };
}

// ─── withPublicHandler ────────────────────────────────────
/**
 * Wraps a public (no auth) API route handler with error handling + requestId.
 */
export function withPublicHandler(handler: PublicHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId();

    try {
      return await handler(request, { requestId });
    } catch (error) {
      console.error('[API_HANDLER_ERROR]', error);
      return serverErrorResponse(requestId);
    }
  };
}

// ─── Internal Helper ──────────────────────────────────────

function mapGuardError(
  error: unknown,
  requestId: string
): NextResponse {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const appErr = error as { statusCode: number; message: string };
    if (appErr.statusCode === 401) return unauthorizedResponse(appErr.message, requestId);
    if (appErr.statusCode === 403) return forbiddenResponse(appErr.message, requestId);
  }

  console.error('[API_GUARD_ERROR]', error);
  return serverErrorResponse(requestId);
}
