import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/auth/', '/api/', '/account/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
