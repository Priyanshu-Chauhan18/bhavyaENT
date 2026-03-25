import Link from 'next/link';
import { ROUTES } from '@/lib/config/constants';
import { createServerSupabaseClient } from '@/lib/db/server';

const navLinks = [
  { href: ROUTES.HOME, label: 'Home' },
  { href: ROUTES.CATALOG, label: 'Catalog' },
  { href: ROUTES.ABOUT, label: 'About' },
  { href: ROUTES.CONTACT, label: 'Contact' },
  { href: ROUTES.FAQ, label: 'FAQ' },
];

export async function Navbar() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = 'guest';
  if (user?.id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role_key')
      .eq('id', user.id)
      .single();
    if (profile) {
      role = profile.role_key;
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-accent-deep to-accent-gold bg-clip-text text-transparent pr-1"
          >
            <span className="text-2xl">⬡</span>
            Bhavya
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-gold rounded-lg hover:bg-subtle transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth area */}
          <div className="flex items-center gap-2">
            {role === 'guest' && (
              <>
                <Link
                  href={ROUTES.SIGN_IN}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-gold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={ROUTES.CONTACT}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-accent-deep to-accent-gold rounded-full hover:from-accent-gold-hover hover:to-accent-gold shadow-[var(--shadow-card)] transition-all"
                >
                  Get Quote
                </Link>
              </>
            )}

            {role === 'customer' && (
              <>
                <Link
                  href="/account"
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-gold transition-colors"
                >
                  Account
                </Link>
                <form action="/auth/sign-out" method="POST">
                  {/* Implementing signOut cleanly with an action is best, here we route to a handler or use client side logic */}
                  <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-red-500 transition-colors">
                    Sign Out
                  </button>
                </form>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link
                  href="/account"
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-gold transition-colors"
                >
                  Account
                </Link>
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  Admin
                </Link>
                <form action="/auth/sign-out" method="POST">
                  <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-red-500 transition-colors">
                    Sign Out
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
