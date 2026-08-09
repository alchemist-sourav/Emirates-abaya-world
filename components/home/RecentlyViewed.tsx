'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRecentlyViewedStore } from '@/store/recently-viewed'
import { getProductsByIds } from '@/lib/services/products'
import type { Product } from '@/types/product'
import { ProductGrid } from '@/components/products/ProductGrid'

export function RecentlyViewed() {
  const ids = useRecentlyViewedStore((s) => s.ids)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (ids.length === 0) return
    getProductsByIds(ids).then(setProducts)
  }, [ids])

  if (products.length === 0) return null

  return (
    <section aria-labelledby="recently-viewed-heading">
      <div className="container-xl">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 id="recently-viewed-heading" className="text-lg sm:text-xl font-bold text-[#111111]">
              Recently Viewed
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Pick up where you left off</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-[#111111] hover:text-[#C9A227] whitespace-nowrap">
            View All
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 4)} columns={4} />
      </div>
    </section>
  )
}
