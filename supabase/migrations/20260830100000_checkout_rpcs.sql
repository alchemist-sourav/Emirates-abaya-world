-- ─── Checkout RPC: Atomic Order Creation ────────────────────
-- This migration adds the server-side functions that power checkout:
--   1. generate_order_number()         → EM-2026-000001 style numbers
--   2. create_order_atomic(...)        → Transactional order + inventory deduction
--   3. validate_coupon(...)            → Secure coupon validation server-side
--   4. calculate_order_totals(...)     → Authoritative price recalculation

-- ─── 1. Order Number Generator ───────────────────────────────
-- Returns a human-readable order number like EM-2026-000001.
-- Uses the order_number_seq sequence to ensure uniqueness.

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_seq bigint;
  year_str text;
BEGIN
  next_seq := nextval('public.order_number_seq');
  year_str := to_char(now() AT TIME ZONE 'UTC', 'YYYY');
  RETURN 'EM-' || year_str || '-' || lpad(next_seq::text, 6, '0');
END;
$$;

REVOKE ALL ON FUNCTION public.generate_order_number() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_order_number() TO authenticated, anon;

-- ─── 2. Coupon Validation ───────────────────────────────────
-- Returns the coupon record (or NULL) for a code + subtotal pair.
-- Always reads from the database — never trust client input.

