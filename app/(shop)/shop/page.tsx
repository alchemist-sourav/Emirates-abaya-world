import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShopClient } from './ShopClient'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'

export const metadata: Metadata = {
  title: 'Shop – All Abayas & Hijabs',
  description: 'Browse our complete collection of premium abayas, hijabs and modest fashion.',
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F6F2]">
          <div className="bg-[#111111] py-12 lg:py-16">
            <div className="container-xl">
              <div className="h-8 w-48 bg-white/10 animate-pulse mb-2" />
              <div className="h-4 w-24 bg-white/10 animate-pulse" />
            </div>
          </div>
          <div className="container-xl py-8">
            <ProductGridSkeleton count={8} />
          </div>
        </div>
      }
    >
      <ShopClient />
    </Suspense>
  )
}
