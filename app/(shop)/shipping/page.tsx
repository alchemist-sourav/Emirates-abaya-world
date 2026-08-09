'use client'

import React from 'react'
import { Truck, Zap, Package, MapPin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatINR } from '@/lib/utils'

const FEE_CARDS = [
  { icon: Truck, title: 'Free Shipping', desc: `On all orders above ${formatINR(SITE_CONFIG.freeShippingAbove)}. No minimums, no hidden charges.` },
  { icon: Zap, title: 'Fast Dispatch', desc: 'Orders are dispatched within 24–48 hours of confirmation.' },
  { icon: Package, title: 'Careful Packaging', desc: 'Every abaya is packed in a premium garment cover and outer box.' },
]

const METHODS = [
  { zone: 'Metro Cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata)', time: '3–5 business days', cost: formatINR(0) },
  { zone: 'Tier 2 Cities', time: '4–6 business days', cost: formatINR(SITE_CONFIG.baseShippingFee) },
  { zone: 'Rest of India', time: '5–7 business days', cost: formatINR(SITE_CONFIG.baseShippingFee) },
]

export default function ShippingPage() {
  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <h1 className="font-heading text-3xl font-bold text-[#111111] mb-3">Shipping Policy</h1>
        <p className="text-gray-600 mb-10 max-w-2xl">
          We deliver across India with trusted logistics partners. Here is everything you need to
          know about how and when you will receive your order.
        </p>

        {/* Highlight cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {FEE_CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-lg p-5">
              <Icon className="h-6 w-6 text-[#C9A227] mb-3" aria-hidden="true" />
              <p className="font-semibold text-[#111111] mb-1">{title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Delivery table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[#111111]">Delivery Charges & Timelines</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3">Delivery Zone</th>
                <th className="px-6 py-3">Estimated Time</th>
                <th className="px-6 py-3 text-right">Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {METHODS.map(({ zone, time, cost }) => (
                <tr key={zone}>
                  <td className="px-6 py-4 text-[#111111]">{zone}</td>
                  <td className="px-6 py-4 text-gray-600">{time}</td>
                  <td className="px-6 py-4 text-right font-medium text-[#111111]">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
            Shipping is calculated at checkout. Always enter the correct PIN code to see the
            accurate delivery date.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {[
            { title: 'How long does dispatch take?', body: 'Orders placed before 4 PM IST are dispatched the same day in most cases; otherwise within 24–48 hours. You will receive an email and SMS with tracking details once shipped.' },
            { title: 'Can I track my order?', body: 'Yes. Use the Track Order option in My Account, or open the link sent to your email and mobile number.' },
            { title: 'Do you ship on holidays?', body: 'Dispatch and delivery exclude public holidays and Sundays. Orders placed during festivals may take 1–2 days longer.' },
            { title: 'What if my PIN code is not serviceable?', body: 'Use the PIN code checker on the product page. If a PIN is not serviceable, we suggest trying the nearest pincode of a friend or family member, or contact us for help.' },
            { title: 'Do you deliver internationally?', body: 'Currently we deliver only within India. International shipping will be available soon.' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-[#111111] mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-5">
          <MapPin className="h-5 w-5 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-gray-600">
            For order related queries, reach us at{' '}
            <a href={`tel:${SITE_CONFIG.whatsappNumber}`} className="text-[#111111] underline">{SITE_CONFIG.whatsappNumber}</a>{' '}
            or email{' '}
            <a href="mailto:care@emiratesabayaworld.com" className="text-[#111111] underline">care@emiratesabayaworld.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
