/**
 * Environment variable validation.
 * Fails fast on missing required vars, warns on missing optional vars.
 * Import this at the top of server entry points.
 */

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
      `   Copy .env.example to .env.local and fill in all required values.`
    );
  }
  return value;
}

function getOptionalEnv(key: string): string | undefined {
  const value = process.env[key];
  if (!value) {
    console.warn(`⚠️  Optional env var missing: ${key} — related feature disabled`);
  }
  return value;
}

/** All validated environment variables */
export const env = {
  // Required — app will not boot without these
  NEXT_PUBLIC_SUPABASE_URL: getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
  NEXT_PUBLIC_SITE_URL: getRequiredEnv('NEXT_PUBLIC_SITE_URL'),

  // Optional — features gracefully disabled if missing
  UPSTASH_REDIS_REST_URL: getOptionalEnv('UPSTASH_REDIS_REST_URL'),
  UPSTASH_REDIS_REST_TOKEN: getOptionalEnv('UPSTASH_REDIS_REST_TOKEN'),
  SENTRY_DSN: getOptionalEnv('SENTRY_DSN'),

  // Cache provider: 'none' (default) | 'redis' | 'varnish'
  CACHE_PROVIDER: process.env.CACHE_PROVIDER || 'none',

  // Derived
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;
