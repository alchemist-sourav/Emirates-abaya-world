"use client"

import React from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send, ShieldCheck, Truck, RotateCcw, Zap } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'

const SHOP_LINKS = [
  { label: 'All Abayas', href: '/shop?category=abayas' },
  { label: 'Luxury Abayas', href: '/shop?category=luxury-abayas' },
  { label: 'Hijabs', href: '/shop?category=hijabs' },
  { label: 'New Arrivals', href: '/shop?tag=new' },
  { label: 'Best Sellers', href: '/shop?sort=best-selling' },
  { label: 'Deals & Offers', href: '/shop?sale=true' },
]

const CUSTOMER_CARE_LINKS = [
  { label: 'My Account', href: '/account' },
  { label: 'Track Order', href: '/account/orders' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Returns & Exchanges', href: '/returns' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
]

export function Footer() {
  const config = SITE_CONFIG

  const trustItems: { icon: typeof ShieldCheck; label: string }[] = []
  if (config.claims.securePayments) trustItems.push({ icon: ShieldCheck, label: 'Secure Payments' })
  if (config.claims.codAvailable) trustItems.push({ icon: Zap, label: 'COD Available' })
  if (config.claims.easyReturns) trustItems.push({ icon: RotateCcw, label: 'Easy Returns' })
  if (config.claims.fastDelivery) trustItems.push({ icon: Truck, label: 'Pan-India Delivery' })

  return (
    <footer className="bg-[#111111] text-white" role="contentinfo">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-2xl lg:text-3xl mb-3">
              Join Our Exclusive Circle
            </h2>
            <p className="text-gray-400 mb-8 text-sm lg:text-base">
              Be the first to discover new collections, exclusive offers, and styling inspiration.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-none text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors text-sm"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A227] text-[#111111] font-semibold hover:bg-[#D4AF37] transition-colors text-sm whitespace-nowrap"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-500">
              By subscribing you agree to our Privacy Policy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="Emirates Abaya World Home">
              <span className="font-heading text-xl font-bold">Emirates Abaya World</span>
              <br />
              <span className="text-[10px] tracking-[0.3em] text-[#C9A227] uppercase">Premium Modest Fashion · India</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium abayas and hijabs crafted for modern women, delivered across India. Every abaya tells a story of artisanship and grace.
            </p>
            {/* Trust strip */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {trustItems.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                  <Icon className="h-3.5 w-3.5 text-[#C9A227] flex-shrink-0" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/emiratesabayaworld"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 hover:bg-[#C9A227] hover:text-[#111111] rounded-full transition-all duration-200"
                aria-label="Follow us on Instagram"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/emiratesabayaworld"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 hover:bg-[#C9A227] hover:text-[#111111] rounded-full transition-all duration-200"
                aria-label="Follow us on Facebook"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 hover:bg-[#C9A227] hover:text-[#111111] rounded-full transition-all duration-200"
                aria-label="Contact us on WhatsApp"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C9A227] mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C9A227] mb-5">
              Customer Care
            </h3>
            <ul className="space-y-3">
              {CUSTOMER_CARE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C9A227] mb-5">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-gray-400 text-sm">
                  2nd Floor, Fashion Plaza, Linking Road, Mumbai, Maharashtra 400052, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#C9A227] flex-shrink-0" aria-hidden="true" />
                <a
                  href="tel:+919876543210"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {config.whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#C9A227] flex-shrink-0" aria-hidden="true" />
                <a
                  href="mailto:care@emiratesabayaworld.com"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  care@emiratesabayaworld.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Emirates Abaya World. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                Terms of Service
              </Link>
              <Link href="/shipping" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
