'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useWishlistStore } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const addToCart = useCartStore((s) => s.addItem)
  const openDrawer = useCartStore((s) => s.openDrawer)
  const cartItemSeq = useRef(0)

  const handleMoveToCart = (item: (typeof items)[number]) => {
    cartItemSeq.current += 1
    addToCart({
      id: `${item.productId}-${cartItemSeq.current}`,
      productId: item.productId,
      name: item.name,
      price: item.price,
      currency: item.currency,
      image: item.image,
      slug: item.slug,
      quantity: 1,
    })
    removeItem(item.id)
    openDrawer()
    toast.success('Moved to cart!')
  }

  const handleRemove = (id: string, name: string) => {
    removeItem(id)
    toast(`${name} removed from wishlist`, { icon: '💔' })
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#111111]">
              My Wishlist
            </h1>
            {items.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
            )}
          </div>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="bg-white p-12 sm:p-16 text-center border border-[#E5E5E5]">
            <Heart className="h-20 w-20 text-gray-200 mx-auto mb-6" aria-hidden="true" />
            <h2 className="font-heading text-2xl font-semibold text-[#111111] mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto">
              Save your favourite abayas and hijabs here to shop them later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#111111] text-white font-semibold hover:bg-[#222222] transition-colors"
            >
              Browse the Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
            {items.map((item) => (
              <div key={item.id} className="group bg-white border border-[#E5E5E5] overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <Link href={`/products/${item.slug}`} className="block">
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-medium text-sm text-[#111111] line-clamp-2 hover:text-[#C9A227] transition-colors mb-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="font-bold text-[#111111] mb-2">{formatPrice(item.price)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#111111] text-white text-xs font-semibold hover:bg-[#222222] transition-colors"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="p-2.5 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
