'use client'

import React, { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, Eye } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useWishlistStore } from '@/store/wishlist'
import { useQuickViewStore } from '@/store/quickview'
import { SITE_CONFIG } from '@/lib/data/products'
import type { Product } from '@/types/product'
import { formatPrice, discountPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

export default function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)

  const { addItem: addToWishlist, removeItem: removeFromWishlist, hasItem } = useWishlistStore()
  const openQuickView = useQuickViewStore((s) => s.openQuickView)

  // True after hydration so SSR HTML doesn't mismatch client state (wishlist persisted in localStorage)
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const isWishlisted = isMounted ? hasItem(product.id) : false
  const discount = discountPercent(product.originalPrice, product.price)

  const primaryImage = product.images[0] ?? '/placeholder.jpg'
  const secondaryImage = product.images[1] ?? primaryImage

  const showNew = product.isNew
  const showBestseller = product.tags?.includes('Bestseller')
  const showSale = product.isOnSale && discount > 0
  const outOfStock = product.stock === 0

  function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast('Removed from wishlist', { icon: '🤍', style: { fontSize: '13px' } })
    } else {
      addToWishlist({
        id: `wl-${product.id}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: primaryImage,
        slug: product.slug,
        rating: product.rating,
      })
      toast.success('Added to wishlist!', { icon: '❤️', style: { fontSize: '13px' } })
    }
  }

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    openQuickView(product)
  }

  return (
    <div
      className={cn('group relative bg-white', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* IMAGE — dominant element */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F4F1]">
          <Image
            src={hovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-500',
              hovered ? 'scale-[1.04]' : 'scale-100'
            )}
          />

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
              <span className="bg-gray-800 text-white text-[11px] font-semibold px-3 py-1 tracking-wide uppercase">
                Out of Stock
              </span>
            </div>
          )}

          {/* Small "New In" etc. badge — top left */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            {showNew && (
              <span className="bg-[#111111] text-white text-[10px] font-semibold px-2 py-0.5 tracking-wide uppercase leading-none">
                New In
              </span>
            )}
            {!showNew && showBestseller && (
              <span className="bg-[#C9A227] text-[#111111] text-[10px] font-semibold px-2 py-0.5 tracking-wide uppercase leading-none">
                Bestseller
              </span>
            )}
            {!showNew && showSale && discount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5 tracking-wide uppercase leading-none">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Subtle wishlist heart — top right */}
          <button
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              'absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-colors touch-manipulation',
              isWishlisted ? 'bg-[#111111] text-white' : 'bg-white/85 text-gray-700 hover:bg-[#111111] hover:text-white'
            )}
          >
            <Heart className={cn('h-4 w-4', isWishlisted ? 'fill-current' : 'fill-none')} strokeWidth={1.6} />
          </button>

          {/* Quick view — subtle on hover */}
          <button
            onClick={handleQuickView}
            className={cn(
              'hidden sm:flex absolute bottom-3 left-3 z-10 items-center gap-1.5 px-3 py-1.5 bg-white/90 text-[#111111] text-[11px] font-medium',
              'transition-all duration-200',
              !outOfStock && hovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Eye className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            Quick View
          </button>
        </div>

        {/* CARD BODY — minimal chrome */}
        <div className="pt-2.5">
          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-1">
              <div className="flex items-center gap-px">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3 h-3',
                      i <= Math.round(product.rating) ? 'fill-[#C9A227] text-[#C9A227]' : 'fill-gray-200 text-gray-200'
                    )}
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-500 leading-none">
                {(product.reviewCount > 0 ? product.reviewCount : 0)}
              </span>
            </div>
          )}

          {/* Name */}
          <h3 className={cn(
            'font-medium text-[13px] text-gray-900 line-clamp-2 leading-snug mb-1',
            'group-hover:text-[#111111] group-hover:underline'
          )}>
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="font-bold text-[15px] text-[#111111] leading-none">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-[12px] text-gray-400 line-through leading-none">{SITE_CONFIG.listPriceLabel}{formatPrice(product.originalPrice)}</span>
                {discount > 0 && (
                  <span className="text-[11px] font-semibold text-[#16A34A] leading-none">{discount}% OFF</span>
                )}
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
