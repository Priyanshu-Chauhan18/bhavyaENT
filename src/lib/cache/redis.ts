/**
 * Redis adapter for the pluggable cache layer.
 * 
 * Uses Upstash Redis (HTTP-based, serverless-compatible).
 * Only activated when CACHE_PROVIDER=redis AND Upstash env vars are set.
 * 
 * To enable:
 *   CACHE_PROVIDER=redis
 *   UPSTASH_REDIS_REST_URL=https://...
 *   UPSTASH_REDIS_REST_TOKEN=...
 */

let redisInstance: any = null;

export function isRedisEnabled(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * Lazy-initialize Redis client.
 * Uses dynamic import to avoid requiring @upstash/redis when not in use.
 */
export function getRedis() {
  if (redisInstance) return redisInstance;

  throw new Error(
    'Redis is currently disabled to prevent Next.js build warnings. ' +
    'If you wish to use Redis in the future, run npm install @upstash/redis ' +
    'and re-implement the Redis client here.'
  );
}
