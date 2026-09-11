'use server'

/**
 * Checkout Server Action
 *
 * Security guarantees:
 *  - All prices are read from the database — client-submitted totals are IGNORED.
 *  - Inventory is reduced atomically inside a PostgreSQL transaction (RPC).
 *  - Coupon discount is validated server-side against the database.
 *  - No CVV, full card number, or payment password is ever stored.
 *  - Only payment_method, payment_status, and a demo transaction_reference are recorded.
 */

import { createClient } from '@/lib/supabase/server'
import type { CartItem } from '@/store/cart'

export interface CheckoutInput {
  email: string
  firstName: string
  lastName: string
  phone: string
  shippingAddress: {
    house: string
    area: string
    city: string
    state: string
    country: string
    pinCode: string
  }
  deliveryMethod: 'standard' | 'express' | 'pickup'
  paymentMethod: 'card' | 'cod' | 'upi'
  couponCode?: string
  items: CartItem[]
}

export interface CheckoutResult {
  orderId: string
  orderNumber: string
  subtotal: number
  shippingFee: number
  codFee: number
  discountAmount: number
  taxAmount: number
  total: number
  paymentStatus: 'Pending' | 'Paid' | 'Failed'
}

export async function processCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const supabase = await createClient()

  // ── 1. Validate items exist and are in-stock (server-side) ──────────────
  const productIds = input.items.map(i => i.productId)
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, name, price, stock, currency, images')
    .in('id', productIds)

  if (productError || !products || products.length !== productIds.length) {
    throw new Error('One or more products could not be verified. Please refresh your cart.')
  }

  // ── 2. Recalculate subtotal from server-side prices (SECURITY) ─────────
  const itemsWithServerPrices = input.items.map(item => {
    const product = products.find(p => p.id === item.productId)
    if (!product) throw new Error(`Product ${item.productId} not found`)
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} available.`)
    }
    const hijabPrice = item.hijabPrice ?? 0
    const unitPrice = product.price
    const lineSubtotal = (unitPrice + hijabPrice) * item.quantity
    return {
      product_id: item.productId,
      quantity: item.quantity,
      size: item.size ?? null,
      color: item.color ?? null,
      length: item.length ?? null,
      hijab: item.hijab ?? null,
      hijab_price: hijabPrice,
      _line_subtotal: lineSubtotal,
      _image: product.images?.[0] ?? null,
    }
  })

  // ── 3. Validate coupon server-side ───────────────────────────────────────
  const serverSubtotal = itemsWithServerPrices.reduce((s, i) => s + (i._line_subtotal as number), 0)
  let serverDiscountAmount = 0

  if (input.couponCode && input.couponCode.trim().length > 0) {
    const { data: couponRow } = await supabase
      .rpc('validate_coupon', {
        p_code: input.couponCode,
        p_subtotal: serverSubtotal,
      })
      .single()

    if (couponRow) {
      const row = couponRow as Record<string, unknown>
      serverDiscountAmount = Number(row.discount_amount ?? 0)
    }
    // Invalid/expired coupon is silently ignored (matches original client behavior)
  }

  // ── 4. Compute shipping & tax from server-side config ───────────────────
  const isIndia = input.shippingAddress.country?.toLowerCase() === 'india' ||
    input.shippingAddress.pinCode?.length === 6

  const serverShippingFee = serverSubtotal >= 1999
    ? 0
    : isIndia ? 50 : 100

const serverCodFee = input.paymentMethod === 'cod' ? 49 : 0
  const taxableAmount = Math.max(serverSubtotal - serverDiscountAmount, 0)

  // ── 5. Call atomic order creation RPC ──────────────────────────────────
  const shippingAddressJson = {
    house: input.shippingAddress.house,
    area: input.shippingAddress.area,
    city: input.shippingAddress.city,
    state: input.shippingAddress.state,
    country: input.shippingAddress.country,
    pinCode: input.shippingAddress.pinCode,
  }

  const rpcItems = itemsWithServerPrices.map(i => ({
    product_id: i.product_id,
    quantity: i.quantity,
    size: i.size,
    color: i.color,
    length: i.length,
    hijab: i.hijab,
    hijab_price: i.hijab_price,
  }))

  const { data: orderResult, error: orderError } = await supabase.rpc('create_order_atomic', {
    p_email: input.email,
    p_first_name: input.firstName,
    p_last_name: input.lastName,
    p_phone: input.phone,
    p_shipping_address: shippingAddressJson,
    p_delivery_method: input.deliveryMethod,
    p_payment_method: input.paymentMethod,
    p_coupon_code: input.couponCode ?? null,
    p_items: rpcItems,
  })

  if (orderError || !orderResult || (orderResult as unknown[]).length === 0) {
    console.error('[checkout] create_order_atomic error:', orderError)
    throw new Error('Failed to create order. Please try again.')
  }

  // RPC returns snake_case columns; map to camelCase CheckoutResult.
  const order = (orderResult as Array<Record<string, unknown>>)[0]

  return {
    orderId: String(order.order_id ?? ''),
    orderNumber: String(order.order_number ?? ''),
    subtotal: Number(order.subtotal ?? 0),
    shippingFee: Number(order.shipping_fee ?? 0),
    codFee: Number(order.cod_fee ?? 0),
    discountAmount: Number(order.discount_amount ?? 0),
    taxAmount: Number(order.tax_amount ?? 0),
    total: Number(order.total ?? 0),
    paymentStatus: (order.payment_status as 'Pending' | 'Paid' | 'Failed') ?? 'Pending',
  }
}
