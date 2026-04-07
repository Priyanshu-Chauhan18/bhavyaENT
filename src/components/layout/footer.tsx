import Link from 'next/link';
import Image from 'next/image';
import { getManySettings } from '@/features/admin/db/settings';

export async function Footer() {
  const settings = await getManySettings([
    'company_name', 'company_email', 'company_phone', 'company_address'
  ]);

  const companyName = settings.company_name || 'BHAVYAA ENTERPRISES';
  const email = settings.company_email || 'contact@bhavya.example.com';
  const phone = settings.company_phone || '+91 XXXX-XXXXXX';
  const address = settings.company_address || 'India';

  return (
    <footer className="bg-accent-brown-deep text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Info */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/images/logo/logo-final.png"
                alt="BHAVYAA ENTERPRISES"
                width={32}
                height={32}
                className="w-8 h-8 object-contain brightness-0 invert opacity-90"
              />
              <span className="text-lg font-bold text-white tracking-tight font-heading">
                {companyName}
              </span>
            </Link>
            <p className="text-sm text-white/60 body-relaxed max-w-xs">
              Premium bottle cap manufacturing — browse our catalog and enquire directly for bulk orders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-white/60 hover:text-accent-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-sm text-white/60 hover:text-accent-gold transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/60 hover:text-accent-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white/60 hover:text-accent-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>{email}</li>
              <li>{phone}</li>
              <li>{address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
