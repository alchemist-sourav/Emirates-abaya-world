'use client'

import React from 'react'
import Link from 'next/link'
import { X, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatPrice } from '@/lib/utils'
import { CartItemRow } from './CartItem'

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, getSubtotal, getItemCount } = useCartStore()
  const subtotal = getSubtotal()
  const count = getItemCount()
  const shipping = subtotal >= SITE_CONFIG.freeShippingAbove ? 0 : SITE_CONFIG.baseShippingFee
  const tax = Math.round(subtotal * SITE_CONFIG.taxRate)
  const total = subtotal + shipping + tax

  if (!isDrawerOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
              <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />
              Added to your cart
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
              <p className="text-base font-medium text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-gray-400 text-sm mb-6">Add some beautiful abayas to get started</p>
              <button
                onClick={closeDrawer}
                className="px-6 py-3 bg-[#111111] text-white font-medium text-sm hover:bg-[#C9A227] hover:text-[#111111] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="py-1">
              <p className="text-xs text-gray-500 mb-1">{count} {count === 1 ? 'item' : 'items'} in cart</p>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && shipping > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-[#F8F6F2]">
            <p className="text-[11px] text-[#6B7280] mb-1.5">
              Add <span className="font-semibold text-[#111111]">{formatPrice(SITE_CONFIG.freeShippingAbove - subtotal)}</span> more to get <span className="font-semibold text-green-600">FREE shipping</span>
            </p>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A227] rounded-full transition-all"
                style={{ width: `${Math.min(100, (subtotal / SITE_CONFIG.freeShippingAbove) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-white">
            <dl className="space-y-1.5 mb-4">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Shipping</dt>
                <dd className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Tax (included)</dt>
                <dd className="font-medium">{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <dt className="font-semibold text-[#111111]">Total</dt>
                <dd className="font-bold text-[#111111]">{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="block w-full text-center py-3.5 bg-[#111111] text-white font-semibold text-sm hover:bg-[#222222] transition-colors"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block w-full text-center py-3.5 border border-gray-200 text-[#111111] font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                View Cart
              </Link>
              <button
                onClick={closeDrawer}
                className="block w-full text-center py-2 text-xs text-gray-500 hover:text-[#111111] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
