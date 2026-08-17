"use client"

import React from 'react'
import Link from 'next/link'
import { MapPin, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'
import { Logo } from './Logo'
import { NewsletterSection } from './NewsletterSection'

const QUICK_LINKS = [
  { label: 'Shop Abayas', href: '/shop?category=abayas' },
  { label: 'Collections', href: '/shop' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
]

const CUSTOMER_CARE_LINKS = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Returns & Exchanges', href: '/returns' },
  { label: 'Privacy Policy', href: '/privacy' },
]

export function Footer() {
  const config = SITE_CONFIG

  const trustItems: { icon: typeof ShieldCheck; label: string }[] = []
  if (config.claims.securePayments) trustItems.push({ icon: ShieldCheck, label: 'Secure Payments' })
  if (config.claims.easyReturns) trustItems.push({ icon: RotateCcw, label: 'Easy Returns' })
  if (config.claims.freeShipping) trustItems.push({ icon: Truck, label: 'Free Shipping' })
  if (config.claims.fastDelivery) trustItems.push({ icon: MapPin, label: 'Worldwide Delivery' })

  return (
    <>
      {/* Newsletter — cream, above the dark footer */}
      <NewsletterSection />

      <footer className="bg-[#1A1A1A] text-white" role="contentinfo">
        {/* Main footer content */}
        <div className="site-container py-14 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Logo light size="md" className="items-start" />
              <p className="text-gray-400 text-sm leading-relaxed mt-5 mb-6">
                {config.tagline}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {trustItems.map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                    <Icon className="h-3.5 w-3.5 text-[#C9A227] flex-shrink-0" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C9A227] mb-5">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
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

            {/* Connect */}
            <div>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C9A227] mb-5">
                Connect
              </h3>
              <p className="text-gray-300 text-sm font-medium mb-3">{config.businessName}</p>
              <ul className="space-y-3">
                <li>
                  <address className="text-gray-400 text-sm not-italic leading-relaxed break-words">
                    10/488/CDEF<br />
                    GOV: HOSPITAL KARUNAGAPPALLY<br />
                    KOLLAM, KERALA - 690518
                  </address>
                </li>
                <li className="flex flex-col gap-1">
                  <a
                    href="tel:+918129914915"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    8129914915
                  </a>
                  <a
                    href="tel:+919747793814"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    9747793814
                  </a>
                </li>
                <li>
                  <span className="text-gray-400 text-sm break-words">GST NO: {config.gst}</span>
                </li>
                <li>
                  <a
                    href={`mailto:${config.supportEmail}`}
                    className="text-gray-400 hover:text-white text-sm transition-colors break-all"
                  >
                    {config.supportEmail}
                  </a>
                </li>
              </ul>

              <div className="flex items-center gap-3 mt-5">
                <a
                  href={`https://instagram.com/${config.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/10 hover:bg-[#C9A227] hover:text-[#111111] rounded-full transition-all duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/10 hover:bg-[#C9A227] hover:text-[#111111] rounded-full transition-all duration-200"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/10 hover:bg-[#C9A227] hover:text-[#111111] rounded-full transition-all duration-200"
                  aria-label="Follow us on Pinterest"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345c-.091.378-.293 1.189-.333 1.355-.053.218-.173.265-.4.159-1.492-.694-2.424-2.875-2.424-4.627 0-3.769 2.737-7.23 7.892-7.23 4.144 0 7.365 2.953 7.365 6.899 0 4.117-2.595 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.373l-.745 2.839c-.269 1.036-.997 2.333-1.484 3.123A11.995 11.995 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="site-container py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs">{config.copyright}</p>
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
    </>
  )
}