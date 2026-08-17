import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Monitor, Smartphone } from 'lucide-react'
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

const CANVAS_WIDTH = 2030
const CANVAS_SCALE = 0.6

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
                2030px design canvas — Desktop (1440px) and Mobile (390px) side by side · live previews
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

      <main className="py-12 overflow-x-auto">
        <div className="flex justify-center px-4">
          <div style={{ width: CANVAS_WIDTH * CANVAS_SCALE, height: (900 + 72) * CANVAS_SCALE }} className="relative">
            <div
              className="absolute top-0 left-0 bg-[#E9E3DC] border border-[#E5E5E5] shadow-xl rounded-lg overflow-hidden"
              style={{
                width: CANVAS_WIDTH,
                transform: `scale(${CANVAS_SCALE})`,
                transformOrigin: 'top left',
              }}
            >
              {/* Canvas toolbar */}
              <div className="h-10 flex items-center justify-between px-5 bg-[#111111] text-white">
                <div className="flex items-center gap-2 text-[11px] tracking-wider uppercase">
                  <Monitor className="h-3.5 w-3.5 text-[#C9A227]" aria-hidden="true" />
                  Desktop · 1440 × 900
                  <span className="mx-3 text-gray-500">+</span>
                  <Smartphone className="h-3.5 w-3.5 text-[#C9A227]" aria-hidden="true" />
                  Mobile · 390 × 844
                </div>
                <span className="text-[11px] text-gray-400">Canvas · 2030 × 940</span>
              </div>

              {/* Canvas body */}
              <div className="flex gap-[200px] pt-5 justify-center">
                <ScaledFrame
                  url="/"
                  viewportWidth={1440}
                  viewportHeight={900}
                  scale={1}
                  label="Desktop"
                />
                <ScaledFrame
                  url="/"
                  viewportWidth={390}
                  viewportHeight={844}
                  scale={1}
                  label="Mobile"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto text-center mt-8">
          <p className="text-xs text-gray-500 leading-relaxed">
            Full-width navigation with the EMIRATES wordmark, atelier label and gold CLEARANCE SALE
            link on desktop; a slide-out drawer menu and compact bottom navigation on mobile.
          </p>
        </div>
      </main>
    </div>
  )
}