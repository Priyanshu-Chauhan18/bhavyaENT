'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

interface NavbarClientProps {
  role: string;
}

export function NavbarClient({ role }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex flex-col justify-center shrink-0">
            <Image
              src="/images/logo/bhavya-logo.png"
              alt="BHAVYAA ENTERPRISES"
              width={240}
              height={60}
              className="w-auto h-11 md:h-14 object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-deep rounded-lg hover:bg-subtle transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-2">
            {role === 'guest' && (
              <>
                <Link
                  href="/auth/sign-in"
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-deep transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-accent-deep to-accent-green rounded-full hover:opacity-90 shadow-[var(--shadow-card)] transition-all"
                >
                  Get Quote
                </Link>
              </>
            )}

            {(role === 'customer' || role === 'admin') && (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-deep transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                {role === 'admin' && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-sm font-medium text-accent-deep hover:text-accent-green bg-accent-deep/5 hover:bg-accent-deep/10 rounded-lg transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <form action="/auth/sign-out" method="POST">
                  <button className="px-4 py-2 text-sm font-medium text-text-muted hover:text-red-600 transition-colors">
                    Sign Out
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-accent-deep rounded-lg hover:bg-subtle transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-subtle bg-surface">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-text-secondary hover:text-accent-deep hover:bg-subtle rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border-subtle pt-3 mt-3">
              {role === 'guest' ? (
                <>
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-accent-deep"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-white bg-accent-deep rounded-lg text-center mt-2"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-text-secondary hover:text-accent-deep"
                  >
                    Profile
                  </Link>
                  {role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-accent-deep"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <form action="/auth/sign-out" method="POST">
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600"
                    >
                      Sign Out
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
