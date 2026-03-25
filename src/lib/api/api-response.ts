import { NextResponse } from 'next/server';
import { generateRequestId } from './request-context';

// ─── Types ────────────────────────────────────────────────────────────

export type ApiErrorPayload = {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type ApiResponseMeta = {
  requestId: string;
  timestamp: string;
  pagination?: PaginationMeta;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiErrorPayload | null;
  meta: ApiResponseMeta;
};

// ─── Success Helpers ──────────────────────────────────────────────────

export function okResponse<T>(data: T, requestId?: string, pagination?: PaginationMeta) {
  const rid = requestId || generateRequestId();
  const body: ApiResponse<T> = {
    success: true,
    data,
    error: null,
    meta: { requestId: rid, timestamp: new Date().toISOString(), ...(pagination && { pagination }) },
  };
  return NextResponse.json(body, { status: 200 });
}

export function createdResponse<T>(data: T, requestId?: string) {
  const rid = requestId || generateRequestId();
  const body: ApiResponse<T> = {
    success: true,
    data,
    error: null,
    meta: { requestId: rid, timestamp: new Date().toISOString() },
  };
  return NextResponse.json(body, { status: 201 });
}

// ─── Error Helpers ────────────────────────────────────────────────────

export function errorResponse(
  code: string, 
  message: string, 
  status: number, 
  requestId?: string,
  fields?: Record<string, string[]>
) {
  const rid = requestId || generateRequestId();
  const body: ApiResponse<null> = {
    success: false,
    data: null,
    error: { code, message, ...(fields && { fields }) },
    meta: { requestId: rid, timestamp: new Date().toISOString() },
  };
  return NextResponse.json(body, { status });
}

// ─── Shortcut Error Helpers ───────────────────────────────────────────

export function unauthorizedResponse(message = 'Authentication required', requestId?: string) {
  return errorResponse('UNAUTHORIZED', message, 401, requestId);
}

export function forbiddenResponse(message = 'Insufficient permissions', requestId?: string) {
  return errorResponse('FORBIDDEN', message, 403, requestId);
}

export function notFoundResponse(message = 'Resource not found', requestId?: string) {
  return errorResponse('NOT_FOUND', message, 404, requestId);
}

export function validationErrorResponse(fields: Record<string, string[]>, requestId?: string) {
  return errorResponse('VALIDATION_ERROR', 'Invalid request payload', 422, requestId, fields);
}

export function conflictResponse(message: string, requestId?: string) {
  return errorResponse('CONFLICT', message, 409, requestId);
}

export function rateLimitResponse(requestId?: string) {
  return errorResponse('RATE_LIMITED', 'Too many requests. Please wait.', 429, requestId);
}

export function serverErrorResponse(requestId?: string) {
  return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', 500, requestId);
}

// ─── Error Mapper ─────────────────────────────────────────────────────

export function mapAppErrorToResponse(error: any, requestId?: string) {
  const rid = requestId || generateRequestId();
  
  if (error?.statusCode === 401) return unauthorizedResponse(error.message, rid);
  if (error?.statusCode === 403) return forbiddenResponse(error.message, rid);
  
  console.error('[API_INTERNAL_ERROR]', error);
  return serverErrorResponse(rid);
}
