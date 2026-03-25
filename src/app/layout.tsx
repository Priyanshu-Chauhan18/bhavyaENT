import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { siteConfig } from '@/lib/config/site';
import { getManySettings } from '@/features/admin/db/settings';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
      icon: '/favicon.ico',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased text-foreground bg-background min-h-screen flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
