# Bhavya — Post-Launch Architecture & Future Expansion Guide (Phase 13)

This document establishes the official architectural guardrails, post-launch stabilization routines, and safe expansion paths for the Bhavya Premium Closures e-commerce platform.

**CRITICAL RULE:** Do not begin future expansion work until the core features (Authentication, Public Storefront, Catalog Navigation, Admin CRUD, and WhatsApp Enquiry) are verified stable in production.

---

## 1. Core Architectural Guardrails (Do Not Break)

To preserve horizontal scalability and high availability, all future engineers and tools must adhere to the following rules:

### A. The Stateless App Rule
- **No in-memory state:** The Next.js application layer must remain entirely stateless.
- **No server-side memory sessions:** All session validation must route through Supabase Auth JWTs.
- **Why:** This ensures the app can scale across multiple regions or instances instantly without sticky sessions.

### B. Shared Infrastructure Rule
- Any new caching mechanism, scalable module, or storage layer must be centralized (e.g., Supabase PostgreSQL, Redis, CDN) and never rely on local filesystem writes (excluding temporary cache).
- **Media Assets:** Must be uploaded to Supabase Storage and served via `next/image` with remote patterns.

### C. Backend & API Rules
- Always use `getServerSupabaseClient` for server actions.
- Avoid passing massive unpaginated datasets to the client.
- Maintain the strict separation between public routes `(public)` and protected features.

---

## 2. Safe Future Expansion Tracks

When the business dictates new features, use the following dependency maps to ensure you don't destabilize the core.

### 2.1 Enquiry Management Dashboard
* **Goal:** Allow admins to track and follow up on enquiries, and allow users to see their history.
* **Architecture:** Build on top of the existing `enquiries` table. Introduce a `status` enum (e.g., `NEW`, `CONTACTED`, `RESOLVED`).
* **Guardrail:** Do not alter the public WhatsApp CTA payload format; simply mirror the logs into a dashboard view.

### 2.2 Richer Customer Account Area
* **Goal:** Allow B2B buyers to save specific closures, download spec sheets, and complete company profiles.
* **Architecture:** Extend the existing `profiles` table. Add a `saved_products` junction table.
* **Guardrail:** Respect the existing App Router Auth guard (`requireActiveUser()`). Profile completion should enhance the UI, not aggressively block browsing.

### 2.3 Advanced Content Management (CMS)
* **Goal:** Editable homepage hero banners, dynamically managed FAQs, and testimonials.
* **Architecture:** Move away from hardcoded JSON blobs in `site_settings`. Create dedicated relational tables (`content_blocks`, `faqs`, `testimonials`).
* **Guardrail:** Implement aggressive ISR (Incremental Static Regeneration) on CMS fetches to prevent database bottlenecks on the homepage.

### 2.4 Multi-Language & Regional Routing
* **Goal:** Support different locales for international manufacturing clients.
* **Architecture:** Utilize Next.js App Router i18n (`/[locale]/...`). Extend product database tables to support `JSONB` translations or localized rows.
* **Guardrail:** Implement carefully on a separate git branch. This will fundamentally alter the routing paradigm.

---

## 3. Post-Launch QA Rhythm

After any minor patch or major future feature deployment, the following manual regression loop **MUST** be executed. Automated tests do not replace this loop for critical B2B flows.

1. **Auth Lifecycle:** Register a new user -> Verify Email flow -> Sign In -> Sign Out.
2. **Guest Restrictions:** Verify that a logged-out guest is correctly shown the frosted glass lock over Tier-1 pricing/MOQ data on product pages.
3. **Admin Integrity:** Log in as an admin, edit a product description, and confirm the change applies immediately to the public storefront (Cache invalidation check).
4. **Enquiry Conversion:** Click the "Enquire via WhatsApp" button on a product page and confirm the message payload correctly includes the Product Name, SKU, and user details.

---

## 4. Technical Debt Watchlist

Monitor the codebase for the following anti-patterns as the app grows:
- **`site_settings` Bloat:** Do not shove massive arrays (like full page layouts) into the single JSON key-value settings table.
- **Audit Log Growth:** Implement pagination if `audit_logs` exceed 10,000 rows.
- **Validation Drifts:** Ensure Zod schemas in `src/lib/validation` stay perfectly synced with Supabase TypeScript types.

---

## 5. Production Scalability & Resilience

To ensure the "Precision Warmth" UX does not degrade under load, the following production telemetry and protections must be integrated:

### 5.1 Observability & Error Monitoring
- **Requirement:** Integrate a centralized error tracking service (e.g., Sentry) alongside Supabase's native logging.
- **Goal:** Capture runtime exceptions, 500 errors, and client-side React hydration crashes in real-time to maintain platform stability.

### 5.2 Performance Monitoring
- **Requirement:** Track **Core Web Vitals** (LCP, FID, CLS) actively.
- **Goal:** Ensure that layout shifts and heavy bundle sizes do not compromise the premium feel of the storefront. The frontend must remain lightweight despite complex animations.

### 5.3 Abuse Protection (WhatsApp Entry)
- **Requirement:** Implement a lightweight rate-limiting mechanism upstream (e.g., Vercel Edge Middleware or Cloudflare).
- **Goal:** Protect the high-value public B2B WhatsApp gateway from automated bot spam or malicious programmatic triggers.

### 5.4 Media Optimization Strategy
- **Requirement:** Standardize all Supabase Storage uploads.
- **Goal:** Enforce maximum file sizes (e.g., `< 500KB` for thumbnails) and serve exclusively via Next.js `<Image>` component utilizing modern WebP/AVIF formats and strict `sizes` attributes for CDN delivery.

---

## 6. Future Content & Rollout Strategy

### 6.1 SEO Expansion Path
- Phase 12 solidified technical SEO. Future marketing efforts must focus on organic content scalability:
- **Architecture:** Support dynamic landing pages, programmatic category SEO clusters, and structured FAQ expansions. Keep all new content heavily cached using Next.js App Router static rendering.

### 6.2 Controlled Rollout Strategy
- **Requirement:** Feature flags for all major updates.
- **Goal:** For massive upcoming modules (like the CMS or Multi-language routing), work must be merged behind environment-based feature flags (`NEXT_PUBLIC_ENABLE_CMS=true`). This prevents experimental code from destabilizing the core B2B storefront.

> **Final Note to Future Developers:** Bhavya was built with a "Precision Warmth" editorial standard and a robust B2B engine. Treat the codebase as a premium asset. When in doubt, read the `walkthrough.md` from Phase 1-12 to understand how the platform was constructed.
