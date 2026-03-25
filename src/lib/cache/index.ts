/**
 * Pluggable Cache Architecture
 * 
 * Supports three modes via CACHE_PROVIDER env:
 * - "none"    → no caching (default, zero infra)
 * - "redis"   → Upstash Redis (add UPSTASH_REDIS_REST_URL + TOKEN)
 * - "varnish" → relies on HTTP Cache-Control headers (set in API routes)
 * 
 * For "varnish" mode, caching is done at the HTTP/CDN layer,
 * so these functions remain no-ops — the real caching happens
 * via Cache-Control headers in the API response helpers.
 */

// Lazy-loaded to avoid build failures when Redis is not configured
function loadRedisModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('./redis');
  return mod as { isRedisEnabled: () => boolean; getRedis: () => any };
}

// ─── Types ────────────────────────────────────────────────
export type CacheOptions = {
  ttl?: number;       // seconds
  tags?: string[];    // for grouped invalidation
};

type CacheProvider = 'none' | 'redis' | 'varnish';

function getProvider(): CacheProvider {
  const env = process.env.CACHE_PROVIDER || 'none';
  if (env === 'redis' && loadRedisModule().isRedisEnabled()) return 'redis';
  if (env === 'varnish') return 'varnish';
  return 'none';
}

// ─── Get ──────────────────────────────────────────────────
export async function getCache<T>(key: string): Promise<T | null> {
  const provider = getProvider();

  if (provider === 'redis') {
    try {
      const redis = loadRedisModule().getRedis();
      const raw = await redis.get(key);
      if (!raw) return null;
      return (typeof raw === 'string' ? JSON.parse(raw) : raw) as T;
    } catch (err) {
      console.error('[CACHE_GET_ERROR]', key, err);
      return null; // Graceful fallback to DB
    }
  }

  // "none" and "varnish" — no function-level caching
  return null;
}

// ─── Set ──────────────────────────────────────────────────
export async function setCache<T>(
  key: string,
  value: T,
  options?: CacheOptions
): Promise<void> {
  const provider = getProvider();

  if (provider === 'redis') {
    try {
      const redis = loadRedisModule().getRedis();
      const serialized = JSON.stringify(value);
      if (options?.ttl) {
        await redis.set(key, serialized, { ex: options.ttl });
      } else {
        await redis.set(key, serialized);
      }
    } catch (err) {
      console.error('[CACHE_SET_ERROR]', key, err);
      // Swallow — DB is the source of truth
    }
  }

  // "none" and "varnish" — no-op
}

// ─── Invalidate ───────────────────────────────────────────
export async function invalidateCache(key: string): Promise<void> {
  const provider = getProvider();

  if (provider === 'redis') {
    try {
      const redis = loadRedisModule().getRedis();
      await redis.del(key);
    } catch (err) {
      console.error('[CACHE_INVALIDATE_ERROR]', key, err);
    }
  }
}

// ─── Invalidate by pattern (Redis only) ───────────────────
export async function invalidateCacheByPattern(pattern: string): Promise<void> {
  const provider = getProvider();

  if (provider === 'redis') {
    try {
      const redis = loadRedisModule().getRedis();
      // Upstash supports SCAN-based deletion
      const keys: string[] = await redis.keys(pattern);
      if (keys.length > 0) {
        await Promise.all(keys.map((k: string) => redis.del(k)));
      }
    } catch (err) {
      console.error('[CACHE_PATTERN_INVALIDATE_ERROR]', pattern, err);
    }
  }
}
