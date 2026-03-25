// redirects specific constants to be imported appropriately if needed in the future

/**
 * Validates a given path to ensure it's an internal route that is safe to redirect to.
 * Prevents open-redirect vulnerabilities.
 */
export function isSafeInternalReturnTo(path: string | null | undefined): boolean {
  if (!path) return false;

  // Reject paths that start with protocol, "//" (protocol-relative), or anything mapping outward
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)) return false; 
  if (path.startsWith('//')) return false;

  // It must start with a single slash to be a relative path on this domain
  if (!path.startsWith('/')) return false;
  
  // Optional: Only allow specific route prefixes if we want to be ultra-strict
  // But for now, any local path that passes the absolute/external checks above is relatively safe.
  
  return true;
}

/**
 * Returns the default redirect path after sign in based on the requested returnTo.
 * Reverts to /account if returnTo is invalid.
 */
export function resolveReturnToPath(requestedPath: string | null | undefined, defaultPath: string = '/account'): string {
  if (isSafeInternalReturnTo(requestedPath)) {
    return requestedPath as string;
  }
  return defaultPath;
}
