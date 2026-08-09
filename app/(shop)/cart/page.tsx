'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { CartItemRow } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { ProductGrid } from '@/components/products/ProductGrid'
import { getBestSellers, getProductsByOccasion } from '@/lib/services/products'
import type { Product } from '@/types/product'

export default function CartPage() {
  const { items, clearCart, getSubtotal, getItemCount } = useCartStore()
  const subtotal = getSubtotal()
  const count = getItemCount()

  const [recommendations, setRecommendations] = useState<Product[]>([])

  useEffect(() => {
    const productId = items[0]?.productId
    if (productId) {
      getProductsByOccasion('everyday', 4).then(setRecommendations)
    } else {
      getBestSellers(4).then(setRecommendations)
    }
  }, [items])

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#111111]">
            Shopping Cart
          </h1>
          {count > 0 && (
            <p className="text-gray-500 text-sm mt-1">{count} {count === 1 ? 'item' : 'items'} in your cart</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="bg-white p-12 sm:p-16 text-center border border-[#E5E5E5]">
            <ShoppingBag className="h-20 w-20 text-gray-200 mx-auto mb-6" aria-hidden="true" />
            <h2 className="font-heading text-2xl font-semibold text-[#111111] mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto">
              Discover our collection of premium abayas and hijabs delivered across India.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#111111] text-white font-semibold hover:bg-[#222222] transition-colors"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#E5E5E5]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-[#111111]">
                    Items ({count})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear cart
                  </button>
                </div>
                <div className="px-5">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Continue shopping */}
              <div className="mt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#111111] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Continue Shopping
                </Link>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-lg font-bold text-[#111111] mb-4">You may also like</h2>
                  <ProductGrid products={recommendations} columns={2} />
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-[150px]">
              <CartSummary subtotal={subtotal} />
              <div className="mt-4 bg-[#F8F6F2] border border-[#E5E5E5] p-4">
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  <span className="font-semibold text-[#111111]">Complete your look:</span> add a matching hijab to any abaya on the product page and pay together in one delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
