/**
 * Request ID generation.
 * 
 * Attach requestId to:
 * - API responses (in meta.requestId)
 * - Logger context (in all log entries)
 * - Middleware will inject this into headers in Phase 2+
 */
export function generateRequestId(): string {
  return crypto.randomUUID();
}

/**
 * Extract request ID from incoming request headers, or generate a new one.
 */
export function getRequestId(request: Request): string {
  return request.headers.get('x-request-id') || generateRequestId();
}
