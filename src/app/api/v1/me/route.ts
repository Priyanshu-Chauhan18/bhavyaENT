import { NextRequest } from 'next/server';
import { okResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api/api-response';
import { generateRequestId } from '@/lib/api/request-context';
import { createServerSupabaseClient } from '@/lib/db/server';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse('Authentication required', requestId);
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name, company_name, phone, role_key, is_active')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return unauthorizedResponse('Profile not found', requestId);
    }

    const response = okResponse({
      id: user.id,
      email: user.email,
      ...profile
    }, requestId);

    // NEVER cache user-specific data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    return response;
  } catch (error) {
    console.error('[API_ME_ERROR]', error);
    return serverErrorResponse(requestId);
  }
}
