'use client'

import React from 'react'
import Link from 'next/link'
import { PackageSearch, Package, Truck, CheckCircle2, HelpCircle } from 'lucide-react'
import { getSiteConfig } from '@/lib/services/products'
import { formatPrice } from '@/lib/utils'

const TRACK_STEPS = [
  { icon: Package, label: 'Order Confirmed', desc: 'We received your order and payment details.' },
  { icon: Truck, label: 'Shipped', desc: 'Your order has left our atelier.' },
  { icon: CheckCircle2, label: 'Delivered', desc: 'Handed over at your doorstep.' },
]

const RECENT_ORDERS = [
  { id: 'EM-10482', date: 'Aug 08, 2026', items: 2, total: 1180, status: 'Delivered' },
  { id: 'EM-10449', date: 'Jul 21, 2026', items: 1, total: 450, status: 'Delivered' },
  { id: 'EM-10396', date: 'Jul 03, 2026', items: 3, total: 1740, status: 'In Transit' },
]

const STATUS_STYLES: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  'In Transit': 'bg-blue-50 text-blue-700',
  Processing: 'bg-amber-50 text-amber-700',
}

export default function OrdersPage() {
  const config = getSiteConfig()
  const isIndia = config.currency === 'INR'

  const STATUS_NOTES = [
    { icon: HelpCircle, title: 'Where is my tracking number?', body: 'Tracking details appear on this page and in your email once your order is shipped (usually within 24 hours of placing it).' },
    { icon: Truck, title: 'How long does delivery take?', body: isIndia ? 'Most orders are delivered within 4–7 business days across India. Metro cities are typically faster.' : 'Orders reach UAE addresses in 1–3 business days, the GCC in 3–7 days and internationally in 7–15 days.' },
    { icon: CheckCircle2, title: 'My order is stuck?', body: 'If your order has not moved for 3+ days, chat with us on WhatsApp and we will resolve it within 24 hours.' },
  ]

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex items-center gap-3 mb-2">
          <PackageSearch className="h-6 w-6 text-[#C9A227]" aria-hidden="true" />
          <h1 className="font-heading text-2xl font-bold text-[#111111]">Track Your Order</h1>
        </div>
        <p className="text-gray-600 text-sm mb-8">
          Enter your order number and the mobile number used at checkout.
        </p>

        {/* Track form */}
        <form
          className="bg-white border border-gray-200 rounded-2xl p-6 mb-8"
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
                placeholder="e.g. EM-10482"
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
                maxLength={isIndia ? 10 : 20}
                placeholder={isIndia ? '10-digit mobile' : 'e.g. 050 123 4567'}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
              />
            </div>
          </div>
          <button type="submit" className="bg-[#111111] text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#C9A227] hover:text-[#111111] transition-colors">
            Track Order
          </button>
          <p className="text-xs text-gray-500 mt-4">
            Tip: You can find your order number in the confirmation email we sent after checkout.
          </p>
        </form>

        {/* Recent orders */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-[#111111]">Recent Orders</h2>
            <Link href="/account" className="text-xs font-semibold text-[#111111] underline hover:text-[#C9A227] transition-colors">
              Back to My Account
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-center">Items</th>
                  <th className="px-6 py-3 text-right">Total</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#111111]">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{order.items}</td>
                    <td className="px-6 py-4 text-right font-semibold text-[#111111]">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Steps explanation */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
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
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
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