'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Package, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatPrice } from '@/lib/utils'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') ?? ''
  const config = SITE_CONFIG
  const isIndia = config.currency === 'INR'
  const brand = config.businessName
  const deliveryEstimate = isIndia ? '4–7 business days' : '1–3 business days (UAE)'
  const dispatchWindow = isIndia ? '24–48 hours' : '24 hours'
  const whatsappLink = `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hi ${brand}! I just placed an order (${orderNumber}) and wanted to confirm the details.`
  )}`

  return (
    <div className="bg-[#F8F6F2]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-[#111111] mb-3">
          Thank you for your order!
        </h1>
        <p className="text-gray-600 mb-2">
          Your order has been placed successfully.
        </p>
        {orderNumber && (
          <p className="text-sm text-gray-500 mb-8">
            Order Number:{' '}
            <span className="font-semibold text-[#111111] tracking-wide">#{orderNumber}</span>
          </p>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-left">
          <div className="flex items-start gap-3 mb-4">
            <Package className="h-5 w-5 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-[#111111]">What happens next?</h2>
              <p className="text-sm text-gray-600 mt-1">
                A confirmation email has been sent to your email address. Your order will be shipped
                within {dispatchWindow} and you can track it anytime from your account.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
            {config.claims.codAvailable && (
              <p className="flex items-center justify-between">
                <span>Payment</span>
                <span className="font-medium text-[#111111]">As selected at checkout</span>
              </p>
            )}
            <p className="flex items-center justify-between">
              <span>Estimated delivery</span>
              <span className="font-medium text-[#111111]">{deliveryEstimate}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Free shipping over</span>
              <span className="font-medium text-[#111111]">{formatPrice(config.freeShippingAbove)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/shop" className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Continue Shopping
          </Link>
          <Link href="/account/orders" className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2">
            Track Your Order
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 mt-4 text-sm text-[#111111] hover:text-[#C9A227] transition-colors"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Need help? Chat with us on WhatsApp
        </a>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F6F2]" />}>
      <OrderSuccessContent />
    </Suspense>
  )
}
