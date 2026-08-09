'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import type { CartItem as CartItemType } from '@/store/cart'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { formatINR } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
  compact?: boolean
}

export function CartItemRow({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const { addItem: addToWishlist, hasItem } = useWishlistStore()

  const handleRemove = () => {
    removeItem(item.id)
    toast('Item removed from cart', { icon: '🗑️' })
  }

  const handleMoveToWishlist = () => {
    if (!hasItem(item.productId)) {
      addToWishlist({
        id: item.productId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        currency: item.currency,
        image: item.image,
        slug: item.slug,
      })
    }
    removeItem(item.id)
    toast.success('Moved to wishlist!')
  }

  const itemTotal = (item.price + (item.hijabPrice ?? 0)) * item.quantity

  return (
    <div className={cn('flex gap-4', compact ? 'py-4' : 'py-6', 'border-b border-gray-100 last:border-0')}>
      {/* Image */}
      <Link href={`/products/${item.slug}`} className="flex-shrink-0 block">
        <div className={cn('relative bg-gray-50 overflow-hidden', compact ? 'w-16 h-20' : 'w-24 h-28 sm:w-28 sm:h-36')}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes={compact ? '64px' : '112px'}
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link href={`/products/${item.slug}`}>
            <h3 className={cn('font-heading font-medium text-[#111111] hover:text-[#C9A227] transition-colors line-clamp-2', compact ? 'text-sm' : 'text-base')}>
              {item.name}
            </h3>
          </Link>

          {/* Options */}
          <div className="mt-1 flex flex-wrap gap-2">
            {item.size && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                Size: {item.size}
              </span>
            )}
            {item.length && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                Length: {item.length}
              </span>
            )}
            {item.hijab && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                Hijab: {item.hijab}
              </span>
            )}
          </div>
        </div>

        {/* Price and controls */}
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          {/* Quantity */}
          {!compact && (
            <div className="flex items-center border border-gray-200">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-2 hover:bg-gray-50 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" aria-hidden="true" />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-[#111111] min-w-[40px] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-2 hover:bg-gray-50 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          )}

          {compact && (
            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
          )}

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold text-[#111111] text-sm">
              {formatINR(itemTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-400">
                {formatINR(item.price + (item.hijabPrice ?? 0))} each
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {!compact && (
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleMoveToWishlist}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#111111] transition-colors"
            >
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              Save for later
            </button>
            <span className="text-gray-200">|</span>
            <button
              onClick={handleRemove}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Remove
            </button>
          </div>
        )}

        {compact && (
          <button
            onClick={handleRemove}
            className="mt-1 self-start text-xs text-gray-400 hover:text-red-500 transition-colors"
            aria-label={`Remove ${item.name} from cart`}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
