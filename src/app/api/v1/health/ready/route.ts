import { NextRequest } from 'next/server';
import { okResponse, serverErrorResponse } from '@/lib/api/api-response';
import { generateRequestId } from '@/lib/api/request-context';
import { createServerSupabaseClient } from '@/lib/db/server';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  const checks: Record<string, string> = {};

  // 1. DB check — lightweight SELECT 1
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('site_settings').select('key').limit(1);
    checks.db = error ? 'fail' : 'ok';
  } catch {
    checks.db = 'fail';
  }

  // 2. Config check — essential env vars
  const essentialEnvs = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  const missingEnvs = essentialEnvs.filter(key => !process.env[key]);
  checks.config = missingEnvs.length === 0 ? 'ok' : 'fail';

  const allOk = Object.values(checks).every(v => v === 'ok');

  const response = okResponse({
    status: allOk ? 'ready' : 'degraded',
    phase: 12,
    checks,
  }, requestId);

  // No caching on health checks
  response.headers.set('Cache-Control', 'no-store, no-cache');

  if (!allOk) {
    // Return 503 for degraded state so load balancers can detect it
    return new Response(response.body, {
      status: 503,
      headers: response.headers,
    });
  }

  return response;
}
