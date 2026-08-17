'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ShieldCheck, RotateCcw, Truck, BadgeCheck, ChevronDown, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProductGallery } from '@/components/products/ProductGallery'
import { ProductOptions } from '@/components/products/ProductOptions'
import { SizeGuideModal } from '@/components/products/SizeGuideModal'
import { PinCodeCheck } from '@/components/products/PinCodeCheck'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useRecentlyViewedStore } from '@/store/recently-viewed'
import { getSiteConfig } from '@/lib/services/products'
import { formatPrice, discountPercent } from '@/lib/utils'
import type { Product } from '@/types/product'
import { cn } from '@/lib/utils'

interface Props {
  product: Product
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#E5E5E5]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3.5 text-left text-sm font-semibold text-[#111111] transition-colors hover:text-[#C9A227]"
        aria-expanded={open}
      >
        {title}
        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div className="pb-4 text-sm text-[#444] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

export function ProductDetailClient({ product }: Props) {
  const router = useRouter()
  const defaultSize = product.sizes.find((s) => s.value === 'M')?.value ?? null
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0]?.id ?? null)
  const [selectedSize, setSelectedSize] = useState<string | null>(defaultSize)
  const [selectedLength, setSelectedLength] = useState<string | null>(null)
  const [selectedHijab, setSelectedHijab] = useState<string | null>('none')
  const [quantity, setQuantity] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
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
    if (product.lengths.length > 0 && !selectedLength) errs.length = 'Please select a length'
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
      color: selectedColor ? product.colors?.find((c) => c.id === selectedColor)?.name : undefined,
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

  const outOfStock = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 5

  const categoryLabel = (category: string): string => {
    const map: Record<string, string> = {
      abayas: 'Abayas',
      hijabs: 'Hijabs',
      'prayer-abayas': 'Prayer Abayas',
      accessories: 'Accessories',
    }
    return map[category] ?? 'Shop'
  }

  const trustItems: { icon: typeof ShieldCheck; label: string }[] = []
  if (config.claims.securePayments) trustItems.push({ icon: ShieldCheck, label: 'Secure Payment' })
  if (config.claims.freeShipping) trustItems.push({ icon: Truck, label: 'Free Shipping' })
  if (config.claims.easyReturns) trustItems.push({ icon: RotateCcw, label: 'Easy Returns' })
  if (config.claims.qualityChecked) trustItems.push({ icon: BadgeCheck, label: 'Quality Checked' })

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-8 xl:gap-14 items-start pb-24 lg:pb-0">
      {/* Left: large image (55%) — sticky on desktop */}
      <div className="lg:sticky lg:top-6">
        <ProductGallery images={product.images} productName={product.name} />
      </div>

      {/* Right: product information (45%) */}
      <div className="flex flex-col gap-5">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-gray-400 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <Link href="/shop" className="hover:text-[#C9A227] transition-colors">Shop</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-[#C9A227] transition-colors">
            {categoryLabel(product.category)}
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="text-[#111111] font-medium" aria-current="page">{product.name}</span>
        </nav>

        {/* Title — large but restrained */}
        <h1 className="font-heading text-[26px] sm:text-3xl font-medium text-[#111111] leading-tight">
          {product.name}
        </h1>

        {/* Stock status — green dot */}
        <div className="flex items-center gap-2">
          <span
            className={cn('w-2 h-2 rounded-full', outOfStock ? 'bg-red-500' : lowStock ? 'bg-orange-400' : 'bg-[#55C83E]')}
            aria-hidden="true"
          />
          <span className={cn('text-sm', outOfStock ? 'text-red-600 font-medium' : lowStock ? 'text-orange-600 font-medium' : 'text-[#111111]')}>
            {outOfStock ? 'Out of Stock' : lowStock ? `Only ${product.stock} left in stock` : 'In stock, ready to ship'}
          </span>
        </div>

        {/* Price — gold */}
        <div className="flex items-baseline gap-3">
          <span className="text-[30px] font-bold text-[#C9A227] leading-none">
            {formatPrice(product.price + hijabPrice)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-base text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#D4956A] text-white text-[11px] font-bold tracking-wide">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-[11px] text-gray-400 -mt-2">*Inclusive of VAT</p>

        {/* Compact reviews */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[#111111]">{product.rating.toFixed(1)}</span>
            <div className="flex items-center gap-px">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  viewBox="0 0 24 24"
                  className={cn('h-3.5 w-3.5', i <= Math.round(product.rating) ? 'fill-[#C9A227] text-[#C9A227]' : 'fill-gray-200 text-gray-200')}
                  aria-hidden="true"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount})</span>
          </div>
        )}

        <div className="border-t border-[#F0EEEC]" />

        {config.currency === 'INR' && <PinCodeCheck />}

        {/* Options */}
        <ProductOptions
          sizes={product.sizes}
          lengths={product.lengths}
          hijabOptions={product.hijabOptions}
          colors={product.colors}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          selectedSize={selectedSize}
          selectedLength={selectedLength}
          selectedHijab={selectedHijab}
          onSizeChange={setSelectedSize}
          onLengthChange={setSelectedLength}
          onHijabChange={setSelectedHijab}
          onSizeGuide={() => setSizeGuideOpen(true)}
          errors={errors}
        />

        {/* Product note — configurable */}
        {config.productNote && (
          <p className="text-xs text-[#6B7280] leading-relaxed">{config.productNote}</p>
        )}

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#111111]">Quantity</label>
          <div className="flex items-center border border-gray-300">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="px-3.5 py-2 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-5 py-2 text-sm font-semibold min-w-[40px] text-center" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
              className="px-3.5 py-2 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        {(selectedSize || selectedLength) && (
          <div className="flex items-center justify-between py-3 border-y border-[#E5E5E5]">
            <span className="text-sm text-gray-600">Total for {quantity} {quantity === 1 ? 'item' : 'items'}</span>
            <span className="text-xl font-bold text-[#111111]">{formatPrice(totalPrice)}</span>
          </div>
        )}

        {/* Purchase area */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={cn(
              'w-full py-3.5 font-semibold text-sm tracking-wide uppercase rounded-full transition-colors',
              outOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#111111] text-white hover:bg-[#C9A227] hover:text-[#111111]'
            )}
          >
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="py-3.5 bg-[#D4956A] text-white font-semibold text-sm tracking-wide rounded-full hover:bg-[#C98557] transition-colors disabled:opacity-40"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              disabled={outOfStock}
              className="py-3.5 border border-gray-300 text-[#111111] font-semibold text-sm rounded-full hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
              WhatsApp Order
            </button>
          </div>

          <button
            type="button"
            onClick={handleWishlistToggle}
            className={cn(
              'py-3 flex items-center justify-center gap-2 border font-medium text-sm rounded-full transition-all',
              isWishlisted ? 'bg-[#111111] text-white border-[#111111]' : 'border-gray-300 text-[#111111] hover:border-[#111111]'
            )}
            aria-pressed={isWishlisted}
          >
            <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} strokeWidth={1.6} aria-hidden="true" />
            {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
          </button>
        </div>

        {/* Product benefits — only supported claims */}
        {trustItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-2 pt-4 border-t border-[#F0EEEC]">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[#C9A227] flex-shrink-0" strokeWidth={1.6} aria-hidden="true" />
                <span className="text-[11px] text-gray-500 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Accordions */}
        <div className="mt-2 border-t border-[#E5E5E5]">
          <Accordion title="Description" defaultOpen>
            {product.description}
          </Accordion>
          <Accordion title="Fabric & Care">
            <p>Fabric: {product.fabric}</p>
            <p className="mt-1">Colour: {product.color}</p>
            <p className="mt-2">Dry clean recommended. Steam iron on low heat inside out. Store folded in a breathable garment bag to preserve the fabric and embellishments.</p>
          </Accordion>
          <Accordion title="Shipping Info" defaultOpen>
            Dispatched within 24–48 hours. {config.claims.freeShipping ? `Free shipping above ${formatPrice(config.freeShippingAbove)}, ` : ''}otherwise a flat shipping fee applies. {config.claims.codAvailable ? 'Cash on Delivery available.' : ''}
          </Accordion>
          <Accordion title="Returns">
            Easy 14-day return &amp; exchange. Items must be unused, with tags attached. See our Return &amp; Exchange Policy for details.
          </Accordion>
          <Accordion title={`Reviews (${product.reviewCount})`}>
            <p className="mb-3">
              Rated <span className="font-semibold text-[#111111]">{product.rating.toFixed(1)}/5.0</span> by {product.reviewCount} verified customers.
            </p>
            <a
              href="#reviews"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111111] border-b border-[#111111] pb-0.5 hover:text-[#C9A227] hover:border-[#C9A227] transition-colors"
            >
              Read all reviews
            </a>
          </Accordion>
        </div>
      </div>

      {/* Size guide modal */}
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>

    {/* Sticky mobile purchase bar — desktop hidden */}
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E5] px-3 py-2.5 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-[#C9A227] leading-none">{formatPrice(totalPrice)}</p>
          <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{quantity > 1 ? `${quantity} items · ` : ''}VAT included</p>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="flex-1 py-3 bg-[#111111] text-white text-[13px] font-semibold tracking-wide rounded-full hover:bg-[#000000] transition-colors disabled:opacity-50"
        >
          ADD TO CART
        </button>
      </div>
    </div>
    </>
  )
}
