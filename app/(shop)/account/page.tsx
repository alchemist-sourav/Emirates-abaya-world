'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Heart, MapPin, MessageCircle, ChevronRight, Star, Wallet } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist'
import { SITE_CONFIG, PRODUCTS } from '@/lib/data/products'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/product'

const RECENT_ORDERS = [
  { id: 'EM-10482', date: 'Aug 08, 2026', productIds: ['abaya-embroidered-gold', 'hijab-pearl-ivory'], total: 1180, status: 'Delivered' },
  { id: 'EM-10449', date: 'Jul 21, 2026', productIds: ['abaya-slip-dress'], total: 450, status: 'Delivered' },
  { id: 'EM-10396', date: 'Jul 03, 2026', productIds: ['abaya-emerald-luxury', 'abaya-modern-navy', 'hijab-silk-beige'], total: 1740, status: 'In Transit' },
]

const STATUS_STYLES: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  'In Transit': 'bg-blue-50 text-blue-700',
  Processing: 'bg-amber-50 text-amber-700',
}

const QUICK_LINKS = [
  { label: 'My Orders', desc: 'Track and manage your orders', href: '/account/orders', icon: Package },
  { label: 'My Wishlist', desc: 'Items you have saved for later', href: '/wishlist', icon: Heart },
  { label: 'Shipping Address', desc: 'Manage your delivery addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Contact Support', desc: 'We typically reply within 24 hours', href: '/contact', icon: MessageCircle },
]

function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export default function AccountPage() {
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const config = SITE_CONFIG

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Account header */}
        <div className="bg-[#111111] text-white rounded-2xl p-6 lg:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#C9A227] text-[#111111] flex items-center justify-center font-heading text-2xl font-bold">
              F
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] mb-1">
                Member since 2019
              </p>
              <h1 className="font-heading text-xl lg:text-2xl font-bold">Welcome back, Fatima M. Almansouri</h1>
              <p className="text-sm text-gray-400 mt-1">Discover what is new and pick up where you left off.</p>
            </div>
          </div>
          <Link href="/shop" className="inline-flex items-center justify-center bg-[#C9A227] text-[#111111] text-sm font-semibold px-7 py-3 rounded-full hover:bg-white transition-colors whitespace-nowrap">
            Continue Shopping
          </Link>
        </div>

        {/* Loyalty + stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#C9A227] to-[#a8841d] text-[#111111] rounded-2xl p-6 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 fill-current" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Loyalty Points</span>
            </div>
            <p className="font-heading text-3xl font-bold">5,250</p>
            <p className="text-xs font-medium mt-1">Worth {formatPrice(150)} in credit</p>
          </div>
          <Link href="/account/orders" className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#C9A227] transition-colors">
            <Wallet className="h-5 w-5 text-[#C9A227] mb-2" aria-hidden="true" />
            <p className="font-heading text-2xl font-bold text-[#111111]">{formatPrice(150)}</p>
            <p className="text-xs text-gray-500 mt-1">Available Credit</p>
          </Link>
          <Link href="/account/orders" className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#C9A227] transition-colors">
            <Package className="h-5 w-5 text-[#C9A227] mb-2" aria-hidden="true" />
            <p className="font-heading text-2xl font-bold text-[#111111]">24</p>
            <p className="text-xs text-gray-500 mt-1">Total Orders</p>
          </Link>
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-[#111111]">Recent Orders</h2>
            <Link href="/account/orders" className="text-xs font-semibold text-[#111111] underline hover:text-[#C9A227] transition-colors">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Products</th>
                  <th className="px-6 py-3 text-right">Total</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#111111]">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {order.productIds.slice(0, 3).map((pid) => {
                            const p = productById(pid)
                            if (!p) return null
                            return (
                              <span key={pid} className="h-9 w-9 rounded-full border-2 border-white overflow-hidden relative inline-block bg-[#F3EFE9]">
                                <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="36px" />
                              </span>
                            )
                          })}
                        </div>
                        <span className="ml-3 text-xs text-gray-500">
                          {order.productIds.length} {order.productIds.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-[#111111]">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Address + wishlist */}
        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#111111] flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C9A227]" aria-hidden="true" />
                Default Address
              </h2>
              <Link href="/account/addresses" className="text-xs font-semibold text-[#111111] underline hover:text-[#C9A227] transition-colors">
                Manage
              </Link>
            </div>
            <p className="text-sm font-semibold text-[#111111]">Fatima M. Almansouri</p>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              House 10/488, CDEF<br />
              Karunagappally, Kollam<br />
              Kerala - 690518
            </p>
            <p className="text-xs text-gray-500 mt-2">98XXX XXXXX</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#111111] flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#C9A227]" aria-hidden="true" />
                Wishlist
              </h2>
              <Link href="/wishlist" className="text-xs font-semibold text-[#111111] underline hover:text-[#C9A227] transition-colors">
                View all
              </Link>
            </div>
            {wishlistCount > 0 ? (
              <>
                <div className="flex -space-x-3 mb-3">
                  {useWishlistStore.getState().items.slice(0, 5).map((item) => (
                    <Link key={item.productId ?? item.id} href={`/products/${item.slug}`} className="h-12 w-12 rounded-full border-2 border-white overflow-hidden relative inline-block bg-[#F3EFE9] hover:border-[#C9A227] transition-colors">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {wishlistCount} saved {wishlistCount === 1 ? 'piece' : 'pieces'} waiting for the perfect moment.
                </p>
              </>
            ) : (
              <>
                <p className="font-heading text-2xl font-bold text-[#111111]">{wishlistCount}</p>
                <p className="text-sm text-gray-600 mt-1">
                  No saved pieces yet. Browse the collection to start your wishlist.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
          {QUICK_LINKS.map(({ label, desc, href, icon: Icon }) => (
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
          <a href={`tel:${config.whatsappNumber.replace(/[^\d+]/g, '')}`} className="text-[#111111] underline">{config.whatsappNumber}</a>{' '}
          or WhatsApp us anytime.
        </p>
      </div>
    </div>
  )
}