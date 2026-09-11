'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Package, Heart, MapPin, MessageCircle, ChevronRight, Star, Wallet, LogOut, Loader2 } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatPrice, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const STATUS_STYLES: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-50 text-blue-700',
  Processing: 'bg-amber-50 text-amber-700',
  Pending: 'bg-yellow-50 text-yellow-700',
  Cancelled: 'bg-red-50 text-red-700',
  Refunded: 'bg-purple-50 text-purple-700',
}

const QUICK_LINKS = [
  { label: 'My Orders', desc: 'Track and manage your orders', href: '/account/orders', icon: Package },
  { label: 'My Wishlist', desc: 'Items you have saved for later', href: '/wishlist', icon: Heart },
  { label: 'Shipping Address', desc: 'Manage your delivery addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Contact Support', desc: 'We typically reply within 24 hours', href: '/contact', icon: MessageCircle },
]

export default function AccountPage() {
  const router = useRouter()
  const supabase = createClient()
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const config = SITE_CONFIG

  const [loading, setLoading] = useState(true)/* eslint-disable @typescript-eslint/no-explicit-any */
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [address, setAddress] = useState<any>(null)/* eslint-enable @typescript-eslint/no-explicit-any */

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // 1. Fetch Profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(userProfile)

        // 2. Fetch Recent Orders with items
        const { data: userOrders } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
        setOrders(userOrders || [])

        // 3. Fetch Default Address
        const { data: userAddress } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .maybeSingle()
        setAddress(userAddress)
      } catch (error) {
        console.error('Error loading account data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase, router])

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="bg-[#F8F6F2] min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-[#C9A227] animate-spin" aria-hidden="true" />
        <p className="text-sm font-medium text-gray-500">Loading your account details...</p>
      </div>
    )
  }

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'Maison Guest'
  const memberYear = profile?.created_at ? new Date(profile.created_at).getFullYear() : 2026

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Account header */}
        <div className="bg-[#111111] text-white rounded-2xl p-6 lg:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#C9A227] text-[#111111] flex items-center justify-center font-heading text-2xl font-bold uppercase">
              {displayName.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] mb-1">
                Member since {memberYear}
              </p>
              <h1 className="font-heading text-xl lg:text-2xl font-bold">Welcome back, {displayName}</h1>
              <p className="text-sm text-gray-400 mt-1">Discover what is new and pick up where you left off.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 justify-center border border-gray-700 text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </button>
            <Link href="/shop" className="inline-flex items-center justify-center bg-[#C9A227] text-[#111111] text-sm font-semibold px-7 py-3 rounded-full hover:bg-white transition-colors whitespace-nowrap">
              Continue Shopping
            </Link>
          </div>
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
            <p className="font-heading text-2xl font-bold text-[#111111]">{orders.length}</p>
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
            {orders.length > 0 ? (
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
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#111111]">{order.order_number}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            {order.order_items?.slice(0, 3).map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
                              <span key={item.id} className="h-9 w-9 rounded-full border-2 border-white overflow-hidden relative inline-block bg-[#F3EFE9]">
                                {item.product_image ? (
                                  <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="36px" />
                                ) : (
                                  <div className="h-full w-full bg-[#111111]/10" />
                                )}
                              </span>
                            ))}
                          </div>
                          <span className="ml-3 text-xs text-gray-500">
                            {order.order_items?.length || 0} {order.order_items?.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-[#111111]">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_STYLES[order.order_status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                You have not placed any orders yet.
              </div>
            )}
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
            {address ? (
              <>
                <p className="text-sm font-semibold text-[#111111]">{address.first_name} {address.last_name}</p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {address.house}, {address.area}<br />
                  {address.landmark && `${address.landmark}, `}{address.city}<br />
                  {address.state}, {address.country} - {address.pin_code}
                </p>
                <p className="text-xs text-gray-500 mt-2">{address.phone}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500 leading-relaxed py-3">
                No default shipping address set. Click Manage to add one.
              </p>
            )}
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

        <p className="text-xs text-gray-500 mt-8 text-center sm:text-left">
          Need assistance? Email us at{' '}
          <a href={`mailto:${config.supportEmail}`} className="text-[#111111] underline hover:text-[#C9A227] transition-colors">{config.supportEmail}</a>
          {' '}or call client care at +91 81299 14915.
        </p>
      </div>
    </div>
  )
}