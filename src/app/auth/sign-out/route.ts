import { createServerSupabaseClient } from '@/lib/db/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();
  }

  // Redirect to sign in page
  return NextResponse.redirect(new URL('/auth/sign-in', request.url), {
    status: 302,
  });
}
