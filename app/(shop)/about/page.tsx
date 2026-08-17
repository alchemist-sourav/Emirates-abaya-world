'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Scissors, Flower2, Leaf, MapPin, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'

const PRINCIPLES = [
  { icon: Scissors, title: 'Quality Craftsmanship', desc: 'Every abaya is cut, draped and hand-finished by master artisans in our atelier. We obsess over fabric, fit and finish so each piece feels quietly extraordinary.' },
  { icon: Flower2, title: 'Modest Elegance', desc: 'Grace is our design language. Fluid silhouettes, refined detailing and pure fabrics that honour modesty while celebrating the modern woman.' },
  { icon: Leaf, title: 'Sustainable Fashion', desc: 'We craft in small, considered batches with responsibly sourced fabrics, minimising waste and creating pieces designed to be loved for years.' },
]

const MILESTONES = [
  { stat: '2018', label: 'Founded in Kerala' },
  { stat: '10K+', label: 'Women Wearing EMIRATES' },
  { stat: '120+', label: 'Signature Designs' },
  { stat: '30+', label: 'Countries Served' },
]

const TEAM = [
  {
    name: 'Layan Al-Ghurair',
    role: 'Creative Director',
    bio: 'Founder and the creative soul of the maison. Layan leads every collection, from the first sketch to the final fitting.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  },
  {
    name: 'Master Artisan Tariq',
    role: 'Master Artisan',
    bio: 'Two decades of pattern-making in the Gulf. Tariq translates vision into silhouette, obsessed with drape, fall and hand-finishing.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
  {
    name: 'Fatima Al-Marri',
    role: 'Head of Styling & Client Relations',
    bio: 'Your first point of contact. Fatima advises brides and clients on silhouettes, lengths and occasion dressing.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
  },
]

export default function AboutPage() {
  const config = SITE_CONFIG

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Hero */}
        <div className="text-center mb-14 lg:mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-4">
            Since 2018
          </span>
          <h1 className="font-heading italic text-4xl lg:text-5xl font-semibold text-[#111111] mb-5 leading-tight">
            Our Story
          </h1>
          <span className="block w-16 h-px bg-[#C9A227] mx-auto mb-6" aria-hidden="true" />
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Handcrafted modest fashion, made in Kerala for the modern woman. From a small atelier in
            Karunagappally to wardrobes across India and beyond — this is how we got here.
          </p>
        </div>

        {/* Journey */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-12 lg:mb-16">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[280px] lg:min-h-full">
              <Image
                src="/images/products/about-atelier.jpg"
                alt="Inside the EMIRATES atelier in Karunagappally"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 lg:p-12">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-3">
                The EMIRATES Journey
              </span>
              <h2 className="font-heading italic text-2xl lg:text-3xl font-semibold text-[#111111] mb-5">
                From one sewing table to thirty countries
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  EMIRATES was founded in 2018 with a single belief — modest fashion
                  deserves the same craftsmanship as any luxury maison. We began by cutting abayas
                  on a single table, obsessing over drape, fall and finish until each piece felt
                  right.
                </p>
                <p>
                  Today our atelier sits in Karunagappally, Kerala — a small, devoted team of
                  cutters, embroiderers and stylists still works the way we always have: slowly,
                  deliberately, by hand.
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
          <p className="text-sm text-gray-400 mt-6">— Layan Al-Ghurair, Founder &amp; Creative Director</p>
        </div>

        {/* Bespoke principles */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-3">
              The EMIRATES Promise
            </span>
            <h2 className="font-heading italic text-2xl lg:text-3xl font-semibold text-[#111111]">Bespoke Principles</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {PRINCIPLES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#C9A227] transition-colors">
                <Icon className="h-6 w-6 text-[#C9A227] mb-3" aria-hidden="true" />
                <h3 className="font-heading font-semibold text-[#111111] mb-1.5">{title}</h3>
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
            <h2 className="font-heading italic text-2xl lg:text-3xl font-semibold text-[#111111]">
              The Creative Mind &amp; Visionaries
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {TEAM.map(({ name, role, bio, image }) => (
              <div key={name} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="relative h-28 w-28 rounded-full overflow-hidden mx-auto mb-4 bg-[#F7F4F1]">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <h3 className="font-heading font-semibold text-[#111111]">{name}</h3>
                <p className="text-xs text-[#C9A227] font-medium uppercase tracking-wider mt-0.5 mb-3">{role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Showroom */}
        <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 mb-12">
          <MapPin className="h-6 w-6 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="text-sm text-gray-600 min-w-0">
            <p className="font-semibold text-[#111111] mb-1">Visit the boutique</p>
            <p>{config.businessName}</p>
            <address className="not-italic leading-relaxed break-words">
              10/488/CDEF<br />
              GOV: HOSPITAL KARUNAGAPPALLY<br />
              KOLLAM, KERALA - 690518
            </address>
            <p className="mt-2 text-xs text-gray-500">
              Mon–Sat: 10:00 AM – 7:00 PM IST · {config.phone} · {config.phone2}
            </p>
            <p className="mt-1 text-xs text-gray-500">GST: {config.gst}</p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#C9A227] hover:text-[#111111] transition-colors uppercase tracking-wide">
            Online Atelier Craft <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}