'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, HandHeart, Award, ShieldCheck, Store, MapPin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'

const VALUES = [
  { icon: Sparkles, title: 'Premium Craftsmanship', desc: 'Every abaya is crafted from premium crepe, nida and georgette fabrics with careful stitching and finishing.' },
  { icon: HandHeart, title: 'Made with Care', desc: 'Our artisans hand-finish each piece, combining tradition with modern, modest fashion.' },
  { icon: Award, title: 'Quality Checked', desc: 'Every piece passes a 12-point quality check before it is packed and shipped to you.' },
  { icon: ShieldCheck, title: 'Shop with Confidence', desc: 'Secure payments, easy 7-day returns and a support team that actually replies.' },
]

const MILESTONES = [
  { stat: '12+', label: 'Years of Craft' },
  { stat: '10K+', label: 'Happy Customers' },
  { stat: '500+', label: 'Designs' },
  { stat: '27+', label: 'States Delivered' },
]

export default function AboutPage() {
  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[#111111] mb-4">About Emirates Abaya World</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We bring the elegance of Gulf modest fashion to India. From everyday essentials to
            statement luxury abayas, our collections are designed for the modern woman who values
            grace, comfort and quality.
          </p>
        </div>

        {/* Story */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 mb-10">
          <h2 className="font-heading text-xl font-bold text-[#111111] mb-4">Our Story</h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              Emirates Abaya World began with a simple observation — modest fashion deserves the
              same premium craftsmanship as any luxury label. We started by sourcing the finest
              crepe and nida fabrics and collaborating with skilled artisans who understand the
              details that matter: drape, fall, finishing and fit.
            </p>
            <p>
              Today we serve customers across every corner of India with a thoughtfully curated
              range of abayas, hijabs and matching accessories. Each design is inspired by the
              timeless elegance of the Gulf, refined for the tastes of Indian women.
            </p>
            <p>
              Behind every order is a small, dedicated team committed to one promise — a premium
              product at an honest price, delivered with care.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-lg p-6">
              <Icon className="h-6 w-6 text-[#C9A227] mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-[#111111] mb-1">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="bg-[#111111] text-white rounded-lg p-8 mb-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {MILESTONES.map(({ stat, label }) => (
            <div key={label}>
              <p className="font-heading text-2xl font-bold text-[#C9A227]">{stat}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Boutique */}
        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-6 mb-10">
          <Store className="h-5 w-5 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="text-sm text-gray-600">
            <p className="font-semibold text-[#111111] mb-1">Visit our boutique</p>
            <p>2nd Floor, Fashion Plaza, Linking Road, Mumbai, Maharashtra 400052, India</p>
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Mon–Sat: 10:00 AM – 7:00 PM IST · {SITE_CONFIG.whatsappNumber}
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Explore our collection</p>
          <Link href="/shop" className="btn-primary">Shop Abayas & Hijabs</Link>
        </div>
      </div>
    </div>
  )
}
