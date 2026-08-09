import React from 'react'
import ProductCard from './ProductCard'
import type { Product } from '@/types/product'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
  className?: string
  columns?: 2 | 3 | 4
  priorityCount?: number
}

export function ProductGrid({ products, className, columns = 4, priorityCount = 4 }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-3 sm:gap-4 lg:gap-5', gridCols[columns], className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  )
}
