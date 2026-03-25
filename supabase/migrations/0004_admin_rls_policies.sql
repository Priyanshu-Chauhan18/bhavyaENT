-- ==============================================================================
-- PHASE 9: AUTHORIZATION HARDENING — ADMIN RLS POLICIES
-- ==============================================================================
-- Defense-in-depth RLS policies for tables that were previously protected
-- only by the service-role client. These ensure that even if a browser-side
-- query accidentally targets these tables, RLS enforces the correct access.
--
-- NOTE: All admin mutations currently use createAdminSupabaseClient() which
-- bypasses RLS. These policies are a safety net, not the primary protection.
-- ==============================================================================

-- ─── Helper: reusable admin check subquery ───────────────────────────
-- Used in all admin policies below. Checks if the current auth user
-- has role_key = 'admin' in their profile.

-- ─── 1. PRODUCTS ─────────────────────────────────────────────────────

-- Admin can do everything with products
CREATE POLICY "Admin full access on products"
ON public.products FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_key = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_key = 'admin'
  )
);

-- Authenticated users can read active published products (for full detail page)
CREATE POLICY "Authenticated read active published products"
ON public.products FOR SELECT
TO authenticated
USING (is_active = true AND publish_status = 'published');

-- ─── 2. ENQUIRIES ────────────────────────────────────────────────────

-- Admin can read all enquiries
CREATE POLICY "Admin read all enquiries"
ON public.enquiries FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_key = 'admin'
  )
);

-- Users can read their own enquiries
CREATE POLICY "Users read own enquiries"
ON public.enquiries FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own enquiries
CREATE POLICY "Users insert own enquiries"
ON public.enquiries FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ─── 3. ENQUIRY TEMPLATES ───────────────────────────────────────────

-- Admin full access on templates
CREATE POLICY "Admin full access on enquiry templates"
ON public.enquiry_templates FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_key = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_key = 'admin'
  )
);

-- Anyone can read active templates (needed for enquiry flow resolution)
CREATE POLICY "Public read active enquiry templates"
ON public.enquiry_templates FOR SELECT
USING (is_active = true);

-- ─── 4. SITE SETTINGS ───────────────────────────────────────────────

-- Admin full access on settings
CREATE POLICY "Admin full access on site settings"
ON public.site_settings FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_key = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_key = 'admin'
  )
);

-- Public read on settings (settings are public info — footer, hero, SEO)
CREATE POLICY "Public read site settings"
ON public.site_settings FOR SELECT
USING (true);

-- ─── 5. AUDIT LOGS ──────────────────────────────────────────────────

-- Admin read-only on audit logs (no mutation via browser)
CREATE POLICY "Admin read audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_key = 'admin'
  )
);

-- Admin can insert audit logs (for server actions that use anon client)
CREATE POLICY "Admin insert audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_key = 'admin'
  )
);
