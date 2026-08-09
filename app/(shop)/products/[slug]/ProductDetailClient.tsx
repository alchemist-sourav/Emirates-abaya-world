'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingBag, Minus, Plus, Share2, MessageCircle, Star, ShieldCheck, RotateCcw, Truck, BadgeCheck, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProductGallery } from '@/components/products/ProductGallery'
import { ProductOptions } from '@/components/products/ProductOptions'
import { PinCodeCheck } from '@/components/products/PinCodeCheck'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useRecentlyViewedStore } from '@/store/recently-viewed'
import { getSiteConfig } from '@/lib/services/products'
import { formatINR, discountPercent } from '@/lib/utils'
import type { Product } from '@/types/product'
import { cn } from '@/lib/utils'

interface Props {
  product: Product
}

export function ProductDetailClient({ product }: Props) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedLength, setSelectedLength] = useState<string | null>(null)
  const [selectedHijab, setSelectedHijab] = useState<string | null>('none')
  const [quantity, setQuantity] = useState(1)
  const [errors, setErrors] = useState<{ size?: string; length?: string }>({})

  const addToCart = useCartStore((s) => s.addItem)
  const cartItemSeq = useRef(0)
  const openDrawer = useCartStore((s) => s.openDrawer)
  const { hasItem, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()
  const addRecentView = useRecentlyViewedStore((s) => s.addProduct)
  const isWishlisted = hasItem(product.id)

  const config = getSiteConfig()

  useEffect(() => {
    addRecentView(product.id)
  }, [product.id, addRecentView])

  const selectedHijabObj = useMemo(
    () => product.hijabOptions.find((h) => h.id === selectedHijab) ?? null,
    [product.hijabOptions, selectedHijab]
  )
  const hijabPrice = selectedHijabObj?.price ?? 0

  const discount = discountPercent(product.originalPrice, product.price)
  const totalPrice = (product.price + hijabPrice) * quantity

  const validate = () => {
    const errs: { size?: string; length?: string } = {}
    if (!selectedSize) errs.size = 'Please select a size'
    if (!selectedLength) errs.length = 'Please select a length'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAddToCart = () => {
    if (!validate()) return
    cartItemSeq.current += 1
    addToCart({
      id: `${product.id}-${cartItemSeq.current}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.images[0] ?? '',
      slug: product.slug,
      size: selectedSize ?? undefined,
      length: selectedLength ?? undefined,
      hijab: selectedHijabObj?.id !== 'none' ? selectedHijabObj?.name : undefined,
      hijabPrice: hijabPrice > 0 ? hijabPrice : undefined,
      quantity,
    })
    openDrawer()
    toast.success('Added to cart!', { icon: '🛍️' })
  }

  const handleBuyNow = () => {
    if (!validate()) return
    handleAddToCart()
    setTimeout(() => {
      router.push('/checkout')
    }, 250)
  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast('Removed from wishlist', { icon: '💔' })
    } else {
      addToWishlist({
        id: product.id,
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

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in ${product.name} (SKU: ${product.sku}). Could you please help me with ordering?`
    )
    window.open(`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=${msg}`, '_blank')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  const outOfStock = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 5

  const trustItems: { icon: typeof ShieldCheck; label: string }[] = []
  if (config.claims.securePayments) trustItems.push({ icon: ShieldCheck, label: 'Secure Payments' })
  if (config.claims.codAvailable) trustItems.push({ icon: Package, label: 'COD Available' })
  if (config.claims.easyReturns) trustItems.push({ icon: RotateCcw, label: 'Easy Returns' })
  if (config.claims.qualityChecked) trustItems.push({ icon: BadgeCheck, label: 'Quality Checked' })
  if (config.claims.fastDelivery) trustItems.push({ icon: Truck, label: 'Fast Delivery' })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14 items-start">
      {/* Gallery — sticky on desktop */}
      <div className="lg:sticky lg:top-[150px]">
        <ProductGallery images={product.images} productName={product.name} />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.isNew && (
              <span className="px-2.5 py-1 bg-[#111111] text-white text-[10px] font-semibold uppercase tracking-wider">
                New Arrival
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 bg-[#C9A227] text-[#111111] text-[10px] font-semibold uppercase tracking-wider">
                {discount}% Off
              </span>
            )}
            {product.tags?.includes('Bestseller') && (
              <span className="px-2.5 py-1 bg-[#C9A227] text-[#111111] text-[10px] font-semibold uppercase tracking-wider">
                Bestseller
              </span>
            )}
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-0.5" aria-label={`${product.rating} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < Math.floor(product.rating) ? 'text-[#f5a623] fill-[#f5a623]' : 'text-gray-200 fill-gray-200'
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <a href="#reviews" className="text-sm font-medium text-[#C9A227] hover:underline">
              {product.rating} · {product.reviewCount} ratings
            </a>
            <span className="text-xs text-gray-400">SKU: {product.sku}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-bold text-[#111111]">{formatINR(product.price + hijabPrice)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">MRP {formatINR(product.originalPrice)}</span>
                <span className="text-sm font-semibold text-green-600">{discount}% off</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mb-4">Inclusive of all taxes</p>

          {/* Hijab price note */}
          {hijabPrice > 0 && (
            <p className="text-xs text-[#C9A227] mb-2">
              Includes matching hijab (+{formatINR(hijabPrice)})
            </p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className={cn('w-2 h-2 rounded-full', outOfStock ? 'bg-red-500' : lowStock ? 'bg-orange-400' : 'bg-green-500')}
              aria-hidden="true"
            />
            <span className={cn('text-sm', outOfStock ? 'text-red-600 font-medium' : lowStock ? 'text-orange-600 font-medium' : 'text-green-700')}>
              {outOfStock ? 'Out of Stock' : lowStock ? `Only ${product.stock} left in stock` : 'In Stock'}
            </span>
            {lowStock && !outOfStock && (
              <span className="text-[11px] text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5">
                Hurry, limited stock!
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* PIN Code check */}
        <PinCodeCheck />

        {/* Options */}
        <ProductOptions
          sizes={product.sizes}
          lengths={product.lengths}
          hijabOptions={product.hijabOptions}
          selectedSize={selectedSize}
          selectedLength={selectedLength}
          selectedHijab={selectedHijab}
          onSizeChange={setSelectedSize}
          onLengthChange={setSelectedLength}
          onHijabChange={setSelectedHijab}
          errors={errors}
        />

        {/* Quantity */}
        <div>
          <label className="text-sm font-semibold text-[#111111] uppercase tracking-wide block mb-3">
            Quantity
          </label>
          <div className="flex items-center border border-gray-200 w-fit">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-3 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="px-6 py-3 text-sm font-semibold min-w-[48px] text-center" aria-live="polite">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
              className="p-3 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Total */}
        {(selectedSize || selectedLength) && (
          <div className="flex items-center justify-between py-3 border-y border-gray-100">
            <span className="text-sm text-gray-600">Total for {quantity} {quantity === 1 ? 'item' : 'items'}</span>
            <span className="text-xl font-bold text-[#111111]">{formatINR(totalPrice)}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={cn(
              'w-full flex items-center justify-center gap-3 py-4 font-semibold text-base transition-colors',
              outOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#111111] text-white hover:bg-[#222222]'
            )}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="py-4 bg-[#C9A227] text-[#111111] font-semibold text-sm hover:bg-[#D4AF37] transition-colors disabled:opacity-40"
          >
            Buy Now
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWishlistToggle}
              className={cn(
                'py-3.5 flex items-center justify-center gap-2 border font-semibold text-sm transition-all',
                isWishlisted ? 'bg-[#111111] text-white border-[#111111]' : 'border-gray-200 text-[#111111] hover:border-[#111111]'
              )}
              aria-pressed={isWishlisted}
            >
              <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} aria-hidden="true" />
              {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
            <button
              onClick={handleShare}
              className="py-3.5 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium hover:border-gray-400 transition-colors"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share
            </button>
          </div>

          <button
            onClick={handleWhatsApp}
            className="py-3 flex items-center justify-center gap-2 border border-green-500 text-green-600 text-sm font-medium hover:bg-green-50 transition-colors"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Order on WhatsApp
          </button>
        </div>

        {/* Trust strip — only claims the business supports */}
        {trustItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-gray-100">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[#C9A227] flex-shrink-0" aria-hidden="true" />
                <span className="text-[11px] text-gray-500 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Product details */}
        <div className="pt-4 border-t border-gray-100">
          <dl className="space-y-2">
            {[
              { term: 'SKU', value: product.sku },
              { term: 'Fabric', value: product.fabric },
              { term: 'Colour', value: product.color },
              { term: 'Category', value: product.category.replace(/-/g, ' ') },
            ].map(({ term, value }) => (
              <div key={term} className="flex gap-3 text-sm">
                <dt className="font-medium text-gray-500 w-20 flex-shrink-0">{term}</dt>
                <dd className="text-[#111111] capitalize">{value}</dd>
              </div>
            ))}
          </dl>
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {product.tags.map((tag) => (
                <Link key={tag} href={`/shop?q=${encodeURIComponent(tag)}`} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs hover:bg-[#111111] hover:text-white transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Size guide note */}
        <div className="bg-[#F8F6F2] border border-[#E5E5E5] p-4">
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            <span className="font-semibold text-[#111111]">Size Guide:</span> XS (34&ndash;36), S (36&ndash;38), M (38&ndash;40), L (40&ndash;42), XL (42&ndash;44), 2XL (44&ndash;46). Lengths run 50&quot;&ndash;60&quot;. If you are between sizes, we recommend sizing up for a relaxed drape.
          </p>
        </div>
      </div>
    </div>
  )
}
