import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { siteConfig } from '@/lib/config/site';
import { getManySettings } from '@/features/admin/db/settings';

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat' 
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getManySettings(['default_seo_title', 'default_seo_description', 'company_name']);

  const siteName = settings.default_seo_title || settings.company_name || siteConfig.name;
  const siteDescription = settings.default_seo_description || siteConfig.description;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: siteDescription,
    openGraph: {
      title: siteName,
      description: siteDescription,
      siteName: siteName,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: siteName }],
    },
    manifest: '/manifest.json',
    icons: {
      icon: '/images/logo/favicon-transparent.png',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body className="font-sans antialiased text-foreground bg-background min-h-screen flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
