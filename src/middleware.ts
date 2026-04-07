import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set({ name, value, ...options })
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const isAccountRoute = path.startsWith('/account');
  const isAdminRoute = path.startsWith('/admin');
  const isAuthRoute = path.startsWith('/auth');

  // Secure cookie-preserving redirect builder
  const redirectWithCookies = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  };

  // ─── Rule 1: Guest → Block /account/* and /admin/* ─────────────────
  if (!user && (isAccountRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/sign-in';
    url.searchParams.set('returnTo', path);
    return redirectWithCookies(url);
  }

  // ─── Rule 2: Auth Flow → Redirect logged-in users away from auth forms ──
  if (user && isAuthRoute) {
    if (path.startsWith('/auth/callback') || path.startsWith('/auth/sign-out')) {
      return supabaseResponse;
    }

    const returnTo = request.nextUrl.searchParams.get('returnTo');
    const redirectPath = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') 
      ? returnTo 
      : '/';

    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    url.searchParams.delete('returnTo');
    return redirectWithCookies(url);
  }

  // ─── Rule 3: Admin role check → Redirect non-admin away early ──────
  // This is a UX optimization only. The real guard is requireAdmin() in the layout.
  // We do a single lightweight profile query to prevent the "flash then error" UX.
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role_key, is_active')
      .eq('id', user.id)
      .single();

    // No profile or inactive → redirect to account
    if (!profile || !profile.is_active) {
      const url = request.nextUrl.clone();
      url.pathname = '/account';
      return redirectWithCookies(url);
    }

    // Customer trying admin → redirect to account (no error flash)
    if (profile.role_key !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/account';
      return redirectWithCookies(url);
    }
  }

  // ─── Rule 4: Account inactive check → Redirect inactive users ──────
  // Lightweight check only for account routes to prevent inactive users from accessing
  if (user && isAccountRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', user.id)
      .single();

    if (profile && !profile.is_active) {
      // Redirect to sign-in with a message flag (avoid redirect loops)
      const url = request.nextUrl.clone();
      url.pathname = '/auth/sign-in';
      url.searchParams.set('inactive', '1');
      return redirectWithCookies(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
