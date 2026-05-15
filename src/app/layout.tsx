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
    keywords: [...siteConfig.keywords],
    openGraph: {
      title: siteName,
      description: siteDescription,
      siteName: siteName,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: siteName }],
    },
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
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
        {/* Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Bhavyaa Enterprises",
              "alternateName": ["Bhavyaa", "Bhavya Enterprises", "BHAVYAA ENTERPRISES"],
              "url": "https://bhavyaaenterprises.com",
              "logo": "https://bhavyaaenterprises.com/favicon-32x32.png",
              "description": siteConfig.description,
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9671016735",
                "contactType": "sales",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
              }
            })
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
