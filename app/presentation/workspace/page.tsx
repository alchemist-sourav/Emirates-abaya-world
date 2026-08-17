import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { ScaledFrame } from '@/components/presentation/ScaledFrame'

export const metadata = {
  title: 'Workspace — EMIRATES',
}

const FRAMES: { label: string; url: string; note: string }[] = [
  { label: 'Checkout', url: '/checkout', note: 'Address, shipping, payment and COD steps.' },
  { label: 'Login', url: '/login', note: 'Centered sign-in card with social options.' },
  { label: 'Sign Up', url: '/signup', note: 'Account creation with password strength indicator.' },
  { label: 'Account', url: '/account', note: 'Orders with product thumbnails, wishlist and addresses.' },
  { label: 'Homepage', url: '/', note: 'Hero, collections, latest designs, editorial, testimonials & Instagram grid.' },
  { label: 'Shop', url: '/shop', note: 'Filter sidebar, grid and clearance sale banner.' },
  { label: 'Product', url: '/products/abaya-classic-black', note: 'Breadcrumb, gallery, size guide, options & reviews.' },
  { label: 'Cart', url: '/cart', note: 'Free-shipping progress bar and itemised summary.' },
  { label: 'Wishlist', url: '/wishlist', note: 'Saved items grid with add-to-bag actions.' },
  { label: 'About', url: '/about', note: 'House story, journey, principles and visionaries.' },
  { label: 'Contact', url: '/contact', note: 'Atelier cards and enquiry form.' },
  { label: 'FAQ', url: '/faq', note: 'Searchable questions grouped by topic pills.' },
  { label: 'Shipping', url: '/shipping', note: 'Complimentary delivery and zones.' },
  { label: 'Privacy', url: '/privacy', note: 'Numbered privacy & returns sections.' },
  { label: 'Returns', url: '/returns', note: '14-day return & exchange policy.' },
  { label: 'Order Success', url: '/order-success', note: 'Confirmation with order summary.' },
]

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-[#111111] text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-3 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to site
          </Link>
          <h1 className="font-heading text-2xl font-bold">EMIRATES* — Workspace</h1>
          <p className="text-sm text-gray-400 mt-1">
            All screens at a glance · 1560px vertical viewport, stacked for review
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-16">
          {FRAMES.map((f) => (
            <div key={f.url} className="flex flex-col items-center w-full">
              <ScaledFrame
                url={f.url}
                viewportWidth={1440}
                viewportHeight={1560}
                scale={0.5}
                label={f.label}
              />
              <div className="mt-4 flex items-center justify-between gap-4 w-full max-w-[720px]">
                <p className="text-xs text-gray-500">{f.note}</p>
                <Link
                  href={f.url}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#C9A227] hover:text-[#D4956A] transition-colors whitespace-nowrap"
                >
                  Open full size
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}