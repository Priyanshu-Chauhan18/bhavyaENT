/**
 * Default site metadata — used as fallback before site_settings are loaded from DB.
 */
export const siteConfig = {
  name: 'Bhavyaa Enterprises',
  description: 'Leading manufacturer of premium plastic bottle caps, plastic cups, plastic tools, toys, and custom closures. Browse our comprehensive catalog and enquire directly.',
  keywords: ['Bhavyaa Enterprises', 'plastic bottle caps', 'plastic caps', 'plastic cups', 'plastic tools', 'plastic toys', 'closures', 'bottle closures', 'manufacturing'],
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bhavyaaenterprises.com',
  ogImage: '/og-image.png',
  companyName: 'Bhavyaa Enterprises',
} as const;
