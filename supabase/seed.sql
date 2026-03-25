-- Seed Data for Phase 3: Catalogs, Categories, Products, and Config
-- No auth.users constraints, purely business domain testing.

-- 1. Catalogs
INSERT INTO public.catalogs (id, name, slug, description, is_active, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'Metal Closures', 'metal-closures', 'Durable, high-quality metal caps for beverages and pharmaceuticals.', true, 10),
('22222222-2222-2222-2222-222222222222', 'Plastic Closures', 'plastic-closures', 'Versatile and lightweight plastic caps for various industries.', true, 20);

-- 2. Categories
INSERT INTO public.categories (id, catalog_id, name, slug, description, is_active, sort_order) VALUES
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Crown Caps', 'crown-caps', 'Classic crown cork closures for glass bottles.', true, 10),
('c1111111-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'ROPP Caps', 'ropp-caps', 'Roll On Pilfer Proof caps for spirits and pharmaceuticals.', true, 20),
('c2222222-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Screw Caps', 'screw-caps', 'Standard threaded plastic caps for PET bottles.', true, 10),
('c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Flip Top Caps', 'flip-top-caps', 'Convenient dispensing closures for personal care.', true, 20);

-- 3. Products
-- Note: UUIDs must be hexadecimal. Fixed 'p' to 'd'
INSERT INTO public.products (
    id, category_id, name, slug, sku, short_description, full_description, 
    color, material, finish, neck_size, moq, lead_time, 
    is_featured, is_active, publish_status
) VALUES
('d1111111-0000-0000-0000-000000000001', 'c1111111-1111-1111-1111-111111111111', '26mm Standard Crown', '26mm-standard-crown', 'CROWN-001', 
 'Classic 26mm crown cap suitable for beer and soda.',
 'The 26mm Standard Crown is our most popular closure. Features a PVC-free liner for excellent carbonation retention. Suitable for cold and hot fill applications up to 85°C.',
 'Standard Silver', 'Tinplate', 'Glossy', '26mm', '50,000 units', '2-3 weeks', 
 true, true, 'published'),

('d1111111-0000-0000-0000-000000000002', 'c1111111-2222-2222-2222-222222222222', '28mm Aluminum ROPP', '28mm-alu-ropp', 'ROPP-028',
 'Tamper-evident 28x15mm aluminum closure.',
 'High-grade aluminum Roll On Pilfer Proof (ROPP) cap designed for spirits and wines. Offers superior tamper evidence and branding potential through lithographic printing.',
 'Gold', 'Aluminum', 'Matte', '28mm', '100,000 units', '4 weeks',
 true, true, 'published'),

('d2222222-0000-0000-0000-000000000001', 'c2222222-1111-1111-1111-111111111111', '28mm PCO 1881 Screw Cap', '28mm-pco-1881', 'SCREW-28P',
 'Lightweight 28mm plastic closure for carbonated beverages.',
 'Designed for the PCO 1881 neck finish, this two-piece closure offers excellent gas retention while using 15% less plastic than traditional 1810 closures. Features a drop-down tamper band.',
 'Blue', 'HDPE/PP', 'Textured', '28mm PCO 1881', '200,000 units', '2 weeks',
 false, true, 'published'),

('d2222222-0000-0000-0000-000000000002', 'c2222222-2222-2222-2222-222222222222', '24/410 Flip Top Cap', '24-410-flip-top', 'FLIP-24-410',
 'Dispensing closure with a 3mm orifice for lotions.',
 'A versatile 24/410 flip top cap made from sturdy PP. Features a butterfly hinge and a "click" closing mechanism to ensure leak-free transport.',
 'White', 'PP', 'Glossy', '24/410', '25,000 units', '3 weeks',
 true, true, 'published'),

('d3333333-0000-0000-0000-000000000003', 'c1111111-1111-1111-1111-111111111111', 'Draft Prototype Cap', 'draft-prototype-cap', 'DRAFT-001',
 'Under development.',
 'Internal notes regarding the new experimental liner material. Not ready for public viewing.',
 'Unpainted', 'Steel', 'Raw', '26mm', 'TBD', 'TBD',
 false, false, 'draft');

-- 4. Product Images
INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary) VALUES
('d1111111-0000-0000-0000-000000000001', '/images/seeds/crown.png', 'Silver 26mm Crown Cap', true),
('d1111111-0000-0000-0000-000000000002', '/images/seeds/ropp.png', 'Gold 28mm ROPP Cap', true),
('d2222222-0000-0000-0000-000000000001', '/images/seeds/screw.png', 'Blue PCO 1881 Cap', true),
('d2222222-0000-0000-0000-000000000002', '/images/seeds/flip.png', 'White Flip Top Cap', true);

-- 5. Product Specs (Testing public vs private)
INSERT INTO public.product_specs (product_id, spec_key, spec_value, is_public, sort_order) VALUES
-- Crown Cap
('d1111111-0000-0000-0000-000000000001', 'Liner Type', 'PVC-free Granulate', true, 10),
('d1111111-0000-0000-0000-000000000001', 'Pressure Rating', 'Up to 8 bar', true, 20),
('d1111111-0000-0000-0000-000000000001', 'Internal Supplier ID', 'SUP-M-009', false, 30), -- Private

-- ROPP Cap
('d1111111-0000-0000-0000-000000000002', 'Liner Type', 'EPE/Saran', true, 10),
('d1111111-0000-0000-0000-000000000002', 'Tamper Evident', 'Drop-down band', true, 20),
('d1111111-0000-0000-0000-000000000002', 'Cost Per Unit (Estimate)', '$0.012', false, 30); -- Private

-- 6. Enquiry Templates
INSERT INTO public.enquiry_templates (template_name, template_text, whatsapp_number, is_default, is_active) VALUES
('Default Global Template', 'Hello BottleCap team! I am interested in inquiring about {{product_name}} (SKU: {{sku}}). Could you provide information regarding the MOQ of {{moq}}?', '+15551234567', true, true);

-- 7. Site Settings
INSERT INTO public.site_settings (key, value_json) VALUES
('company_name', '"BottleCap Industries"'),
('company_email', '"sales@bottlecapindustries.demo"'),
('company_phone', '"+1-555-123-4567"'),
('whatsapp_number', '"+15551234567"'),
('default_seo_title', '"Premium Closures & Caps | BottleCap Industries"'),
('default_seo_description', '"Manufacturer of high-quality metal and plastic closures for beverages, pharmaceuticals, and personal care."'),
('hero_headline', '"Securing Your Products with Precision"'),
('hero_subheadline', '"Explore our extensive catalog of crowns, ROPP, and plastic closures."');
