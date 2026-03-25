import { NextRequest } from 'next/server';
import { okResponse, notFoundResponse, serverErrorResponse } from '@/lib/api/api-response';
import { generateRequestId } from '@/lib/api/request-context';
import { getPublicProductPreviewBySlug } from '@/features/catalog/db/products';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const requestId = generateRequestId();

  try {
    const { slug } = await params;
    const product = await getPublicProductPreviewBySlug(slug);

    if (!product) {
      return notFoundResponse('Product not found', requestId);
    }

    const response = okResponse(product, requestId);

    // Varnish/CDN-ready: cache public product previews for 5 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;
  } catch (error) {
    console.error('[API_PRODUCT_SLUG_ERROR]', error);
    return serverErrorResponse(requestId);
  }
}
