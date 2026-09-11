-- ─── Demo Users ───────────────────────────────────────────
-- DEMO USERS MUST NOT BE CREATED VIA SQL WITH HARDCODED PASSWORDS.
-- Instead, create demo users manually from the Supabase Dashboard or via
-- a local script after seeding. See supabase/SETUP_DEMO_USERS.md for
-- step-by-step instructions.
--
-- After creating users in the Supabase Auth UI with the IDs listed below,
-- run the admin/customer role mapping statements at the bottom of this
-- file to wire the accounts into admin_users and profiles.
--
--   Admin   → UUID: a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1
--             Email: admin@emiratesmodest.com
--   Customer → UUID: c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2
--             Email: customer@emiratesmodest.com
--
-- Then run ONLY these statements (idempotent):

INSERT INTO public.admin_users (id, role)
VALUES ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'admin')
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET role = 'admin', full_name = 'Admin User' WHERE id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';
UPDATE public.profiles SET full_name = 'Fatima Almansouri', phone = '9747793814' WHERE id = 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2';

-- ─── Categories ──────────────────────────────────────

INSERT INTO public.categories (id, name, slug, description, image, product_count, is_active)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Abayas', 'abayas', 'Timeless abayas for the modern woman.', '/images/products/abaya-classic-black-1.jpg', 5, true),
  ('b1000000-0000-0000-0000-000000000002', 'Luxury Abayas', 'luxury-abayas', 'Hand-crafted premium luxury collection.', '/images/products/abaya-emerald-luxury-1.jpg', 2, true),
  ('b1000000-0000-0000-0000-000000000003', 'Open Abayas', 'open-abayas', 'Elegant open-front abaya styles.', '/images/products/abaya-modern-navy-1.jpg', 2, true),
  ('b1000000-0000-0000-0000-000000000004', 'Everyday Abayas', 'everyday-abayas', 'Comfortable abayas for daily wear.', '/images/products/abaya-casual-gray-1.jpg', 2, true),
  ('b1000000-0000-0000-0000-000000000005', 'Prayer Abayas', 'prayer-abayas', 'Soft, modest prayer wear.', '/images/products/abaya-prayer-sand-1.jpg', 1, true),
  ('b1000000-0000-0000-0000-000000000006', 'Hijabs', 'hijabs', 'Curated hijabs to complement every abaya.', '/images/products/hijab-silk-beige-1.jpg', 2, true),
  ('b1000000-0000-0000-0000-000000000007', 'Matching Hijabs', 'matching-hijabs', 'Perfectly matched hijabs for your abaya.', '/images/products/hijab-pearl-ivory-1.jpg', 1, true),
  ('b1000000-0000-0000-0000-000000000008', 'Accessories', 'accessories', 'Premium accessories to complete your look.', '/images/products/hijab-cotton-sand-1.jpg', 1, true)
ON CONFLICT (id) DO NOTHING;

-- ─── Products ────────────────────────────────────────

