'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Tag } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatPrice } from '@/lib/utils'

interface CartSummaryProps {
  subtotal: number
  itemCount: number
  showCheckoutButton?: boolean
}

export function CartSummary({ subtotal, itemCount, showCheckoutButton = true }: CartSummaryProps) {
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(false)
  const [couponError, setCouponError] = useState('')

  const shipping = subtotal >= SITE_CONFIG.freeShippingAbove ? 0 : SITE_CONFIG.baseShippingFee
  const discount = applied ? 25 : 0
  const total = subtotal + shipping - discount

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    if (code === 'EMIRATES5') {
      setApplied(true)
      setCouponError('')
    } else if (code === '') {
      setCouponError('Please enter a code')
    } else {
      setApplied(false)
      setCouponError('Invalid code. Try EMIRATES5')
    }
  }

  return (
    <div className="bg-white border border-[#E5E5E5] p-6">
      <h2 className="text-lg font-semibold text-[#111111] mb-5">
        Price Details
      </h2>

      <dl className="space-y-3 mb-5">
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Price ({itemCount} {itemCount === 1 ? 'item' : 'items'})</dt>
          <dd className="font-medium text-[#111111]">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Discount</dt>
          <dd className={discount > 0 ? 'text-green-600 font-medium' : 'font-medium text-[#111111]'}>
            {discount > 0 ? `− ${formatPrice(discount)}` : formatPrice(0)}
          </dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Delivery Charges</dt>
          <dd className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-[#111111]'}>
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </dd>
        </div>
        <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
          <dt className="font-semibold text-[#111111]">Total Amount <span className="font-normal text-gray-400 text-[11px]">(VAT incl.)</span></dt>
          <dd className="text-xl font-bold text-[#111111]">{formatPrice(total)}</dd>
        </div>
      </dl>

      {shipping > 0 ? (
        <div className="text-xs text-gray-500 bg-[#F8F6F2] p-2.5 border border-gray-200 mb-5">
          Add <span className="font-semibold text-[#111111]">{formatPrice(SITE_CONFIG.freeShippingAbove - subtotal)}</span> more to get <span className="font-semibold text-green-600">FREE delivery</span>!
        </div>
      ) : (
        <div className="text-xs text-green-700 bg-green-50 p-2.5 border border-green-100 mb-5 flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          Congratulations! You qualify for FREE delivery.
        </div>
      )}

      {/* Coupon */}
      <div className="mb-5">
        <label htmlFor="coupon-code" className="sr-only">Coupon code</label>
        <div className="flex gap-2">
          <input
            id="coupon-code"
            type="text"
            value={coupon}
            onChange={(e) => { setCoupon(e.target.value); setCouponError('') }}
            placeholder={applied ? 'EMIRATES5 applied ✓' : 'Enter coupon code'}
            disabled={applied}
            className="flex-1 px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#111111] bg-white disabled:bg-gray-50"
          />
          <button
            onClick={applyCoupon}
            className="px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#C9A227] hover:text-[#111111] transition-colors flex items-center gap-1.5"
          >
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            Apply
          </button>
        </div>
        {couponError && <p className="text-xs text-red-500 mt-1.5" role="alert">{couponError}</p>}
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="block w-full text-center py-4 bg-[#111111] text-white font-semibold rounded-full hover:bg-[#222222] transition-colors text-base uppercase tracking-wider"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  )
}