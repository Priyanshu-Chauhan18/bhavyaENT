import Link from 'next/link';
import { ROUTES } from '@/lib/config/constants';
import { getManySettings } from '@/features/admin/db/settings';

export async function Footer() {
  const settings = await getManySettings([
    'company_name', 'company_email', 'company_phone', 'company_address'
  ]);

  const companyName = settings.company_name || 'Bhavya Closures';
  const email = settings.company_email || 'contact@bhavya.example.com';
  const phone = settings.company_phone || '+91 XXXX-XXXXXX';
  const address = settings.company_address || 'Mumbai, India';

  return (
    <footer className="bg-subtle text-text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center text-xl font-bold bg-gradient-to-r from-accent-deep to-accent-gold bg-clip-text text-transparent pr-2"
            >
              <span className="mr-2">⬡</span>{companyName}
            </Link>
            <p className="mt-3 text-sm text-text-muted max-w-md body-relaxed">
              Premium bottle cap manufacturing — browse our catalog, explore our range, and enquire directly for bulk orders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={ROUTES.CATALOG} className="text-sm text-text-muted hover:text-accent-deep transition-colors">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href={ROUTES.ABOUT} className="text-sm text-text-muted hover:text-accent-deep transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CONTACT} className="text-sm text-text-muted hover:text-accent-deep transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={ROUTES.FAQ} className="text-sm text-text-muted hover:text-accent-deep transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-text-muted">{email}</li>
              <li className="text-text-muted">{phone}</li>
              <li className="text-text-muted">{address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border-subtle text-center text-xs text-text-muted">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
