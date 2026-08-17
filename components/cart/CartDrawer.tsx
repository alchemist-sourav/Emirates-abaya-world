'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, ArrowRight, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatPrice } from '@/lib/utils'
import { CartItemRow } from './CartItem'
import { getBestSellers } from '@/lib/services/products'
import type { Product } from '@/types/product'

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, getSubtotal, getItemCount } = useCartStore()
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [visible, setVisible] = useState(false)

  const subtotal = getSubtotal()
  const count = getItemCount()
  const remaining = Math.max(0, SITE_CONFIG.freeShippingAbove - subtotal)
  const shipping = subtotal >= SITE_CONFIG.freeShippingAbove ? 0 : SITE_CONFIG.baseShippingFee
  const total = subtotal + shipping
  const progress = Math.min(100, (subtotal / SITE_CONFIG.freeShippingAbove) * 100)

  // Slide animation
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => setVisible(true))
      return () => { document.body.style.overflow = '' }
    }
    const t = setTimeout(() => { document.body.style.overflow = '' }, 350)
    return () => clearTimeout(t)
  }, [isDrawerOpen])

  // Load recommendations
  useEffect(() => {
    getBestSellers(4).then(setRecommendations)
  }, [])

  // Keep body lock in sync with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) closeDrawer()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen, closeDrawer])

  if (!isDrawerOpen && !visible) return null

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label={`Shopping cart, ${count} items`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white flex flex-col shadow-2xl transition-transform duration-[350ms] ease-[cubic-bezier(0.32,0,0.15,1)]"
        style={{ transform: visible ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-[#111111]">
            Your Cart {count > 0 && <span className="text-[#6B7280] font-normal">({count})</span>}
          </h2>
          <button
            onClick={closeDrawer}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Free shipping progress ── */}
        {count > 0 && (
          <div className="px-5 py-3 bg-[#FAF7F2] border-b border-[#F0EEEC]">
            {remaining > 0 ? (
              <p className="text-[11px] text-[#6B7280] mb-1.5 flex items-center gap-1">
                <Truck className="h-3 w-3 text-[#C9A227] flex-shrink-0" aria-hidden="true" />
                Add <span className="font-semibold text-[#111111] mx-0.5">{formatPrice(remaining)}</span> more for <span className="font-semibold text-green-600 ml-0.5">FREE shipping</span>
              </p>
            ) : (
              <p className="text-[11px] text-green-600 mb-1.5 flex items-center gap-1 font-semibold">
                <Truck className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                You qualify for FREE shipping!
              </p>
            )}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A227] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        {/* ── Items / Empty state ── */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
              <p className="text-base font-medium text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-gray-400 text-sm mb-6">Discover handcrafted abayas from our Kerala atelier</p>
              <button
                onClick={closeDrawer}
                className="px-6 py-3 bg-[#111111] text-white font-medium text-sm rounded-full hover:bg-[#C9A227] hover:text-[#111111] transition-colors"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="py-2 divide-y divide-gray-50">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} compact />
              ))}
            </div>
          )}

          {/* You May Also Like */}
          {items.length > 0 && recommendations.length > 0 && (
            <div className="pb-6 pt-2 border-t border-gray-50 mt-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-3">You May Also Like</p>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {recommendations.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={closeDrawer}
                    className="flex-shrink-0 w-28 group"
                  >
                    <div className="relative aspect-[3/4] bg-[#F7F4F1] overflow-hidden mb-1.5 rounded-sm">
                      <Image
                        src={product.images[0] ?? ''}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="112px"
                        unoptimized
                      />
                    </div>
                    <p className="text-[11px] text-[#111111] line-clamp-2 leading-tight font-medium">{product.name}</p>
                    <p className="text-[11px] text-[#C9A227] font-semibold mt-0.5">{formatPrice(product.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer / Checkout ── */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-white">
            <dl className="space-y-1.5 mb-4">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-medium text-[#111111]">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Shipping</dt>
                <dd className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-[#111111]'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <dt className="font-semibold text-[#111111]">Total <span className="font-normal text-gray-400 text-[11px]">(VAT incl.)</span></dt>
                <dd className="font-bold text-[#111111] text-base">{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="flex items-center justify-center gap-2 w-full text-center py-3.5 bg-[#111111] text-white font-semibold text-sm rounded-full hover:bg-[#1A1A1A] transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block w-full text-center py-3 border border-gray-200 text-[#111111] font-semibold text-sm rounded-full hover:bg-gray-50 transition-colors"
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
