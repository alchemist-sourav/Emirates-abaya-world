import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { QuickViewModal } from '@/components/products/QuickViewModal'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ShoppingBag, ArrowRight, Home } from 'lucide-react'

const COLLECTIONS = [
  { title: 'Abayas', desc: 'Signature everyday silhouettes', href: '/shop?category=abayas' },
  { title: 'Abaya Dresses', desc: 'Modern occasion pieces', href: '/shop?category=abayas&subcategory=modern' },
  { title: 'Hijabs', desc: 'Premium fabrics & finishes', href: '/shop?category=hijabs' },
  { title: 'Accessories', desc: 'The finishing touches', href: '/shop?category=accessories' },
]

export default function NotFound() {
  return (
    <>
      <Header />
      <SearchOverlay />
      <QuickViewModal />
      <CartDrawer />

      <main className="bg-[#FAF7F2] relative overflow-hidden">
        <div className="site-container py-24 lg:py-36 text-center relative">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A227] mb-4">
            Error · 404
          </p>
          <h1 className="font-heading font-bold text-[110px] lg:text-[200px] leading-none text-[#F3EFE9] relative select-none">
            404
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-[#C9A227]" aria-hidden="true" />
          </h1>
          <h2 className="font-heading italic text-2xl lg:text-3xl text-[#111111] mt-6">
            Page Not Found
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mt-4 mb-10 text-sm leading-relaxed">
            Like our most-wanted pieces, this page has been reimagined or relocated. Let us guide
            you back to the boutique.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#C9A227] hover:text-[#111111] transition-colors uppercase tracking-wider">
              <Home className="h-4 w-4" aria-hidden="true" />
              Back to Homepage
            </Link>
            <Link href="/shop" className="inline-flex items-center gap-2 border border-[#111111] text-[#111111] text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#111111] hover:text-white transition-colors uppercase tracking-wider">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Browse Collections
            </Link>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="site-container pb-24 lg:pb-32">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A227] mb-2">Browse the boutique</p>
              <h2 className="font-heading italic text-2xl lg:text-3xl font-semibold text-[#111111] uppercase tracking-wider">
                You may also like
              </h2>
            </div>
            <Link href="/shop" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#C9A227] transition-colors">
              View All
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((c) => (
              <Link key={c.title} href={c.href} className="group block bg-white border border-[#F0EEEC] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] bg-[#F3EFE9] relative flex items-center justify-center overflow-hidden">
                  <span className="absolute bottom-3 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" aria-hidden="true" />
                  <span className="font-heading text-3xl font-bold tracking-widest text-[#111111] group-hover:text-[#C9A227] transition-colors">
                    {c.title.split(' ')[0]}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-base font-bold text-[#111111] group-hover:text-[#C9A227] transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}