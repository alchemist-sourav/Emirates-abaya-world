import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { ScaledFrame } from '@/components/presentation/ScaledFrame'

export const metadata = {
  title: 'Desktop vs Mobile — EMIRATES',
}

const QUICK_ROUTES = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Product', href: '/products/abaya-classic-black' },
  { label: 'Cart', href: '/cart' },
  { label: 'Checkout', href: '/checkout' },
  { label: 'Login', href: '/login' },
  { label: 'Account', href: '/account' },
]

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-3 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back to site
              </Link>
              <h1 className="font-heading text-2xl font-bold">EMIRATES* — Compare</h1>
              <p className="text-sm text-gray-400 mt-1">
                Desktop (1440px) and Mobile (390px) side by side · live previews
              </p>
            </div>
            <nav className="flex flex-wrap gap-2" aria-label="Quick preview routes">
              {QUICK_ROUTES.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#C9A227] hover:text-[#111111] text-xs font-medium transition-colors"
                >
                  {r.label}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start justify-items-center">
          <div>
            <ScaledFrame
              url="/"
              viewportWidth={1440}
              viewportHeight={900}
              scale={0.62}
              label="Desktop"
            />
            <p className="max-w-md mx-auto text-center text-xs text-gray-500 mt-3">
              Full-width navigation with the EMIRATES* wordmark, atelier label and gold CLEARANCE SALE link.
            </p>
          </div>
          <div>
            <ScaledFrame
              url="/"
              viewportWidth={390}
              viewportHeight={844}
              scale={0.86}
              label="Mobile"
            />
            <p className="max-w-md mx-auto text-center text-xs text-gray-500 mt-3">
              Slide-out drawer menu, compact header and bottom navigation for one-handed browsing.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}