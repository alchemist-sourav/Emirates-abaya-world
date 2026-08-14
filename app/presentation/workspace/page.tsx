import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { ScaledFrame } from '@/components/presentation/ScaledFrame'

export const metadata = {
  title: 'Workspace — EMIRATES',
}

const FRAMES: { label: string; url: string; note: string }[] = [
  { label: 'Homepage', url: '/', note: 'Hero, collections, latest designs, editorial, testimonials & Instagram grid.' },
  { label: 'Shop', url: '/shop', note: 'Filter sidebar, grid and clearance sale banner.' },
  { label: 'Product', url: '/products/abaya-classic-black', note: 'Breadcrumb, gallery, size guide, options & reviews.' },
  { label: 'Cart', url: '/cart', note: 'Free-shipping progress bar and itemised summary.' },
  { label: 'Checkout', url: '/checkout', note: 'Address, shipping, payment and COD steps.' },
  { label: 'Login', url: '/login', note: 'Brand panel + sign-in form with social options.' },
  { label: 'Sign Up', url: '/signup', note: 'Account creation with terms consent.' },
  { label: 'Wishlist', url: '/wishlist', note: 'Saved items grid with add-to-bag actions.' },
  { label: 'Account', url: '/account', note: 'Orders, wishlist, addresses and support.' },
  { label: 'About', url: '/about', note: 'House story, journey, vision and team.' },
  { label: 'Contact', url: '/contact', note: 'Dubai showroom details and enquiry form.' },
  { label: 'FAQ', url: '/faq', note: 'Searchable questions grouped by topic.' },
  { label: 'Shipping', url: '/shipping', note: 'Delivery zones and estimated timelines.' },
  { label: 'Privacy', url: '/privacy', note: 'Data, payment security and returns summary.' },
  { label: 'Returns', url: '/returns', note: 'Hassle-free return & exchange policy.' },
  { label: 'Order Success', url: '/order-success', note: 'Confirmation with order summary.' },
]

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-3 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to site
          </Link>
          <h1 className="font-heading text-2xl font-bold">EMIRATES* — Workspace</h1>
          <p className="text-sm text-gray-400 mt-1">
            All screens at a glance · 1440 × 900 desktop viewport, scaled to fit
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
          {FRAMES.map((f) => (
            <div key={f.url} className="flex flex-col items-center">
              <ScaledFrame
                url={f.url}
                viewportWidth={1440}
                viewportHeight={900}
                scale={0.42}
                label={f.label}
              />
              <div className="mt-1 flex flex-col items-center gap-1.5 text-center">
                <p className="text-xs text-gray-500 max-w-[240px]">{f.note}</p>
                <Link
                  href={f.url}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#C9A227] hover:text-[#D4956A] transition-colors"
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