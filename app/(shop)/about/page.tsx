'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Scissors, HeartHandshake, BadgeCheck, MapPin, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'

const PRINCIPLES = [
  { icon: Sparkles, title: 'Premium Fabrics', desc: 'Mulberry silk, fluid crepe and georgette — sourced only from mills we trust.' },
  { icon: Scissors, title: 'Timeless Silhouettes', desc: 'Cut to flatter every woman, designed to outlast every trend.' },
  { icon: HeartHandshake, title: 'Flawless Craftsmanship', desc: 'Every seam is hand-finished and checked twice before it leaves the atelier.' },
  { icon: BadgeCheck, title: 'Client-First', desc: 'Personal styling, honest sizing advice and support that actually replies.' },
]

const MILESTONES = [
  { stat: '2018', label: 'Founded in Dubai' },
  { stat: '10K+', label: 'Women Wearing EMIRATES' },
  { stat: '120+', label: 'Signature Designs' },
  { stat: '30+', label: 'Countries Served' },
]

const TEAM = [
  {
    name: 'Layan Al Rashid',
    role: 'Creative Director',
    bio: 'Founder and the creative soul of the maison. Layan leads every collection, from the first sketch to the final fitting.',
  },
  {
    name: 'Tariq Al Mansouri',
    role: 'Master Cutter',
    bio: 'Two decades of pattern-making in the Gulf. Tariq translates vision into silhouette, obsessed with drape and fall.',
  },
  {
    name: 'Fatima Al Hashimi',
    role: 'Head of Styling & Client Relations',
    bio: 'Your first point of contact. Fatima advises brides and clients on silhouettes, lengths and occasion dressing.',
  },
]

export default function AboutPage() {
  const config = SITE_CONFIG

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Hero */}
        <div className="text-center mb-14 lg:mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-4">
            Since 2018
          </span>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-[#111111] mb-5 leading-tight">
            The EMIRATES<span className="text-[#C9A227]">*</span> Story
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Handcrafted modest fashion, made in Dubai for the modern woman. From a small atelier in
            Al Quoz to wardrobes in more than thirty countries — this is how we got here.
          </p>
        </div>

        {/* Journey */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-12 lg:mb-16">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[280px] lg:min-h-full">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80"
                alt="Inside the EMIRATES atelier in Dubai"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 lg:p-12">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-3">
                Our Journey
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#111111] mb-5">From one sewing table to thirty countries</h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  EMIRATES was founded in Dubai in 2018 with a single belief — modest fashion
                  deserves the same craftsmanship as any luxury maison. We began by cutting abayas
                  on a single table, obsessing over drape, fall and finish until each piece felt
                  right.
                </p>
                <p>
                  Today our atelier sits at Alserkal Avenue, one of the region&rsquo;s most
                  celebrated creative districts. A small, devoted team of cutters, embroiderers and
                  stylists still works the way we always have: slowly, deliberately, by hand.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Founding vision */}
        <div className="bg-[#111111] text-white rounded-2xl p-8 lg:p-14 mb-12 lg:mb-16 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-4">
            Founding Vision
          </span>
          <blockquote className="font-heading italic text-2xl lg:text-3xl text-white/90 leading-snug max-w-2xl mx-auto">
            &ldquo;An abaya is not a garment. It is a statement of grace, made for the woman who
            knows exactly who she is.&rdquo;
          </blockquote>
          <p className="text-sm text-gray-400 mt-6">— Layan Al Rashid, Founder & Creative Director</p>
        </div>

        {/* Bespoke principles */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-3">
              The EMIRATES Promise
            </span>
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#111111]">Bespoke Principles</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRINCIPLES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#C9A227] transition-colors">
                <Icon className="h-6 w-6 text-[#C9A227] mb-3" aria-hidden="true" />
                <h3 className="font-semibold text-[#111111] mb-1.5">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-12 lg:mb-16">
          {MILESTONES.map(({ stat, label }) => (
            <div key={label}>
              <p className="font-heading text-2xl font-bold text-[#C9A227]">{stat}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-3">
              The Atelier
            </span>
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#111111]">The hands behind the maison</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {TEAM.map(({ name, role, bio }) => (
              <div key={name} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="h-14 w-14 rounded-full bg-[#111111] text-[#C9A227] font-heading text-lg font-bold flex items-center justify-center mx-auto mb-4">
                  {name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <h3 className="font-semibold text-[#111111]">{name}</h3>
                <p className="text-xs text-[#C9A227] font-medium uppercase tracking-wider mt-0.5 mb-3">{role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Showroom */}
        <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 mb-12">
          <MapPin className="h-6 w-6 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="text-sm text-gray-600">
            <p className="font-semibold text-[#111111] mb-1">Visit the flagship atelier</p>
            <p>{config.showroom}</p>
            <p className="mt-2 text-xs text-gray-500">
              Mon–Sat: 10:00 AM – 7:00 PM GST · {config.whatsappNumber}
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-5">Explore the collection behind the story</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#C9A227] hover:text-[#111111] transition-colors">
            Shop Abayas & Hijabs <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}