'use client'

import React from 'react'
import { Truck, Zap, PackageCheck, MapPin, RotateCcw } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatPrice } from '@/lib/utils'

const FEE_CARDS = [
  { icon: Truck, title: 'Free Shipping', desc: `Free delivery across the UAE on orders above ${formatPrice(SITE_CONFIG.freeShippingAbove)}. No hidden charges.` },
  { icon: Zap, title: 'Fast Dispatch', desc: 'Orders are dispatched within 24 hours of confirmation, in premium gift packaging.' },
  { icon: PackageCheck, title: 'Careful Packaging', desc: 'Every abaya ships in a protective garment cover and an outer EMIRATES box.' },
]

export default function ShippingPage() {
  const config = SITE_CONFIG

  const zones = config.shippingZones.map((zone) => {
    const note =
      zone.freeAbove === 0
        ? 'Free delivery'
        : zone.freeAbove && zone.freeAbove > 0
          ? `Free above ${formatPrice(zone.freeAbove)}`
          : 'Calculated at checkout'
    return { zone: zone.name, time: zone.transit, cost: formatPrice(zone.fee), note }
  })

  const DELIVERY_STEPS = [
    { title: 'How long does dispatch take?', body: 'Orders placed before 4 PM GST are dispatched the same day in most cases; otherwise within 24 hours. You will receive email and SMS tracking once your order ships.' },
    { title: 'Can I track my order?', body: 'Yes. Open My Account → My Orders, or use the tracking link sent to your email and mobile number.' },
    { title: 'Do you deliver on Fridays and public holidays?', body: 'Dispatch and delivery exclude Fridays and UAE public holidays. Orders placed before a holiday may take 1–2 days longer.' },
    { title: 'Can I change my delivery address?', body: 'Message us on WhatsApp with your order number and the new address within 2 hours of ordering, and we will update it for you.' },
    { title: 'Do you deliver internationally?', body: 'Yes — we ship worldwide with tracked couriers. Duties and taxes are calculated at checkout where applicable.' },
  ]

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-4 text-center">
          Delivery
        </span>
        <h1 className="font-heading text-4xl font-bold text-[#111111] mb-4 text-center">Shipping Policy</h1>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-center">
          We deliver across the UAE, the GCC and internationally with trusted logistics partners.
          Here is everything you need to know about receiving your order.
        </p>

        {/* Highlight cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {FEE_CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-6">
              <Icon className="h-6 w-6 text-[#C9A227] mb-3" aria-hidden="true" />
              <p className="font-semibold text-[#111111] mb-1">{title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Delivery zones table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#C9A227]" aria-hidden="true" />
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
              {zones.map(({ zone, time, cost, note }) => (
                <tr key={zone}>
                  <td className="px-6 py-4">
                    <p className="text-[#111111]">{zone}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{note}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{time}</td>
                  <td className="px-6 py-4 text-right font-semibold text-[#111111]">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
            All charges are in {config.currency} and inclusive of VAT. Final shipping is confirmed at checkout.
          </p>
        </div>

        {/* Delivery attempts */}
        <div className="bg-[#111111] text-white rounded-2xl p-8 mb-12 flex items-start gap-4">
          <RotateCcw className="h-6 w-6 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <h2 className="font-heading text-lg font-bold mb-2">Delivery Attempts</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Our courier will make three delivery attempts at the address you provide. If all three
              attempts are missed, the order will be returned to our atelier and a redelivery fee may
              apply. Please ensure someone is available, or choose to collect from a nearby pickup point.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {DELIVERY_STEPS.map(({ title, body }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-[#111111] mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-6">
          <MapPin className="h-5 w-5 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-gray-600">
            For delivery queries, reach us at{' '}
            <a href={`tel:${config.whatsappNumber.replace(/[^\d+]/g, '')}`} className="text-[#111111] underline">{config.whatsappNumber}</a>{' '}
            or email{' '}
            <a href={`mailto:${config.supportEmail}`} className="text-[#111111] underline">{config.supportEmail}</a>.
          </p>
        </div>
      </div>
    </div>
  )
}