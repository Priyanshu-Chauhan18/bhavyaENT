import { NextRequest } from 'next/server';
import { requireActiveUser } from '@/lib/guards';
import { 
  okResponse, 
  errorResponse, 
  unauthorizedResponse, 
  rateLimitResponse, 
  serverErrorResponse,
  forbiddenResponse
} from '@/lib/api/api-response';
import { generateRequestId } from '@/lib/api/request-context';
import { createServerSupabaseClient } from '@/lib/db/server';
import { resolveEnquiryTemplate } from '@/features/enquiry/db/templates';
import { logEnquiry } from '@/features/enquiry/db/logger';
import { createRateLimiter } from '@/lib/cache/rate-limiter';
import { logRequest } from '@/lib/logging/request-logger';

// Enquiry-specific rate limiter: 10 requests per minute per user
const enquiryLimiter = createRateLimiter({ windowMs: 60_000, max: 10 });

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    const supabase = await createServerSupabaseClient();
    
    // 1. Optional Auth resolving (Guests allowed now)
    const { data: { user } } = await supabase.auth.getUser();
    let profile = null;
    
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data && data.is_active) {
        profile = data;
      }
    }

    // 1.5 Rate Limiting Block (User ID or IP)
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const rateLimitKey = user ? user.id : clientIp;
    
    const rateCheck = enquiryLimiter.check(rateLimitKey);
    if (!rateCheck.allowed) {
      return rateLimitResponse(requestId);
    }

    const body = await request.json();
    const { type = 'product', productId, categoryId, currentUrl } = body;

    // 2. Fetch specific context details based on `type`
    let product = null;
    let category = null;
    let template = null;
    let imageUrl = '';

    if (type === 'product') {
      if (!productId) return errorResponse('BAD_REQUEST', 'Missing productId for product enquiry', 400, requestId);
      
      const { data: pData } = await supabase
        .from('products')
        .select('id, category_id, name, slug, sku, color, material, finish, neck_size, moq, lead_time, is_active, publish_status')
        .eq('id', productId)
        .eq('is_active', true)
        .eq('publish_status', 'published')
        .single();
        
      if (!pData) return errorResponse('NOT_FOUND', 'Product unavailable', 404, requestId);
      product = pData;

      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .eq('is_primary', true)
        .limit(1);
      if (images?.[0]?.image_url) imageUrl = images[0].image_url;

      template = await resolveEnquiryTemplate(product.id, product.category_id);
      
    } else if (type === 'category') {
      if (!categoryId) return errorResponse('BAD_REQUEST', 'Missing categoryId', 400, requestId);
      
      const { data: cData } = await supabase
        .from('categories')
        .select('id, name')
        .eq('id', categoryId)
        .eq('is_active', true)
        .single();
        
      if (!cData) return errorResponse('NOT_FOUND', 'Category unavailable', 404, requestId);
      category = cData;

      // Temporary hack: resolveEnquiryTemplate expects string|null, we pass null for product
      template = await resolveEnquiryTemplate(null as any, category.id);
      
    } else {
      // General enquiry
      template = await resolveEnquiryTemplate(null as any, null as any);
    }

    const targetNumber = template?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+10000000000';

    // 3. Build smart template if no DB template exists
    let rawTemplateText = template?.template_text;
    
    if (!rawTemplateText) {
      if (type === 'product') {
        rawTemplateText = `📋 *Product Enquiry — BHAVYAA ENTERPRISES*

🏷️ {{product_name}} ({{sku}})
🎨 {{color}} | {{material}} | {{finish}}
📐 {{neck_size}} | MOQ: {{moq}} | Lead: {{lead_time}}

🔗 {{product_url}}
🖼️ {{product_image}}

👤 {{user_name}} | {{company_name}}

💬 Requirements:


⚡ Need quick response for production planning
📍 Page: {{current_url}}`;
      } else if (type === 'category') {
        rawTemplateText = `📋 *Category Enquiry — BHAVYAA ENTERPRISES*

I am interested in exploring your {{category_name}} closures.

👤 {{user_name}} | {{company_name}}

💬 Requirements:


⚡ Need quick response for production planning
📍 Page: {{current_url}}`;
      } else {
        rawTemplateText = `📋 *General Enquiry — Bhavya*

Hello Bhavya team, I have a query regarding your products and manufacturing capabilities.

👤 {{user_name}} | {{company_name}}

💬 How can we help you?


⚡ Need quick response for production planning
📍 Page: {{current_url}}`;
      }
    }

    // 4. Compile Message Strings
    let message = rawTemplateText;
    
    if (type === 'product' && product) {
      message = message.replace(/\{\{product_name\}\}/g, product.name || 'Product Details');
      message = message.replace(/\{\{sku\}\}/g, product.sku || 'N/A');
      message = message.replace(/\{\{color\}\}/g, product.color || 'N/A Color');
      message = message.replace(/\{\{material\}\}/g, product.material || 'N/A Material');
      message = message.replace(/\{\{finish\}\}/g, product.finish || 'N/A Finish');
      message = message.replace(/\{\{neck_size\}\}/g, product.neck_size || 'N/A Size');
      message = message.replace(/\{\{moq\}\}/g, product.moq || 'TBD');
      message = message.replace(/\{\{lead_time\}\}/g, product.lead_time || 'TBD');
      
      message = message.replace(/N\/A Color \| N\/A Material \| N\/A Finish/g, 'Specs available upon request');
      message = message.replace(/🎨 N\/A Color \| N\/A Material \| N\/A Finish\n/g, '');
      
      const productUrl = (process.env.NEXT_PUBLIC_SITE_URL && product.slug) 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`
        : currentUrl || 'URL unavailable';
        
      message = message.replace(/\{\{product_url\}\}/g, productUrl);
      message = message.replace(/\{\{product_image\}\}/g, imageUrl || 'No image available');
    } else if (type === 'category' && category) {
      message = message.replace(/\{\{category_name\}\}/g, category.name || 'Category');
    }
    
    // Global replacements
    message = message.replace(/\{\{current_url\}\}/g, currentUrl || 'URL unavailable');
    
    // Auth replacements
    const nameStr = profile?.full_name || 'Guest User';
    const companyStr = profile?.company_name || '';
    message = message.replace(/\{\{user_name\}\}/g, nameStr);
    message = message.replace(/\{\{company_name\}\}/g, companyStr);
    
    // Clean up empty user formatting
    message = message.replace(/👤 Guest User \| \n/g, '👤 Guest User\n');
    message = message.replace(/👤 Valued Customer \| Private Business\n/g, ''); // legacy cleanup

    // 5. Fire non-blocking Server Logger
    // Fire and forget; we do not await it so it won't hard fail the redirect natively.
    const logUserId = user ? user.id : '00000000-0000-0000-0000-000000000000';
    const logProductId = product ? product.id : null;
    logEnquiry(logUserId, logProductId, message).catch((err) => {
      console.error('Non-blocking logger failure:', err);
    });

    // 6. Output safe Redirect URL
    // Target destination is already pulled safely with an aggressive Fallback to process.env and defaults.
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;

    logRequest({ requestId, route: '/api/enquiries/preview', method: 'POST', statusCode: 200, latencyMs: Date.now() - startTime });
    return okResponse({
      whatsappUrl,
      generatedMessage: message
    }, requestId);

  } catch (error: any) {
    if (error.statusCode === 401) return unauthorizedResponse(error.message, requestId);
    if (error.statusCode === 403) return forbiddenResponse(error.message, requestId);
    
    console.error('[ENQUIRY_API_ERROR]', error);
    logRequest({ requestId, route: '/api/enquiries/preview', method: 'POST', statusCode: 500, latencyMs: Date.now() - startTime });
    return serverErrorResponse(requestId);
  }
}
