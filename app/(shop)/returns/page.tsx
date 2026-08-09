'use client'

import React from 'react'
import { RotateCcw, RefreshCw, IndianRupee, Timer, MessageCircle, AlertTriangle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'

const RETURNS_CARDS = [
  { icon: RefreshCw, title: 'Easy 7-Day Returns', desc: 'Changed your mind? Request a return within 7 days of delivery.' },
  { icon: IndianRupee, title: 'Quick Refunds', desc: 'Refunds are processed within 3–5 business days of pickup.' },
  { icon: RotateCcw, title: 'Free Size Exchange', desc: 'One free exchange per order for the first size swap.' },
]

const ELIGIBILITY = [
  { status: 'Eligible', text: 'Items in original condition with tags attached, unworn and unwashed.' },
  { status: 'Eligible', text: 'Wrong item or incorrect size delivered by us.' },
  { status: 'Eligible', text: 'Defective stitching, fabric or workmanship at the time of delivery.' },
  { status: 'Not eligible', text: 'Items that are worn, washed, altered or have tags removed.' },
  { status: 'Not eligible', text: 'Made-to-order or customised abayas (unless defective).' },
  { status: 'Not eligible', text: 'Orders where return request is raised after 7 days of delivery.' },
]

const STEPS = [
  { title: 'Raise a request', body: 'From My Account → My Orders, or message us on WhatsApp with your order number within 7 days of delivery.' },
  { title: 'Free pickup', body: 'Our courier partner collects the item from your address. No reverse pickup charges for eligible returns.' },
  { title: 'Quality check', body: 'We inspect the item within 48 hours of receiving it at our warehouse.' },
  { title: 'Refund or exchange', body: 'Once approved, refunds hit your original payment method in 3–5 business days. Exchanges are shipped within 24 hours.' },
]

export default function ReturnsPage() {
  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <h1 className="font-heading text-3xl font-bold text-[#111111] mb-3">Returns & Exchanges</h1>
        <p className="text-gray-600 mb-10 max-w-2xl">
          We want you to love your abaya. If something is not right, here is exactly how returns
          and exchanges work.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {RETURNS_CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-lg p-5">
              <Icon className="h-6 w-6 text-[#C9A227] mb-3" aria-hidden="true" />
              <p className="font-semibold text-[#111111] mb-1">{title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Eligibility */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Timer className="h-5 w-5 text-[#C9A227]" aria-hidden="true" />
            <h2 className="font-semibold text-[#111111]">Return Eligibility</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {ELIGIBILITY.map(({ status, text }) => (
              <li key={text} className="px-6 py-4 flex items-start gap-3">
                <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full flex-shrink-0 ${status === 'Eligible' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {status}
                </span>
                <span className="text-sm text-gray-700">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Process */}
        <h2 className="font-heading text-xl font-bold text-[#111111] mb-5">How it works</h2>
        <div className="space-y-5 mb-10">
          {STEPS.map(({ title, body }, i) => (
            <div key={title} className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-[#111111] text-[#C9A227] flex items-center justify-center font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5 flex-1">
                <p className="font-semibold text-[#111111] mb-1">{title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* COD note */}
        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <AlertTriangle className="h-5 w-5 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-[#111111]">COD orders:</span> refunds for Cash on
            Delivery payments are sent to your UPI ID or bank account within 5–7 business days.
          </p>
        </div>

        <a
          href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi! I would like to raise a return request for my order.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#111111] underline hover:text-[#C9A227] transition-colors"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Start a return on WhatsApp
        </a>
      </div>
    </div>
  )
}
