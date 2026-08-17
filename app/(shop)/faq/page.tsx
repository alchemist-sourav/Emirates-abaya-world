'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Search, Package, RotateCcw, Truck, Ruler, Shirt, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'

const TOPICS = ['All Questions', 'Orders & Sizing', 'Shipping UAE & Global', 'Atelier Returns', 'Fabric & Material Care']

const FAQS = [
  {
    topic: 'Shipping UAE & Global',
    icon: Truck,
    q: 'How long does delivery take?',
    a: 'Orders are dispatched within 24 hours and delivered across India in 3–5 business days, with metro cities often faster. You will receive tracking by email and SMS the moment your order ships.',
  },
  {
    topic: 'Shipping UAE & Global',
    icon: Package,
    q: 'How do I track my order?',
    a: 'Go to My Account → My Orders and open your latest order, or use the tracking link sent to your email and mobile number once your order ships.',
  },
  {
    topic: 'Shipping UAE & Global',
    icon: Truck,
    q: 'Do you deliver internationally?',
    a: 'Yes — we ship worldwide with tracked couriers. Duties and taxes are calculated at checkout where applicable. The shipping page lists current delivery fees and timelines for every zone.',
  },
  {
    topic: 'Atelier Returns',
    icon: RotateCcw,
    q: 'What is your return policy?',
    a: 'We offer 14-day returns on unworn items with tags intact, plus one free size exchange per order. Refunds are processed within 3–5 business days after the item reaches our atelier. See our Privacy & Returns page for full details.',
  },
  {
    topic: 'Orders & Sizing',
    icon: Ruler,
    q: 'How do I choose my size and length?',
    a: 'Each product page lists sizes (XS–2XL) and available lengths. For a perfect fit, check the size guide on the product page, or message us your height on WhatsApp and our stylists will recommend a length.',
  },
  {
    topic: 'Orders & Sizing',
    icon: Ruler,
    q: 'Do you offer custom lengths?',
    a: 'Yes. Every EMIRATES abaya is cut in-house, so we can adjust length for a modest fitting. Select “Custom Length” on the product page or tell us on WhatsApp and we will confirm the details.',
  },
  {
    topic: 'Orders & Sizing',
    icon: Shirt,
    q: 'Can I cancel or change my order?',
    a: 'Orders can be changed or cancelled within 2 hours of placing them, as long as the piece has not entered production. Message us on WhatsApp with your order number and we will do our best to help.',
  },
  {
    topic: 'Fabric & Material Care',
    icon: Shirt,
    q: 'How do I care for my abaya fabric?',
    a: 'Our crepes, georgettes and silks are best dry-cleaned. Store your abaya on a padded hanger in the protective garment cover it ships in, and avoid direct sun. Each piece includes a fabric care tag with full instructions.',
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)
  const [activeTopic, setActiveTopic] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.filter((f) => {
      const topicOk = activeTopic === 'All' || f.topic === activeTopic
      const queryOk = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      return topicOk && queryOk
    })
  }, [activeTopic, query])

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: FAQS.length }
    for (const f of FAQS) map[f.topic] = (map[f.topic] ?? 0) + 1
    return map
  }, [])

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-4">
            Customer Care
          </span>
          <h1 className="font-heading italic text-4xl lg:text-5xl font-semibold text-[#111111] mb-5">Frequently Asked Questions</h1>
          <span className="block w-16 h-px bg-[#C9A227] mx-auto mb-6" aria-hidden="true" />
          <p className="text-gray-600">Quick answers to the questions we hear most often.</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full rounded-full border border-gray-300 bg-white pl-12 pr-11 py-3.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111111]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Topic pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setActiveTopic(topic)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeTopic === topic
                  ? 'bg-[#111111] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C9A227]'
              }`}
            >
              {topic} <span className="opacity-60">({counts[topic] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Accordion */}
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-12">
            No answers match your search. Try a different keyword or contact us on WhatsApp.
          </p>
        ) : (
          <div className="space-y-3 mb-12">
            {filtered.map(({ icon: Icon, q, a, topic }) => {
              const key = FAQS.findIndex((f) => f.q === q)
              const isOpen = open === key
              return (
                <div key={q} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <Icon className="h-5 w-5 text-[#C9A227] flex-shrink-0" aria-hidden="true" />
                    <span className="flex-1 font-semibold text-[#111111] text-sm">{q}</span>
                    <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-gray-400">{topic}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{a}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="bg-[#111111] text-white rounded-2xl p-8 text-center">
          <p className="font-heading italic text-xl font-semibold mb-1">Still have questions?</p>
          <p className="text-sm text-gray-400 mb-6">Our customer care team replies within 24 hours.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C9A227] text-[#111111] text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-white transition-colors uppercase tracking-wider"
          >
            Contact Customer Care
          </Link>
          <p className="text-xs text-gray-500 mt-5">
            Or email <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="underline">{SITE_CONFIG.supportEmail}</a>
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