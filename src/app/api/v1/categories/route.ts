import { NextRequest } from 'next/server';
import { okResponse, serverErrorResponse } from '@/lib/api/api-response';
import { generateRequestId } from '@/lib/api/request-context';
import { createServerSupabaseClient } from '@/lib/db/server';
import { logRequest } from '@/lib/logging/request-logger';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    const supabase = await createServerSupabaseClient();

    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, catalog_id, name, slug, description, banner_image_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('DB Error API categories:', error);
      return serverErrorResponse(requestId);
    }

    const response = okResponse(categories || [], requestId);

    // Varnish/CDN-ready: cache categories for 10 minutes (rarely change)
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');

    logRequest({ requestId, route: '/api/v1/categories', method: 'GET', statusCode: 200, latencyMs: Date.now() - startTime });
    return response;
  } catch (error) {
    console.error('[API_CATEGORIES_ERROR]', error);
    logRequest({ requestId, route: '/api/v1/categories', method: 'GET', statusCode: 500, latencyMs: Date.now() - startTime });
    return serverErrorResponse(requestId);
  }
}
