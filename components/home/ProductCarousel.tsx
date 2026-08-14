'use client'

import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/types/product'

interface ProductCarouselProps {
  products: Product[]
  id?: string
}

/** Horizontally scrollable product row with prev/next controls. */
export function ProductCarousel({ products, id }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    const amount = el.querySelector<HTMLElement>('[data-card]')?.offsetWidth ?? el.clientWidth * 0.8
    el.scrollBy({ left: dir * (amount + 20), behavior: 'smooth' })
  }

  return (
    <div id={id}>
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1 scroll-smooth"
      >
        {products.map((p) => (
          <div
            key={p.id}
            data-card
            className="w-[68%] sm:w-[46%] md:w-[31%] lg:w-[23.5%] flex-shrink-0 snap-start"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-colors"
          aria-label="Scroll to previous products"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-colors"
          aria-label="Scroll to next products"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}