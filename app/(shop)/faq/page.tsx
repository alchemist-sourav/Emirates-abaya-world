'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Search, Package, RotateCcw, CreditCard, Truck, Ruler, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatINR } from '@/lib/utils'

const FAQS = [
  {
    icon: Truck,
    q: 'How long does delivery take?',
    a: `Orders are dispatched within 24–48 hours and delivered in 4–7 business days across India. Metro cities are typically faster. Use the PIN code checker on any product page for a personalised estimate.`,
  },
  {
    icon: RotateCcw,
    q: 'What is your return policy?',
    a: 'We offer free 7-day returns on unworn items with tags intact, plus one free size exchange per order. Refunds are processed within 3–5 business days after pickup.',
  },
  {
    icon: CreditCard,
    q: 'Which payment methods do you accept?',
    a: `We accept UPI, Credit/Debit Cards, Net Banking, Wallets and Cash on Delivery. Card payments are securely processed and we never store your card details. COD is available on orders up to ${formatINR(5000)}.`,
  },
  {
    icon: Package,
    q: 'How do I track my order?',
    a: 'Go to My Account → Track Order and enter your order number and mobile number, or use the tracking link sent to your email and SMS once your order ships.',
  },
  {
    icon: Ruler,
    q: 'How do I choose my size and length?',
    a: 'Each product page lists sizes (XS–XXL) and lengths (52–60 inches). For a perfect fit, check the size chart on the product page, or message us your height on WhatsApp and we will recommend a length.',
  },
  {
    icon: Search,
    q: 'Do you take custom orders?',
    a: 'Yes! We make custom-length and made-to-order abayas. Contact us on WhatsApp with your measurements and we will share a quote within 24 hours.',
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-[#111111] mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-600">Quick answers to the questions we hear the most.</p>
        </div>

        <div className="space-y-3 mb-10">
          {FAQS.map(({ icon: Icon, q, a }, i) => {
            const isOpen = open === i
            return (
              <div key={q} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <Icon className="h-5 w-5 text-[#C9A227] flex-shrink-0" aria-hidden="true" />
                  <span className="flex-1 font-semibold text-[#111111] text-sm">{q}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 pl-13 text-sm text-gray-600 leading-relaxed">
                    {a}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="bg-[#111111] text-white rounded-lg p-6 text-center">
          <p className="font-heading text-lg font-bold mb-1">Still have questions?</p>
          <p className="text-sm text-gray-400 mb-4">We reply on WhatsApp within a few hours.</p>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi! I have a question about your abayas.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat on WhatsApp
          </a>
          <p className="text-xs text-gray-500 mt-4">
            Or email <a href="mailto:care@emiratesabayaworld.com" className="underline">care@emiratesabayaworld.com</a>
          </p>
        </div>

        <p className="text-center text-sm mt-8">
          <Link href="/shipping" className="text-[#111111] underline hover:text-[#C9A227] transition-colors">Shipping Policy</Link>
          {' · '}
          <Link href="/returns" className="text-[#111111] underline hover:text-[#C9A227] transition-colors">Returns & Exchanges</Link>
        </p>
      </div>
    </div>
  )
}
