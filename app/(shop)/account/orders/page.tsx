'use client'

import React from 'react'
import Link from 'next/link'
import { PackageSearch, Package, Truck, CheckCircle2, HelpCircle } from 'lucide-react'

const TRACK_STEPS = [
  { icon: Package, label: 'Order Confirmed', desc: 'We received your order and payment details.' },
  { icon: Truck, label: 'Shipped', desc: 'Your order has left our warehouse.' },
  { icon: CheckCircle2, label: 'Delivered', desc: 'Handed over at your doorstep.' },
]

const STATUS_NOTES = [
  { icon: HelpCircle, title: 'Where is my tracking number?', body: 'Tracking details appear in this page and on your email once your order is shipped (usually within 24–48 hours of placing it).' },
  { icon: Truck, title: 'How long does delivery take?', body: 'Most orders are delivered within 4–7 business days across India. Metro cities are typically faster.' },
  { icon: CheckCircle2, title: 'My order is stuck?', body: 'If your order has not moved for 3+ days, chat with us on WhatsApp and we will resolve it within 24 hours.' },
]

export default function OrdersPage() {
  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex items-center gap-3 mb-2">
          <PackageSearch className="h-6 w-6 text-[#C9A227]" aria-hidden="true" />
          <h1 className="font-heading text-2xl font-bold text-[#111111]">Track Your Order</h1>
        </div>
        <p className="text-gray-600 text-sm mb-8">
          Enter your order number and 10-digit mobile number used at checkout.
        </p>

        {/* Track form */}
        <form
          className="bg-white border border-gray-200 rounded-lg p-6 mb-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-[#111111] mb-1.5">
                Order Number
              </label>
              <input
                id="orderId"
                type="text"
                placeholder="e.g. EAW123456"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-[#111111] mb-1.5">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">Track Order</button>
          <p className="text-xs text-gray-500 mt-4">
            Tip: You can find your order number in the confirmation email we sent after checkout.
          </p>
        </form>

        {/* Steps explanation */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-[#111111] mb-5">How tracking works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TRACK_STEPS.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#F8F6F2] flex items-center justify-center mb-3">
                  <Icon className="h-6 w-6 text-[#C9A227]" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-[#111111]">
                  <span className="text-[#C9A227] mr-1">{i + 1}.</span>{label}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ mini */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold text-[#111111] mb-5">Order help</h2>
          <div className="space-y-5">
            {STATUS_NOTES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#111111]">{title}</p>
                  <p className="text-sm text-gray-600 mt-1">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/contact" className="text-sm text-[#111111] underline hover:text-[#C9A227] transition-colors">
            Still need help? Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}
