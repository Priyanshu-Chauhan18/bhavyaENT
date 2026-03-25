/**
 * Centralized constants — routes, roles, statuses, enums.
 * Single source of truth. Do not duplicate these values elsewhere.
 */

// ─── Roles ───────────────────────────────────────────────
// "guest" is NOT a DB role — it means no session.
export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ─── Publish Status ──────────────────────────────────────
export const PUBLISH_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type PublishStatus = (typeof PUBLISH_STATUS)[keyof typeof PUBLISH_STATUS];

// ─── Enquiry Channels ────────────────────────────────────
export const ENQUIRY_CHANNELS = {
  WHATSAPP: 'whatsapp',
} as const;

// ─── Route Paths ─────────────────────────────────────────
export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  CATALOG: '/catalog',
  CATEGORY: (slug: string) => `/catalog/${slug}`,
  PRODUCT: (slug: string) => `/product/${slug}`,

  // Auth
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Account
  ACCOUNT: '/account',
  ACCOUNT_PROFILE: '/account/profile',

  // Admin
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CATALOGS: '/admin/catalogs',
  ADMIN_TEMPLATES: '/admin/enquiry-templates',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_USERS: '/admin/users',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',

  // API
  API_HEALTH_LIVE: '/api/health/live',
  API_HEALTH_READY: '/api/health/ready',
} as const;

// ─── Route Groups (for middleware matching) ──────────────
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.FAQ,
  '/catalog',
  '/product',
];

export const AUTH_ROUTES = [
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

export const ACCOUNT_ROUTES = [
  ROUTES.ACCOUNT,
  ROUTES.ACCOUNT_PROFILE,
];

export const ADMIN_ROUTES_PREFIX = '/admin';

// ─── Settings Keys ───────────────────────────────────────
export const SETTINGS_KEYS = {
  COMPANY_NAME: 'company_name',
  COMPANY_EMAIL: 'company_email',
  COMPANY_PHONE: 'company_phone',
  COMPANY_ADDRESS: 'company_address',
  WHATSAPP_NUMBER: 'whatsapp_number',
  DEFAULT_SEO_TITLE: 'default_seo_title',
  DEFAULT_SEO_DESCRIPTION: 'default_seo_description',
  HERO_HEADLINE: 'hero_headline',
  HERO_SUBHEADLINE: 'hero_subheadline',
} as const;
