import { Button } from '@/components/ui/button';
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { getManySettings } from '@/features/admin/db/settings';

export const metadata = {
  title: 'Contact Sales | Bhavya Closures',
  description: 'Reach out for custom quotes, wholesale orders, and technical support.',
};

export default async function ContactPage() {
  const settings = await getManySettings([
    'company_email', 'company_phone', 'company_address'
  ]);

  const email = settings.company_email || 'sales@bhavya.com';
  const phone = settings.company_phone || '+91 98765 43210';
  const address = settings.company_address || 'Bhavya Industrial Park\nMumbai, Maharashtra 400001';

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="heading-editorial text-3xl md:text-4xl font-extrabold text-text-primary mb-4">Contact Our Team</h1>
        <p className="body-relaxed text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
          Whether you need a custom closure run or have technical questions regarding thread torque, our engineering and sales teams are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="flex flex-col items-center bg-surface p-8 rounded-2xl border border-border-default shadow-[var(--shadow-card)] text-center group hover:shadow-[var(--shadow-hover)] transition-all">
          <div className="bg-surface-dim text-accent-deep p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
            <MailIcon className="w-8 h-8" />
          </div>
          <h3 className="heading-editorial text-lg font-bold text-text-primary mb-2">Email Us</h3>
          <p className="text-text-secondary text-sm mb-4">For general inquiries and technical specs.</p>
          <a href={`mailto:${email}`} className="text-accent-deep font-medium hover:text-accent-gold transition-colors">
            {email}
          </a>
        </div>

        <div className="flex flex-col items-center bg-surface p-8 rounded-2xl border border-border-default shadow-[var(--shadow-card)] text-center group hover:shadow-[var(--shadow-hover)] transition-all">
          <div className="bg-surface-dim text-accent-deep p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
            <PhoneIcon className="w-8 h-8" />
          </div>
          <h3 className="heading-editorial text-lg font-bold text-text-primary mb-2">Call Sales</h3>
          <p className="text-text-secondary text-sm mb-4">Mon-Fri from 8am to 6pm (IST).</p>
          <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-accent-deep font-medium hover:text-accent-gold transition-colors">
            {phone}
          </a>
        </div>

        <div className="flex flex-col items-center bg-surface p-8 rounded-2xl border border-border-default shadow-[var(--shadow-card)] text-center group hover:shadow-[var(--shadow-hover)] transition-all">
          <div className="bg-surface-dim text-accent-deep p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
            <MapPinIcon className="w-8 h-8" />
          </div>
          <h3 className="heading-editorial text-lg font-bold text-text-primary mb-2">Headquarters</h3>
          <p className="text-text-secondary text-sm mb-4">Factory tours available by appointment.</p>
          <span className="text-text-primary font-medium whitespace-pre-line">
            {address}
          </span>
        </div>

      </div>
    </div>
  );
}
