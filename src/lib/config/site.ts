/**
 * Default site metadata — used as fallback before site_settings are loaded from DB.
 */
export const siteConfig = {
  name: 'Bhavya closures',
  description: 'Premium bottle cap manufacturing — browse our catalog and enquire directly.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  companyName: 'Bhavya',
} as const;
