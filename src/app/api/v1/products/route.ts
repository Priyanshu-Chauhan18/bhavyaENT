import { NextRequest } from 'next/server';
import { okResponse, rateLimitResponse, serverErrorResponse, type PaginationMeta } from '@/lib/api/api-response';
import { generateRequestId } from '@/lib/api/request-context';
import { createServerSupabaseClient } from '@/lib/db/server';
import { searchLimiter } from '@/lib/cache/rate-limiter';
import { logRequest } from '@/lib/logging/request-logger';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');

    // Rate limit search queries (30/min per IP)
    if (q) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                 request.headers.get('x-real-ip') || 'unknown';
      const rateCheck = searchLimiter.check(`search:${ip}`);
      if (!rateCheck.allowed) {
        return rateLimitResponse(requestId);
      }
    }

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const category = searchParams.get('category');
    
    // Safety bounds
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const offset = (safePage - 1) * safeLimit;

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from('product_previews')
      .select('*, product_images(image_url, alt_text, is_primary)', { count: 'exact' })
      .eq('is_active', true)
      .eq('publish_status', 'published');

    if (q) {
      query = query.ilike('name', `%${q}%`);
    }

    if (category) {
      query = query.eq('category_id', category);
    }

    const { data: products, count, error } = await query
      .range(offset, offset + safeLimit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('DB Error in public products API:', error);
      return serverErrorResponse(requestId);
    }

    const pagination: PaginationMeta = {
      page: safePage,
      limit: safeLimit,
      total: count || 0,
    };

    // Format nested images array
    const formattedProducts = products?.map(p => ({
      ...p,
      images: p.product_images,
      product_images: undefined
    })) || [];

    const response = okResponse(formattedProducts, requestId, pagination);

    // Varnish/CDN-ready: cache product listings for 5 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    logRequest({ requestId, route: '/api/v1/products', method: 'GET', statusCode: 200, latencyMs: Date.now() - startTime });
    return response;
  } catch (error) {
    console.error('[API_PRODUCTS_LIST_ERROR]', error);
    logRequest({ requestId, route: '/api/v1/products', method: 'GET', statusCode: 500, latencyMs: Date.now() - startTime });
    return serverErrorResponse(requestId);
  }
}
