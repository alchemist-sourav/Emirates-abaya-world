'use client'

import React, { useState } from 'react'
import { RotateCcw, RefreshCw, Wallet, Timer, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatPrice } from '@/lib/utils'

export type PolicyTab = 'privacy' | 'returns'

const PRIVACY_SECTIONS = [
  { title: 'Information We Collect', body: 'We collect information you provide when placing an order — name, mobile number, email and delivery address. Payment details are processed securely by our payment partners; we never store full card numbers.' },
  { title: 'How We Use Your Information', body: 'Your details are used to process orders, arrange delivery, send order updates and improve your shopping experience. We may send promotional messages only if you opt in.' },
  { title: 'Data Sharing', body: 'We share information only with service providers essential to fulfil your order — logistics partners and payment processors. We never sell your personal data.' },
  { title: 'Data Security', body: 'All transactions are encrypted. Access to your personal data is restricted to authorised staff who require it to serve you.' },
  { title: 'Your Rights', body: 'You may request a copy of the data we hold, or ask us to correct or delete it at any time, by contacting our team.' },
  { title: 'Cookies', body: 'Our store uses cookies to keep your cart and preferences while you browse. You can disable cookies in your browser, though some features may not work as intended.' },
]

const RETURNS_CARDS = [
  { icon: RefreshCw, title: 'Easy 7-Day Returns', desc: 'Changed your mind? Request a return within 7 days of delivery.' },
  { icon: Wallet, title: 'Quick Refunds', desc: 'Refunds are processed within 3–5 business days of the item reaching our atelier.' },
  { icon: RotateCcw, title: 'Free Size Exchange', desc: 'One free exchange per order for your first size swap.' },
]

const ELIGIBILITY = [
  { status: 'Eligible', text: 'Items in original condition with tags attached, unworn and unwashed.' },
  { status: 'Eligible', text: 'Wrong item or incorrect size delivered by us.' },
  { status: 'Eligible', text: 'Defective stitching, fabric or workmanship at the time of delivery.' },
  { status: 'Not eligible', text: 'Items that are worn, washed, altered or have tags removed.' },
  { status: 'Not eligible', text: 'Made-to-order or bespoke pieces (unless defective).' },
  { status: 'Not eligible', text: 'Orders where the return request is raised after 7 days of delivery.' },
]

const RETURN_STEPS = [
  { title: 'Raise a request', body: 'From My Account → My Orders, or message us on WhatsApp with your order number within 7 days of delivery.' },
  { title: 'Free pickup', body: 'Our courier collects the item from your address in the UAE. No reverse pickup charges for eligible returns.' },
  { title: 'Quality check', body: 'We inspect the item within 48 hours of receiving it at the atelier.' },
  { title: 'Refund or exchange', body: 'Once approved, refunds return to your original payment method in 3–5 business days. Exchanges ship within 24 hours.' },
]

export default function PolicyTabs({ defaultTab = 'privacy' }: { defaultTab?: PolicyTab }) {
  const [tab, setTab] = useState<PolicyTab>(defaultTab)
  const config = SITE_CONFIG

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-4 text-center">
          Our Policies
        </span>
        <h1 className="font-heading text-4xl font-bold text-[#111111] mb-4 text-center">
          {tab === 'privacy' ? 'Privacy Policy' : 'Returns & Exchanges'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-center">
          {tab === 'privacy'
            ? 'How we collect, use and protect your personal data at EMIRATES.'
            : 'We want you to love your abaya. If something is not right, here is exactly how returns and exchanges work.'}
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          <button
            type="button"
            onClick={() => setTab('privacy')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              tab === 'privacy' ? 'bg-[#111111] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C9A227]'
            }`}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setTab('returns')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              tab === 'returns' ? 'bg-[#111111] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C9A227]'
            }`}
          >
            Returns & Exchanges
          </button>
        </div>

        {tab === 'privacy' && (
          <div>
            <p className="text-gray-500 text-xs mb-8">
              Last updated: {new Date().toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="space-y-6 mb-8">
              {PRIVACY_SECTIONS.map(({ title, body }) => (
                <div key={title} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="font-semibold text-[#111111] mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#C9A227]" aria-hidden="true" />
                    {title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'returns' && (
          <div>
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {RETURNS_CARDS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-gray-200 rounded-xl p-6">
                  <Icon className="h-6 w-6 text-[#C9A227] mb-3" aria-hidden="true" />
                  <p className="font-semibold text-[#111111] mb-1">{title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-10">
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

            <h2 className="font-heading text-xl font-bold text-[#111111] mb-5">How it works</h2>
            <div className="space-y-5 mb-10">
              {RETURN_STEPS.map(({ title, body }, i) => (
                <div key={title} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#111111] text-[#C9A227] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1">
                    <p className="font-semibold text-[#111111] mb-1">{title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-5 mb-6">
              <AlertTriangle className="h-5 w-5 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-[#111111]">Cash on Delivery orders:</span> refunds
                for COD payments are transferred to your bank account within 5–7 business days.
              </p>
            </div>

            <a
              href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi! I would like to raise a return request for my order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#111111] underline hover:text-[#C9A227] transition-colors"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Start a return on WhatsApp
            </a>
          </div>
        )}

        <p className="text-center text-sm mt-10 text-gray-500">
          Questions about your privacy or an order? Email{' '}
          <a href={`mailto:${config.supportEmail}`} className="text-[#111111] underline">{config.supportEmail}</a>
          {tab === 'privacy' && <> · Free returns over {formatPrice(config.freeShippingAbove)}</>}
        </p>
      </div>
    </div>
  )
}