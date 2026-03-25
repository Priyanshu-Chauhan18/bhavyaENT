/**
 * Reusable in-memory rate limiter.
 * 
 * Works per-instance (not distributed).
 * For distributed rate limiting, upgrade to Redis-backed implementation later.
 * 
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60000, max: 5 });
 *   const result = limiter.check(identifier);
 *   if (!result.allowed) return rateLimitResponse(requestId);
 */

type RateLimitConfig = {
  windowMs: number;  // Window duration in milliseconds
  max: number;       // Max requests per window
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function createRateLimiter(config: RateLimitConfig) {
  const store = new Map<string, RateLimitEntry>();

  // Periodic cleanup to prevent memory leaks (every 5 minutes)
  const CLEANUP_INTERVAL = 5 * 60 * 1000;
  let lastCleanup = Date.now();

  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }

  return {
    check(identifier: string): RateLimitResult {
      cleanup();
      const now = Date.now();
      const entry = store.get(identifier);

      // New window or expired window
      if (!entry || now > entry.resetAt) {
        store.set(identifier, { count: 1, resetAt: now + config.windowMs });
        return { allowed: true, remaining: config.max - 1, resetAt: now + config.windowMs };
      }

      // Within window
      entry.count += 1;
      store.set(identifier, entry);

      if (entry.count > config.max) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
      }

      return { allowed: true, remaining: config.max - entry.count, resetAt: entry.resetAt };
    },

    reset(identifier: string) {
      store.delete(identifier);
    },
  };
}

// ─── Pre-configured limiters ─────────────────────────────

/** Auth: 5 attempts per 60 seconds per IP */
export const authLimiter = createRateLimiter({ windowMs: 60_000, max: 5 });

/** Forgot password: 3 attempts per 60 seconds per IP */
export const forgotPasswordLimiter = createRateLimiter({ windowMs: 60_000, max: 3 });

/** Search: 30 requests per 60 seconds per IP */
export const searchLimiter = createRateLimiter({ windowMs: 60_000, max: 30 });
