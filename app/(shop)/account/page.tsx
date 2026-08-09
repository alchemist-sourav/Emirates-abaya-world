'use client'

import React from 'react'
import Link from 'next/link'
import { Package, Heart, MapPin, MessageCircle, ChevronRight } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist'
import { SITE_CONFIG } from '@/lib/data/products'

const ACCOUNT_LINKS = [
  { label: 'My Orders', desc: 'Track and manage your orders', href: '/account/orders', icon: Package },
  { label: 'My Wishlist', desc: 'Items you have saved for later', href: '/wishlist', icon: Heart },
  { label: 'Shipping Address', desc: 'Manage your delivery addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Contact Support', desc: 'We typically reply within 24 hours', href: '/contact', icon: MessageCircle },
]

export default function AccountPage() {
  const wishlistCount = useWishlistStore(s => s.items.length)
  const config = SITE_CONFIG

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Account header */}
        <div className="bg-[#111111] text-white rounded-lg p-6 lg:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#C9A227] text-[#111111] flex items-center justify-center font-heading text-xl font-bold">
              G
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold">Hello, Guest</h1>
              <p className="text-sm text-gray-400">Sign in to sync your orders and wishlist across devices.</p>
            </div>
          </div>
          <Link href="/shop" className="btn-gold">
            Start Shopping
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/account/orders" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#C9A227] transition-colors">
            <p className="font-heading text-2xl font-bold text-[#111111]">0</p>
            <p className="text-xs text-gray-500 mt-1">Active Orders</p>
          </Link>
          <Link href="/account/orders" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#C9A227] transition-colors">
            <p className="font-heading text-2xl font-bold text-[#111111]">0</p>
            <p className="text-xs text-gray-500 mt-1">Pending Returns</p>
          </Link>
          <Link href="/wishlist" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#C9A227] transition-colors col-span-2 sm:col-span-1">
            <p className="font-heading text-2xl font-bold text-[#111111]">{wishlistCount}</p>
            <p className="text-xs text-gray-500 mt-1">Items in Wishlist</p>
          </Link>
        </div>

        {/* Links */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
          {ACCOUNT_LINKS.map(({ label, desc, href, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group">
              <div className="h-10 w-10 rounded-full bg-[#F8F6F2] flex items-center justify-center">
                <Icon className="h-5 w-5 text-[#C9A227]" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#111111] text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#C9A227] transition-colors" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Need help? Reach us at{' '}
          <a href={`tel:${config.whatsappNumber}`} className="text-[#111111] underline">{config.whatsappNumber}</a>{' '}
          or WhatsApp us anytime.
        </p>
      </div>
    </div>
  )
}
