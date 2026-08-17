'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Star, Heart } from 'lucide-react'
import { useQuickViewStore } from '@/store/quickview'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatPrice, discountPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types/product'

export function QuickViewModal() {
  const { product, isOpen, closeQuickView } = useQuickViewStore()

  if (!product || !isOpen) return null

  return <QuickViewContent key={product.id} product={product} onClose={closeQuickView} />
}

function QuickViewContent({ product, onClose }: { product: Product; onClose: () => void }) {
  const addToCart = useCartStore((s) => s.addItem)
  const openDrawer = useCartStore((s) => s.openDrawer)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, hasItem } = useWishlistStore()

  const [size, setSize] = useState<string | null>(() => product.sizes.find((s) => s.value === 'M')?.value ?? null)
  const [length, setLength] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const cartItemSeq = useRef(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const discount = discountPercent(product.originalPrice, product.price)
  const outOfStock = product.stock === 0
  const isWishlisted = hasItem(product.id)

  const handleAdd = () => {
    if (!size || (product.lengths.length > 0 && !length)) {
      setError('Please select size and length')
      return
    }
    cartItemSeq.current += 1
    addToCart({
      id: `${product.id}-${cartItemSeq.current}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.images[0] ?? '',
      slug: product.slug,
      size: size ?? undefined,
      length: length ?? undefined,
      quantity: 1,
    })
    openDrawer()
    toast.success('Added to cart!')
    onClose()
  }

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast('Removed from wishlist', { icon: '🤍' })
    } else {
      addToWishlist({
        id: `wl-${product.id}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: product.images[0] ?? '',
        slug: product.slug,
        rating: product.rating,
      })
      toast.success('Added to wishlist!')
    }
  }

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,880px)] max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <span className="text-sm font-semibold text-gray-600">Quick View</span>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 transition-colors" aria-label="Close quick view">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 sm:p-6">
          {/* Image */}
          <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
            <Image
              src={product.images[0] ?? '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 440px"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3">
            <Link href={`/products/${product.slug}`} onClick={onClose} className="hover:underline">
              <h3 className="font-heading text-lg font-semibold text-[#111111] leading-snug">{product.name}</h3>
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn('h-3.5 w-3.5', i <= Math.floor(product.rating) ? 'fill-[#f5a623] text-[#f5a623]' : 'fill-gray-200 text-gray-200')}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewCount} ratings)</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#111111]">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">{SITE_CONFIG.listPriceLabel}{formatPrice(product.originalPrice)}</span>
                  <span className="text-sm font-semibold text-green-600">{discount}% off</span>
                </>
              )}
            </div>

            <p className={cn('text-xs font-medium', outOfStock ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-green-600')}>
              {outOfStock ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In stock'}
            </p>

            {/* Size */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">Size</label>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.value)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium border transition-colors',
                      size === s.value ? 'bg-[#111111] text-white border-[#111111]' : 'border-gray-200 text-gray-700 hover:border-[#111111]'
                    )}
                    aria-pressed={size === s.value}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            {product.lengths.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">Length</label>
              <div className="flex flex-wrap gap-1.5">
                {product.lengths.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLength(l.value)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium border transition-colors',
                      length === l.value ? 'bg-[#111111] text-white border-[#111111]' : 'border-gray-200 text-gray-700 hover:border-[#111111]'
                    )}
                    aria-pressed={length === l.value}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            )}

            {error && <p className="text-xs text-red-500" role="alert">{error}</p>}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={handleAdd}
                disabled={outOfStock}
                className="py-3 bg-[#111111] text-white text-sm font-semibold hover:bg-[#222222] transition-colors disabled:opacity-40"
              >
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={cn(
                  'py-3 flex items-center justify-center gap-1.5 border text-sm font-semibold transition-colors',
                  isWishlisted ? 'bg-[#111111] text-white border-[#111111]' : 'border-gray-200 text-[#111111] hover:border-[#111111]'
                )}
              >
                <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} aria-hidden="true" />
                Wishlist
              </button>
            </div>

            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="text-center text-sm font-medium text-[#C9A227] hover:underline"
            >
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
