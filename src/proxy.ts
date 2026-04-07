import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase env vars are missing, pass through without auth checks
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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

  // Wrap in try-catch to prevent fetch failures from crashing the proxy
  // and flooding the terminal with errors during dev
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch (error) {
    // Supabase unreachable — allow request to pass through
    // The page-level auth checks will handle this gracefully
    console.warn('[proxy] Supabase auth check failed, passing through:', (error as Error).message);
    return supabaseResponse;
  }

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
  if (user && isAdminRoute) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role_key, is_active')
        .eq('id', user.id)
        .single();

      if (!profile || !profile.is_active) {
        const url = request.nextUrl.clone();
        url.pathname = '/account';
        return redirectWithCookies(url);
      }

      if (profile.role_key !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/account';
        return redirectWithCookies(url);
      }
    } catch {
      // If profile check fails, let the layout handle it
      return supabaseResponse;
    }
  }

  // ─── Rule 4: Account inactive check ──────
  if (user && isAccountRoute) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_active')
        .eq('id', user.id)
        .single();

      if (profile && !profile.is_active) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/sign-in';
        url.searchParams.set('inactive', '1');
        return redirectWithCookies(url);
      }
    } catch {
      // If profile check fails, let the page handle it
      return supabaseResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
