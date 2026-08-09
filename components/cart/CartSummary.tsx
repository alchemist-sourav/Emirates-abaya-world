import React from 'react'
import Link from 'next/link'
import { Tag } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatINR } from '@/lib/utils'

interface CartSummaryProps {
  subtotal: number
  showCheckoutButton?: boolean
}

export function CartSummary({ subtotal, showCheckoutButton = true }: CartSummaryProps) {
  const shipping = subtotal >= SITE_CONFIG.freeShippingAbove ? 0 : SITE_CONFIG.baseShippingFee
  const tax = Math.round(subtotal * SITE_CONFIG.taxRate)
  const total = subtotal + shipping + tax
  const discount = 0

  return (
    <div className="bg-white border border-[#E5E5E5] p-6">
      <h2 className="text-lg font-semibold text-[#111111] mb-5">
        Price Details
      </h2>

      <dl className="space-y-3 mb-5">
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Price ({subtotal > 0 ? `${Math.max(1, Math.round(subtotal / 3449))} item` : '0 items'})</dt>
          <dd className="font-medium text-[#111111]">{formatINR(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Discount</dt>
          <dd className={discount > 0 ? 'text-green-600 font-medium' : 'font-medium text-[#111111]'}>
            {discount > 0 ? `− ${formatINR(discount)}` : formatINR(0)}
          </dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Delivery Charges</dt>
          <dd className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-[#111111]'}>
            {shipping === 0 ? 'FREE' : formatINR(shipping)}
          </dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Tax (incl.)</dt>
          <dd className="font-medium text-[#111111]">{formatINR(tax)}</dd>
        </div>
        <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
          <dt className="font-semibold text-[#111111]">Total Amount</dt>
          <dd className="text-xl font-bold text-[#111111]">{formatINR(total)}</dd>
        </div>
      </dl>

      {shipping > 0 && (
        <div className="text-xs text-gray-500 bg-[#F8F6F2] p-2.5 border border-gray-200 mb-5">
          Add <span className="font-semibold text-[#111111]">{formatINR(SITE_CONFIG.freeShippingAbove - subtotal)}</span> more to get <span className="font-semibold text-green-600">FREE delivery</span>!
        </div>
      )}

      {/* Coupon */}
      <div className="flex gap-2 mb-5">
        <label htmlFor="coupon-code" className="sr-only">Coupon code</label>
        <input
          id="coupon-code"
          type="text"
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#111111] bg-white"
        />
        <button className="px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#C9A227] hover:text-[#111111] transition-colors flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          Apply
        </button>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="block w-full text-center py-4 bg-[#111111] text-white font-semibold hover:bg-[#222222] transition-colors text-base"
        >
          Proceed to Checkout
        </Link>
      )}

      <p className="text-xs text-gray-500 text-center mt-3">
        You will save <span className="font-semibold text-green-600">{formatINR(shipping)}</span> on delivery today
      </p>
    </div>
  )
}
