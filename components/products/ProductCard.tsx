'use client'

import React, { useState, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useQuickViewStore } from '@/store/quickview'
import type { Product } from '@/types/product'
import { formatINR, discountPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

export default function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)

  const { addItem: addToCart, openDrawer } = useCartStore()
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
  const cartItemSeq = useRef(0)

  const primaryImage = product.images[0] ?? '/placeholder.jpg'
  const secondaryImage = product.images[1] ?? primaryImage

  const showNew = product.isNew
  const showBestseller = product.tags?.includes('Bestseller')
  const showSale = product.isOnSale && discount > 0
  const outOfStock = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 5

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    cartItemSeq.current += 1

    addToCart({
      id: `${product.id}-${cartItemSeq.current}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: primaryImage,
      quantity: 1,
      slug: product.slug,
    })
    openDrawer()
    toast.success('Added to cart!', {
      icon: '🛍️',
      style: { fontSize: '13px' },
    })
  }

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
      className={cn(
        'group relative bg-white border border-gray-200 overflow-hidden transition-shadow duration-200 hover:shadow-md',
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* IMAGE AREA */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <Image
            src={hovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-300',
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

          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {showBestseller && (
              <span className="bg-[#C9A227] text-[#111111] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 tracking-wider uppercase leading-none">
                BESTSELLER
              </span>
            )}
            {showNew && (
              <span className="bg-[#111111] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 tracking-wider uppercase leading-none">
                NEW
              </span>
            )}
            {showSale && (
              <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 tracking-wider uppercase leading-none">
                SALE
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              'absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center',
              'transition-all duration-200 touch-manipulation',
              isWishlisted
                ? 'bg-[#111111] text-white'
                : 'bg-white/90 text-gray-600 hover:bg-[#111111] hover:text-white shadow-sm'
            )}
          >
            <Heart
              className={cn('w-4 h-4', isWishlisted ? 'fill-white text-white' : 'fill-none')}
            />
          </button>

          {/* Quick view — desktop hover */}
          <button
            onClick={handleQuickView}
            className={cn(
              'hidden sm:flex absolute bottom-2 left-1/2 -translate-x-1/2 z-10',
              'items-center gap-1.5 px-3 py-1.5 bg-white/95 text-[#111111] text-[11px] font-semibold',
              'shadow-sm transition-all duration-200',
              !outOfStock && hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            )}
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            Quick View
          </button>
        </div>

        {/* CARD BODY */}
        <div className="p-2.5 sm:p-3">
          {/* Name */}
          <h3
            className={cn(
              'font-medium text-[13px] text-gray-900 line-clamp-2 leading-snug mb-1',
              'group-hover:text-[#111111]'
            )}
          >
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3 h-3',
                      i <= Math.floor(product.rating) ? 'fill-[#f5a623] text-[#f5a623]' : 'fill-gray-200 text-gray-200'
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-gray-700 leading-none">{product.rating.toFixed(1)}</span>
              {product.reviewCount > 0 && (
                <span className="text-[11px] text-gray-400 leading-none">({product.reviewCount})</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 mb-1">
            <span className="font-bold text-[15px] text-gray-900 leading-none">{formatINR(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-[11px] text-gray-400 line-through leading-none">MRP {formatINR(product.originalPrice)}</span>
                {discount > 0 && (
                  <span className="text-[11px] font-semibold text-green-600 leading-none">{discount}% off</span>
                )}
              </>
            )}
          </div>

          {/* Low stock */}
          {lowStock && !outOfStock && (
            <p className="text-[11px] text-orange-500 font-medium mb-1.5 leading-none">
              Only {product.stock} left!
            </p>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={cn(
              'w-full h-9 text-[12px] font-semibold tracking-wide uppercase rounded-sm mt-1.5',
              'flex items-center justify-center gap-1.5',
              'transition-colors duration-150 touch-manipulation',
              outOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#111111] text-white hover:bg-[#C9A227] hover:text-[#111111] active:scale-[0.98]'
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </Link>
    </div>
  )
}
