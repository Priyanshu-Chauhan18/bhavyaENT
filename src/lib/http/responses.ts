import { NextResponse } from 'next/server';
import { getRequestId } from './request-id';

/**
 * Standard API response envelope.
 * Shape: { success, data, error, meta: { requestId } }
 */

interface ApiMeta {
  requestId: string;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  error: null;
  meta: ApiMeta;
}

interface ErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
  meta: ApiMeta;
}

/**
 * 200 OK response
 */
export function okResponse<T>(data: T, request: Request): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      error: null,
      meta: { requestId: getRequestId(request) },
    },
    { status: 200 }
  );
}

/**
 * 201 Created response
 */
export function createdResponse<T>(data: T, request: Request): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      error: null,
      meta: { requestId: getRequestId(request) },
    },
    { status: 201 }
  );
}

/**
 * Error response with standard envelope
 */
export function errorResponse(
  status: number,
  code: string,
  message: string,
  request: Request,
  fields?: Record<string, string>
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false as const,
      data: null,
      error: { code, message, ...(fields && { fields }) },
      meta: { requestId: getRequestId(request) },
    },
    { status }
  );
}

/**
 * Common error shortcuts
 */
export const errors = {
  unauthorized: (req: Request) =>
    errorResponse(401, 'UNAUTHORIZED', 'Authentication required', req),
  forbidden: (req: Request) =>
    errorResponse(403, 'FORBIDDEN', 'Insufficient permissions', req),
  notFound: (req: Request, entity = 'Resource') =>
    errorResponse(404, 'NOT_FOUND', `${entity} not found`, req),
  conflict: (req: Request, message: string) =>
    errorResponse(409, 'CONFLICT', message, req),
  validationError: (req: Request, fields: Record<string, string>) =>
    errorResponse(422, 'VALIDATION_ERROR', 'Invalid input', req, fields),
  rateLimited: (req: Request) =>
    errorResponse(429, 'RATE_LIMITED', 'Too many requests', req),
  internal: (req: Request) =>
    errorResponse(500, 'INTERNAL_ERROR', 'An unexpected error occurred', req),
} as const;