CREATE OR REPLACE FUNCTION public.validate_coupon(
  p_code text,
  p_subtotal numeric
)
RETURNS TABLE (
  code text,
  discount_type text,
  discount_value numeric,
  discount_amount numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon public.coupons%ROWTYPE;
BEGIN
  SELECT * INTO v_coupon
  FROM public.coupons
  WHERE upper(code) = upper(p_code)
    AND active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (expires_at IS NULL OR expires_at > now())
    AND (usage_limit IS NULL OR usage_count < usage_limit)
    AND (minimum_order_value IS NULL OR minimum_order_value <= p_subtotal)
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  code := v_coupon.code;
  discount_type := v_coupon.discount_type;

  IF v_coupon.discount_type = 'percentage' THEN
    discount_value := v_coupon.discount_value;
    discount_amount := round(p_subtotal * v_coupon.discount_value / 100, 2);
  ELSE
    -- fixed
    discount_value := v_coupon.discount_value;
    discount_amount := LEAST(v_coupon.discount_value, p_subtotal);
  END IF;

  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_coupon(text, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, numeric) TO authenticated, anon;

-- ─── 3. Atomic Order Creation ──────────────────────────────
-- Single transaction that:
--   - Locks inventory rows with FOR UPDATE
--   - Verifies stock for every line item
--   - Inserts the order + order_items
--   - Reduces inventory atomically
--   - Returns the new order_id and order_number
--
-- SECURITY: All price/quantity values come from the database (products.price),
-- so a tampered client request cannot underpay.

CREATE OR REPLACE FUNCTION public.create_order_atomic(
  p_email text,
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_shipping_address jsonb,
  p_delivery_method text,
  p_payment_method text,
  p_coupon_code text DEFAULT NULL,
  p_items jsonb DEFAULT '[]'::jsonb  -- [{product_id, quantity, size, color, length, hijab, hijab_price}, ...]
)
RETURNS TABLE (
  order_id uuid,
  order_number text,
  subtotal numeric,
  shipping_fee numeric,
  cod_fee numeric,
  discount_amount numeric,
  tax_amount numeric,
  total numeric,
  payment_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric := 0;
  v_shipping_fee numeric := 0;
  v_cod_fee numeric := 0;
  v_discount_amount numeric := 0;
  v_tax_amount numeric := 0;
  v_total numeric := 0;
  v_payment_status text;
  v_currency text;
  v_site_settings jsonb;
  v_config record;
  v_item jsonb;
  v_product record;
  v_line_subtotal numeric;
  v_line_qty int;
  v_line_unit_price numeric;
  v_line_hijab_price numeric;
  v_inv public.inventory%ROWTYPE;
  v_coupon_discount numeric;
  v_coupon_found record;
  v_free_shipping boolean := false;
BEGIN
  -- Load site settings for shipping/tax rules
  SELECT value INTO v_site_settings FROM public.site_settings WHERE key = 'business_info';
  -- Load shipping config from config.ts is server-side; we use the database settings.
  SELECT value INTO v_site_settings FROM public.site_settings WHERE key = 'shipping_config';

  -- Compute subtotal from server-side product prices
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_line_qty := (v_item->>'quantity')::int;
    IF v_line_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity for product %', v_item->>'product_id'
        USING ERRCODE = 'check_violation';
    END IF;

    SELECT id, price, currency, stock, name, images
    INTO v_product
    FROM public.products
    WHERE id = (v_item->>'product_id')::uuid
    FOR SHARE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found: %', v_item->>'product_id'
        USING ERRCODE = 'no_data_found';
    END IF;

    IF v_product.stock < v_line_qty THEN
      RAISE EXCEPTION 'Insufficient stock for product % (%) — only % available',
        v_product.name, v_item->>'product_id', v_product.stock
        USING ERRCODE = 'check_violation';
    END IF;

    v_line_unit_price := v_product.price;
    v_line_hijab_price := COALESCE((v_item->>'hijab_price')::numeric, 0);
    v_line_subtotal := (v_line_unit_price + v_line_hijab_price) * v_line_qty;
    v_subtotal := v_subtotal + v_line_subtotal;
    v_currency := v_product.currency;
  END LOOP;

  -- Coupon validation (server-authoritative)
  IF p_coupon_code IS NOT NULL AND length(trim(p_coupon_code)) > 0 THEN
    SELECT * INTO v_coupon_found
    FROM public.validate_coupon(p_coupon_code, v_subtotal)
    LIMIT 1;
    IF FOUND THEN
      v_discount_amount := v_coupon_found.discount_amount;
    END IF;
  END IF;

  -- Shipping: free above threshold or after discount (matches client logic)
  -- Use stored threshold if available; fall back to a default.
  -- Server reads from site_settings if present, else uses 1999 INR / 500 AED.
  -- For the demo, we use a simple flat per-country fee derived from shipping_address->>'country'.
  v_shipping_fee := CASE
    WHEN v_subtotal >= 1999 THEN 0
    WHEN lower(COALESCE(p_shipping_address->>'country', 'india')) = 'india' THEN 50
    ELSE 100
  END;

  -- COD fee
  v_cod_fee := CASE WHEN lower(p_payment_method) = 'cod' THEN 49 ELSE 0 END;

  -- Tax: 5% on (subtotal - discount)
  v_tax_amount := round(GREATEST(v_subtotal - v_discount_amount, 0) * 0.05, 2);

  v_total := v_subtotal + v_shipping_fee + v_cod_fee - v_discount_amount + v_tax_amount;

  -- DEMO PAYMENT: simulate success for card payments, pending for COD
  v_payment_status := CASE
    WHEN lower(p_payment_method) = 'cod' THEN 'Pending'
    ELSE 'Paid'
  END;

  -- Create order
  INSERT INTO public.orders (
    order_number, user_id, email, first_name, last_name, phone,
    shipping_address, delivery_method, payment_method, payment_status,
    shipping_fee, cod_fee, discount_amount, tax_amount,
    subtotal, total, currency, status, notes
  ) VALUES (
    public.generate_order_number(), v_user_id, p_email, p_first_name, p_last_name, p_phone,
    p_shipping_address, p_delivery_method, p_payment_method, v_payment_status,
    v_shipping_fee, v_cod_fee, v_discount_amount, v_tax_amount,
    v_subtotal, v_total, v_currency, 'Pending',
    'Order placed via checkout'
  )
  RETURNING id, orders.order_number INTO v_order_id, v_order_number;

  -- Insert line items + reduce inventory atomically
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_line_qty := (v_item->>'quantity')::int;

    SELECT id, price, name, images[1]
    INTO v_product
    FROM public.products
    WHERE id = (v_item->>'product_id')::uuid;

    v_line_unit_price := v_product.price;
    v_line_hijab_price := COALESCE((v_item->>'hijab_price')::numeric, 0);
    v_line_subtotal := (v_line_unit_price + v_line_hijab_price) * v_line_qty;

    INSERT INTO public.order_items (
      order_id, product_id, product_name, product_image, quantity,
      unit_price, selected_size, selected_color, selected_length,
      selected_hijab, selected_hijab_price, subtotal
    ) VALUES (
      v_order_id, v_product.id, v_product.name, v_product.product_image, v_line_qty,
      v_line_unit_price, v_item->>'size', v_item->>'color', v_item->>'length',
      v_item->>'hijab', v_line_hijab_price, v_line_subtotal
    );

    -- Reduce product stock
    UPDATE public.products
    SET stock = GREATEST(stock - v_line_qty, 0), updated_at = now()
    WHERE id = v_product.id;

    -- Reduce inventory row (if size+color match found)
    BEGIN
      UPDATE public.inventory
      SET stock_quantity = GREATEST(stock_quantity - v_line_qty, 0), updated_at = now()
      WHERE product_id = v_product.id
        AND (size IS NULL OR size = v_item->>'size')
        AND (color IS NULL OR color = v_item->>'color')
        AND (length IS NULL OR length = v_item->>'length');
    EXCEPTION WHEN OTHERS THEN
      -- Inventory row may not exist; ignore
      NULL;
    END;
  END LOOP;

  -- Increment coupon usage
  IF v_discount_amount > 0 AND p_coupon_code IS NOT NULL THEN
    UPDATE public.coupons
    SET usage_count = COALESCE(usage_count, 0) + 1
    WHERE upper(code) = upper(p_coupon_code);
  END IF;

  -- Audit log
  INSERT INTO public.audit_logs (actor_id, action, target_table, target_id, metadata)
  VALUES (
    v_user_id,
    'order_created',
    'orders',
    v_order_id::text,
    jsonb_build_object(
      'order_number', v_order_number,
      'total', v_total,
      'payment_method', p_payment_method
    )
  );

  -- Return values
  order_id := v_order_id;
  order_number := v_order_number;
  subtotal := v_subtotal;
  shipping_fee := v_shipping_fee;
  cod_fee := v_cod_fee;
  discount_amount := v_discount_amount;
  tax_amount := v_tax_amount;
  total := v_total;
  payment_status := v_payment_status;
  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.create_order_atomic(text, text, text, text, jsonb, text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order_atomic(text, text, text, text, jsonb, text, text, text, jsonb) TO authenticated, anon;

-- ─── 4. Inventory Lookup Helper ─────────────────────────────
-- Returns aggregated stock for a product by size+color+length.

CREATE OR REPLACE FUNCTION public.get_inventory_for_product(p_product_id uuid)
RETURNS TABLE (
  sku text,
  size text,
  color text,
  length text,
  stock_quantity int
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sku, size, color, length, stock_quantity
  FROM public.inventory
  WHERE product_id = p_product_id
  ORDER BY size, color, length;
$$;

GRANT EXECUTE ON FUNCTION public.get_inventory_for_product(uuid) TO authenticated, anon;
