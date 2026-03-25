import { NextRequest } from 'next/server';
import { okResponse, serverErrorResponse } from '@/lib/api/api-response';
import { generateRequestId } from '@/lib/api/request-context';
import { createServerSupabaseClient } from '@/lib/db/server';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const supabase = await createServerSupabaseClient();

    const { data: catalogs, error } = await supabase
      .from('catalogs')
      .select('id, name, slug, description')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('DB Error API catalogs:', error);
      return serverErrorResponse(requestId);
    }

    const response = okResponse(catalogs || [], requestId);

    // Varnish/CDN-ready: cache catalogs for 10 minutes (rarely change)
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');

    return response;
  } catch (error) {
    console.error('[API_CATALOGS_ERROR]', error);
    return serverErrorResponse(requestId);
  }
}