INSERT INTO public.products (id, slug, name, description, short_description, price, original_price, currency, category, subcategory, occasion, collection, fabric, color, colors, sku, stock, rating, review_count, is_new, is_featured, is_on_sale, tags, created_at, updated_at)
VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'abaya-classic-black',
    'Classic Black Silk Abaya',
    'Handcrafted from the finest premium silk, this timeless black abaya features delicate gold embroidery along the cuffs and hem. The flowing silhouette drapes beautifully, making it perfect for formal occasions or everyday elegance.',
    'Premium silk abaya with gold embroidery',
    139, 179, 'AED', 'abayas', 'classic', 'everyday', 'best-sellers', 'Silk', 'Black',
    '[{"id":"black","name":"Black","hex":"#111111"}]'::jsonb,
    'ABY-SB-001', 15, 4.8, 47, false, true, true,
    ARRAY['Premium', 'Silk', 'Luxury', 'Classic', 'Bestseller'],
    now() - interval '30 days', now()
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'abaya-modern-navy',
    'Modern Navy Chiffon Abaya',
    'A contemporary masterpiece in deep navy chiffon. This abaya features a relaxed open-front silhouette with concealed snap closures and wide flowy sleeves. Perfect for the modern woman who values both style and modesty.',
    'Contemporary open-front chiffon abaya in deep navy',
    109, 129, 'AED', 'abayas', 'modern', 'everyday', 'new-arrivals', 'Chiffon', 'Navy',
    '[{"id":"navy","name":"Navy","hex":"#001F3F"}]'::jsonb,
    'ABY-CN-002', 22, 4.6, 31, true, true, true,
    ARRAY['Modern', 'Chiffon', 'Contemporary', 'New'],
    now() - interval '15 days', now()
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'abaya-emerald-luxury',
    'Emerald Luxury Georgette Abaya',
    'Exquisite emerald georgette abaya adorned with hand-stitched crystal embellishments along the neckline and sleeves. A statement piece for special occasions, weddings, and formal events.',
    'Luxury georgette abaya with crystal embellishments',
    219, 279, 'AED', 'luxury-abayas', 'luxury-collection', 'wedding', 'luxury', 'Georgette', 'Emerald',
    '[{"id":"emerald","name":"Emerald","hex":"#047857"}]'::jsonb,
    'ABY-GE-003', 8, 4.9, 23, true, true, true,
    ARRAY['Luxury', 'Georgette', 'Crystal', 'Occasion', 'Premium'],
    now() - interval '10 days', now()
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'abaya-casual-gray',
    'Casual Gray Crepe Abaya',
    'Comfortable everyday abaya crafted in mid-weight premium Korean crepe. Extremely soft and breathable, with simple minimalist sleeve cuffs. Effortless modesty for daily errands or casual gatherings.',
    'Soft premium Korean crepe abaya for everyday wear',
    99, 119, 'AED', 'everyday-abayas', 'casual', 'everyday', 'sale', 'Crepe', 'Gray',
    '[{"id":"gray","name":"Gray","hex":"#808080"}]'::jsonb,
    'ABY-CG-004', 35, 4.5, 12, false, false, true,
    ARRAY['Crepe', 'Korean', 'Casual', 'Everyday'],
    now() - interval '45 days', now()
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    'abaya-prayer-sand',
    'Sand Modest Prayer Abaya',
    'Made with soft, flowy, lightweight rayon, this prayer abaya features an attached matching headscarf and elasticated wrists for seamless coverage. Perfect for daily namaz or pilgrimage comfort.',
    'Rayon prayer abaya with attached headscarf',
    89, 99, 'AED', 'prayer-abayas', 'prayer-wear', 'prayer', 'sale', 'Rayon', 'Sand',
    '[{"id":"sand","name":"Sand","hex":"#E1C699"}]'::jsonb,
    'ABY-RS-005', 18, 4.7, 9, false, false, true,
    ARRAY['Rayon', 'Prayer', 'Namaz', 'Modest'],
    now() - interval '60 days', now()
  ),
  (
    'p1000000-0000-0000-0000-000000000006',
    'hijab-silk-beige',
    'Premium Beige Silk Hijab',
    'Crafted from 100% fine mulberry silk, this premium beige hijab offers a luxurious sheen and a soft feel. Elevate your modest outfit for formal gatherings, dinners, or parties.',
    'Mulberry silk premium beige hijab',
    29, 39, 'AED', 'hijabs', 'premium-hijabs', 'party', 'best-sellers', 'Silk', 'Beige',
    '[{"id":"beige","name":"Beige","hex":"#F5F5DC"}]'::jsonb,
    'HJB-SB-006', 40, 4.7, 18, false, true, true,
    ARRAY['Silk', 'Mulberry', 'Premium', 'Beige'],
    now() - interval '20 days', now()
  ),
  (
    'p1000000-0000-0000-0000-000000000007',
    'hijab-pearl-ivory',
    'Pearl Trimmed Ivory Hijab',
    'Soft chiffon hijab adorned with delicate pearls along the borders. Drapes beautifully and adds a touch of elegance to any abaya or modest dress.',
    'Pearl embellished ivory chiffon hijab',
    39, 49, 'AED', 'matching-hijabs', 'embellished-hijabs', 'wedding', 'luxury', 'Chiffon', 'Ivory',
    '[{"id":"ivory","name":"Ivory","hex":"#FFFFF0"}]'::jsonb,
    'HJB-PI-007', 25, 4.8, 15, true, false, true,
    ARRAY['Chiffon', 'Pearl', 'Embellished', 'Ivory'],
    now() - interval '8 days', now()
  ),
  (
    'p1000000-0000-0000-0000-000000000008',
    'crystal-belt-gold',
    'Crystal Embellished Gold Belt',
    'Cinch your abayas with style. This gold plated adjustable belt is embedded with beautiful shining crystals, complete with secure links.',
    'Gold crystal belt accessory for abayas',
    19, 29, 'AED', 'accessories', 'belts', 'wedding', 'featured', 'Metal', 'Gold',
    '[{"id":"gold","name":"Gold","hex":"#FFD700"}]'::jsonb,
    'ACC-GB-008', 12, 4.4, 6, false, false, true,
    ARRAY['Metal', 'Belt', 'Crystal', 'Accessory'],
    now() - interval '40 days', now()
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Product Categories Mapping ──────────────────────

INSERT INTO public.product_categories (product_id, category_id)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001'),
  ('p1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001'),
  ('p1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002'),
  ('p1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004'),
  ('p1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000005'),
  ('p1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000006'),
  ('p1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000007'),
  ('p1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- ─── Product Gallery Images ──────────────────────────

INSERT INTO public.product_images (product_id, url, sort_order)
VALUES
  ('p1000000-0000-0000-0000-000000000001', '/images/products/abaya-classic-black-1.jpg', 0),
  ('p1000000-0000-0000-0000-000000000002', '/images/products/abaya-modern-navy-1.jpg', 0),
  ('p1000000-0000-0000-0000-000000000003', '/images/products/abaya-emerald-luxury-1.jpg', 0),
  ('p1000000-0000-0000-0000-000000000004', '/images/products/abaya-casual-gray-1.jpg', 0),
  ('p1000000-0000-0000-0000-000000000005', '/images/products/abaya-prayer-sand-1.jpg', 0),
  ('p1000000-0000-0000-0000-000000000006', '/images/products/hijab-silk-beige-1.jpg', 0),
  ('p1000000-0000-0000-0000-000000000007', '/images/products/hijab-pearl-ivory-1.jpg', 0),
  ('p1000000-0000-0000-0000-000000000008', '/images/products/hijab-cotton-sand-1.jpg', 0)
ON CONFLICT DO NOTHING;

-- ─── Inventory Setup ─────────────────────────────────

-- Classic Black Abaya Inventory (Black - S, M, L, XL with length variations)
INSERT INTO public.inventory (product_id, sku, size, color, length, stock_quantity, low_stock_threshold)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 'ABY-SB-001-S54', 'S', 'Black', '54"', 5, 2),
  ('p1000000-0000-0000-0000-000000000001', 'ABY-SB-001-M56', 'M', 'Black', '56"', 6, 2),
  ('p1000000-0000-0000-0000-000000000001', 'ABY-SB-001-L58', 'L', 'Black', '58"', 4, 2),

  ('p1000000-0000-0000-0000-000000000002', 'ABY-CN-002-S54', 'S', 'Navy', '54"', 8, 3),
  ('p1000000-0000-0000-0000-000000000002', 'ABY-CN-002-M56', 'M', 'Navy', '56"', 10, 3),
  ('p1000000-0000-0000-0000-000000000002', 'ABY-CN-002-L58', 'L', 'Navy', '58"', 4, 3),

  ('p1000000-0000-0000-0000-000000000003', 'ABY-GE-003-S54', 'S', 'Emerald', '54"', 3, 1),
  ('p1000000-0000-0000-0000-000000000003', 'ABY-GE-003-M56', 'M', 'Emerald', '56"', 3, 1),
  ('p1000000-0000-0000-0000-000000000003', 'ABY-GE-003-L58', 'L', 'Emerald', '58"', 2, 1),

  ('p1000000-0000-0000-0000-000000000004', 'ABY-CG-004-M56', 'M', 'Gray', '56"', 20, 5),
  ('p1000000-0000-0000-0000-000000000004', 'ABY-CG-004-L58', 'L', 'Gray', '58"', 15, 5),

  ('p1000000-0000-0000-0000-000000000005', 'ABY-RS-005-M56', 'M', 'Sand', '56"', 18, 5),

  ('p1000000-0000-0000-0000-000000000006', 'HJB-SB-006-OS', 'One Size', 'Beige', NULL, 40, 5),
  ('p1000000-0000-0000-0000-000000000007', 'HJB-PI-007-OS', 'One Size', 'Ivory', NULL, 25, 5),
  ('p1000000-0000-0000-000000000008', 'ACC-GB-008-OS', 'One Size', 'Gold', NULL, 12, 3)
ON CONFLICT (sku) DO NOTHING;

-- ─── Coupons ─────────────────────────────────────────

INSERT INTO public.coupons (code, discount_type, discount_value, minimum_order_value, active)
VALUES ('EMIRATES5', 'fixed', 25, 100, true)
ON CONFLICT (code) DO NOTHING;

-- ─── Site Settings ───────────────────────────────────

INSERT INTO public.site_settings (key, value)
VALUES
  (
    'business_info',
    '{"name": "EMIRATES ABAYA WORLD & BOUTIQUE", "address": "10/488/CDEF, GOV: Hospital Karunagappally, Kollam, Kerala - 690518", "gst": "32BMXPH3195M1ZD", "email": "care@emiratesabayaworld.com", "phone_numbers": ["8129914915", "9747793814"]}'::jsonb
  ),
  (
    'shipping_zones',
    '[{"name": "UAE", "transit": "2-3 days", "fee": 25, "free_above": 500}, {"name": "GCC", "transit": "5-7 days", "fee": 50, "free_above": 800}, {"name": "International", "transit": "10-14 days", "fee": 100, "free_above": 1500}]'::jsonb
  ),
  (
    'homepage_content',
    '{"hero_title": "Bespoke Modest Luxury", "hero_subtitle": "Handcrafted premium abayas made in the UAE", "hero_cta": "Shop Collection", "hero_image": "/images/hero.jpg", "announcement_bar": "FIRST PURCHASE 5% OFF | FREE SHIPPING ABOVE AED 500"}'::jsonb
  )
ON CONFLICT (key) DO NOTHING;

-- ─── Demo Reviews ────────────────────────────────────

INSERT INTO public.reviews (product_id, user_name, rating, title, comment, status, verified_purchase)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 'Aisha M.', 5, 'Breathtaking quality', 'The silk fabric is absolutely stunning and drapes so elegantly. The gold embroidery is incredibly fine and detailed. Will buy again!', 'approved', true),
  ('p1000000-0000-0000-0000-000000000001', 'Sarah K.', 4, 'Very elegant', 'Lovely abaya, feels very premium. Length is perfect. Delivered in 3 days to Dubai.', 'approved', true),
  ('p1000000-0000-0000-0000-000000000002', 'Laila R.', 5, 'Perfect modern cut', 'Beautiful chiffon abaya. Extremely lightweight and comfortable for everyday wear. Love the wide sleeves.', 'approved', true)
ON CONFLICT DO NOTHING;
