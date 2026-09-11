-- ─── Helper Functions & Sequences ────────────────────

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequence for human-readable order numbers
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1;

-- ─── Table Setup ─────────────────────────────────────

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Admin Users Table (Secondary Admin Mapping Table)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = user_id
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    'customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image text,
  product_count integer DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  short_description text,
  price numeric NOT NULL,
  original_price numeric,
  currency text DEFAULT 'INR' NOT NULL,
  category text, -- Category Slug reference
  subcategory text,
  occasion text,
  collection text,
  fabric text NOT NULL,
  color text NOT NULL,
  colors jsonb DEFAULT '[]'::jsonb, -- Array of other color options
  sku text UNIQUE NOT NULL,
  stock integer DEFAULT 0 NOT NULL,
  rating numeric DEFAULT 0 NOT NULL,
  review_count integer DEFAULT 0 NOT NULL,
  is_new boolean DEFAULT false NOT NULL,
  is_featured boolean DEFAULT false NOT NULL,
  is_on_sale boolean DEFAULT false NOT NULL,
  tags text[] DEFAULT '{}'::text[] NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 5. Product Categories Join Table (supporting many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- 6. Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 7. Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  sku text UNIQUE NOT NULL,
  size text,
  color text,
  length text,
  stock_quantity integer DEFAULT 0 NOT NULL,
  low_stock_threshold integer DEFAULT 5 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 8. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')) NOT NULL,
  discount_value numeric NOT NULL,
  minimum_order_value numeric DEFAULT 0 NOT NULL,
  maximum_discount numeric,
  start_date timestamp with time zone,
  expiry_date timestamp with time zone,
  usage_limit integer,
  usage_count integer DEFAULT 0 NOT NULL,
  active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 9. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  shipping_address jsonb NOT NULL,
  delivery_method text NOT NULL,
  shipping_fee numeric DEFAULT 0 NOT NULL,
  cod_fee numeric DEFAULT 0 NOT NULL,
  discount_amount numeric DEFAULT 0 NOT NULL,
  tax_amount numeric DEFAULT 0 NOT NULL,
  subtotal numeric NOT NULL,
  total numeric NOT NULL,
  coupon_code text,
  payment_method text NOT NULL,
  payment_status text DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')) NOT NULL,
  order_status text DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded')) NOT NULL,
  transaction_reference text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 10. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  selected_size text,
  selected_color text,
  selected_length text,
  selected_hijab text,
  selected_hijab_price numeric DEFAULT 0 NOT NULL,
  subtotal numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 11. Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  house text NOT NULL,
  area text NOT NULL,
  landmark text,
  city text NOT NULL,
  state text NOT NULL,
  country text NOT NULL,
  pin_code text NOT NULL,
  is_default boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 12. Wishlists Table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 13. Wishlist Items Table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id uuid REFERENCES public.wishlists(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT unique_wishlist_product UNIQUE (wishlist_id, product_id)
);

-- 14. Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity integer DEFAULT 1 NOT NULL,
  size text,
  color text,
  length text,
  hijab text,
  hijab_price numeric DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 15. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title text,
  comment text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')) NOT NULL,
  verified_purchase boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 16. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 17. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 18. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 19. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  metadata jsonb,
  timestamp timestamp with time zone DEFAULT now() NOT NULL
);

-- ─── Triggers for Updated At ─────────────────────────

CREATE OR REPLACE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── Row Level Security (RLS) Configuration ──────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ─── Policies ────────────────────────────────────────

-- Profiles Policies
CREATE POLICY "Public profiles read access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles update access owned" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admin profile manager" ON public.profiles FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Admin Users Policies
CREATE POLICY "Admin select admins" ON public.admin_users FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin write admins" ON public.admin_users FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Categories Policies
CREATE POLICY "Categories read access" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admin category manager" ON public.categories FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Products Policies
CREATE POLICY "Products read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin product manager" ON public.products FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Product Categories Policies
CREATE POLICY "Product categories read access" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Admin product category manager" ON public.product_categories FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Product Images Policies
CREATE POLICY "Product images read access" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admin product images manager" ON public.product_images FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Inventory Policies
CREATE POLICY "Inventory read access" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Admin inventory manager" ON public.inventory FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Coupons Policies
CREATE POLICY "Coupons read access authenticated" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Admin coupons manager" ON public.coupons FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Orders Policies
CREATE POLICY "Orders select owned" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Orders insert authenticated" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Admin orders manager" ON public.orders FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Order Items Policies
CREATE POLICY "Order items select owned" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
);
CREATE POLICY "Order items insert authenticated" ON public.order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
);
CREATE POLICY "Admin order items manager" ON public.order_items FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Addresses Policies
CREATE POLICY "Addresses all owned" ON public.addresses FOR ALL TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid())) WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Wishlists Policies
CREATE POLICY "Wishlists all owned" ON public.wishlists FOR ALL TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid())) WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Wishlist Items Policies
CREATE POLICY "Wishlist items all owned" ON public.wishlist_items FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.wishlists 
    WHERE wishlists.id = wishlist_items.wishlist_id AND (wishlists.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.wishlists 
    WHERE wishlists.id = wishlist_items.wishlist_id AND (wishlists.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
);

-- Cart Items Policies
CREATE POLICY "Cart items all owned" ON public.cart_items FOR ALL TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid())) WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Reviews Policies
CREATE POLICY "Reviews read public" ON public.reviews FOR SELECT USING (status = 'approved' OR public.is_admin(auth.uid()));
CREATE POLICY "Reviews insert authenticated" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Admin reviews manager" ON public.reviews FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Newsletter Subscribers Policies
CREATE POLICY "Newsletter insert public" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin newsletter manager" ON public.newsletter_subscribers FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Contact Messages Policies
CREATE POLICY "Contact messages insert public" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin contact manager" ON public.contact_messages FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Site Settings Policies
CREATE POLICY "Site settings read public" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin settings manager" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Audit Logs Policies
CREATE POLICY "Admin audit viewer" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin audit insertion" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

-- ─── Storage Bucket Setup ────────────────────────────

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage Read Policy
CREATE POLICY "Public Read Access Product Images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Storage Admin Write Policy
CREATE POLICY "Admin Write Access Product Images" ON storage.objects FOR ALL TO authenticated USING (
  bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
) WITH CHECK (
  bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
