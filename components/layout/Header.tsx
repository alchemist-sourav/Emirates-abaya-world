'use client'

import React, { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShoppingBag, Heart, Search, Menu, X,
  User, Store, ChevronRight, LayoutGrid
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useSearchStore } from '@/store/search'
import { SITE_CONFIG } from '@/lib/data/products'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'

const PRIMARY_NAV = [
  { label: 'Abayas', href: '/shop?category=abayas', gold: false },
  { label: 'Abaya Dresses', href: '/shop?category=abayas&subcategory=modern', gold: false },
  { label: 'Hijabs', href: '/shop?category=hijabs', gold: false },
  { label: 'Accessories', href: '/shop?category=accessories', gold: false },
  { label: 'Bestsellers', href: '/shop?sort=best-selling', gold: false },
  { label: 'New Arrivals', href: '/shop?tag=new', gold: false },
  { label: 'Clearance Sale', href: '/shop?sale=true', gold: true },
]

const DRAWER_PRIMARY = [
  { label: 'Abayas', href: '/shop?category=abayas' },
  { label: 'Abaya Dresses', href: '/shop?category=abayas&subcategory=modern' },
  { label: 'Hijabs', href: '/shop?category=hijabs' },
  { label: 'Accessories', href: '/shop?category=accessories' },
]

const DRAWER_SECONDARY = [
  { label: 'Bestsellers', href: '/shop?sort=best-selling', gold: false },
  { label: 'New Arrivals', href: '/shop?tag=new', gold: false },
  { label: 'Clearance Sale', href: '/shop?sale=true', gold: true },
  { label: 'Reviews', href: '/shop?sort=rating-desc', gold: false },
  { label: 'Return & Exchange Policy', href: '/returns', gold: false },
  { label: 'Login / Sign Up', href: '/account', gold: false },
  { label: 'Contact Us', href: '/contact', gold: false },
  { label: 'About Us', href: '/about', gold: false },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // True only after hydration so SSR HTML doesn't mismatch persisted store counts
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const cartCount = useCartStore(s => s.getItemCount())
  const wishlistCount = useWishlistStore(s => s.items.length)
  const { openSearch } = useSearchStore()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      {/* ── Top Promotional Bar (warm peach) ── */}
      <div className="bg-[#D4956A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-semibold text-white py-2 tracking-[0.14em] uppercase">
            {SITE_CONFIG.announcement}
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5]">
        {/* ── Header ── */}
        <header>
          <div className="site-container">
            <div className="flex items-center justify-between h-20">
              {/* Left: hamburger + ATELIER DUBAI */}
              <div className="flex items-center gap-3 w-1/3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <span className="hidden md:inline text-[10px] tracking-[0.3em] uppercase text-[#6B7280] font-medium">
                  Boutique Kerala
                </span>
              </div>

              {/* Center: EMIRATES* logo */}
              <div className="w-1/3 flex justify-center">
                <Logo />
              </div>

              {/* Right: icons */}
              <div className="flex items-center justify-end gap-1 sm:gap-2 w-1/3">
                <button onClick={openSearch} className="p-2 text-[#111111] hover:text-[#C9A227] transition-colors flex items-center" aria-label="Search">
                  <Search className="h-[22px] w-[22px]" strokeWidth={1.4} />
                </button>
                <Link href="/account" className="hidden sm:flex p-2 text-[#111111] hover:text-[#C9A227] transition-colors items-center" aria-label="Account">
                  <User className="h-[22px] w-[22px]" strokeWidth={1.4} />
                </Link>
                <Link href="/wishlist" className="relative p-2 text-[#111111] hover:text-[#C9A227] transition-colors flex items-center" aria-label={`Wishlist${isMounted && wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}>
                  <Heart className="h-[22px] w-[22px]" strokeWidth={1.4} />
                  {isMounted && wishlistCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 h-4 w-4 flex items-center justify-center bg-[#DC2626] text-white text-[9px] font-bold rounded-full">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>
                <Link href="/cart" className="relative p-2 text-[#111111] hover:text-[#C9A227] transition-colors flex items-center" aria-label={`Cart${isMounted && cartCount > 0 ? `, ${cartCount} items` : ''}`}>
                  <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.4} />
                  {isMounted && cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 h-4 w-4 flex items-center justify-center bg-[#111111] text-white text-[9px] font-bold rounded-full">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Nav row */}
          <div className="border-t border-[#F0EEEC] hidden lg:block">
            <div className="site-container">
              <nav aria-label="Primary navigation">
                <ul className="flex items-center justify-center gap-10 h-[52px]">
                  {PRIMARY_NAV.map((item) => {
                    const isActive =
                      pathname === item.href.split('?')[0] ||
                      (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]))
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={cn(
                            'text-[12px] font-medium tracking-[0.16em] uppercase transition-colors',
                            item.gold
                              ? 'text-[#C9A227] hover:text-[#D4956A]'
                              : isActive
                                ? 'text-[#C9A227]'
                                : 'text-[#111111] hover:text-[#C9A227]'
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </header>

        {/* ── Mobile Header Row ── */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-14 px-4 bg-white border-t border-[#F0EEEC]">
            <div className="flex items-center gap-2">
              <Link href="/" aria-label="EMIRATES — Home">
                <Logo size="sm" withSubline={false} />
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={openSearch} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded" aria-label="Search">
                <Search className="h-5 w-5" strokeWidth={1.4} />
              </button>
              <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded" aria-label={`Cart${isMounted && cartCount > 0 ? `, ${cartCount} items` : ''}`}>
                <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
                {isMounted && cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 h-4 w-4 flex items-center justify-center bg-[#111111] text-white text-[9px] font-bold rounded-full">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide-Out Navigation Drawer (all viewports) ── */}
      <div
        className={cn('fixed inset-0 z-[60]', mobileOpen ? 'pointer-events-auto' : 'pointer-events-none')}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div
          className={cn('absolute inset-0 bg-black/40 transition-opacity duration-300', mobileOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        <div className={cn(
          'absolute left-0 top-0 h-full w-[320px] max-w-[90vw] bg-white flex flex-col shadow-xl transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
            <Logo size="sm" withSubline={false} />
            <button onClick={() => setMobileOpen(false)} className="p-1.5 hover:bg-gray-100 rounded" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="px-5 pt-4">
            <button
              onClick={() => { setMobileOpen(false); openSearch() }}
              className="w-full flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-400 hover:border-[#C9A227] transition-colors text-left"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Search abayas, hijabs, dresses…
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-5" aria-label="Mobile navigation">
            <p className="text-[10px] tracking-[0.28em] uppercase text-gray-400 mb-2">Shop</p>
            <ul>
              {DRAWER_PRIMARY.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-3 text-[14px] font-medium text-[#111111] hover:text-[#C9A227] border-b border-gray-100 transition-colors"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-gray-300" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-[10px] tracking-[0.28em] uppercase text-gray-400 mt-5 mb-2">Discover</p>
            <ul>
              {DRAWER_SECONDARY.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block py-2.5 text-[13px] font-medium transition-colors',
                      item.gold ? 'text-[#C9A227]' : 'text-[#444] hover:text-[#C9A227]'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-[#E5E5E5] px-5 py-4 space-y-1">
            <Link href="/account" className="flex items-center gap-3 py-2.5 text-[13px] text-[#444] hover:text-[#111111]" onClick={() => setMobileOpen(false)}>
              <User className="h-4 w-4 text-[#C9A227]" /> My Account
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 py-2.5 text-[13px] text-[#444] hover:text-[#111111]" onClick={() => setMobileOpen(false)}>
              <Heart className="h-4 w-4 text-[#C9A227]" /> Wishlist {isMounted && wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className={cn(
        'fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#E5E5E5] pb-safe',
        pathname.startsWith('/products/') || pathname.startsWith('/product/') ? 'hidden' : 'block'
      )} aria-label="Bottom navigation">
        <div className="flex items-stretch h-14">
          {[
            { href: '/', icon: Store, label: 'Home' },
            { href: '/shop', icon: LayoutGrid, label: 'Shop' },
            { href: '/wishlist', icon: Heart, label: 'Wishlist', badge: isMounted ? wishlistCount : 0 },
            { href: '/cart', icon: ShoppingBag, label: 'Cart', badge: isMounted ? cartCount : 0 },
            { href: '/account', icon: User, label: 'Account' },
          ].map(({ href, icon: Icon, label, badge }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                  isActive ? 'text-[#C9A227]' : 'text-[#6B7280] hover:text-[#111111]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                {badge !== undefined && badge > 0 && (
                  <span className="absolute top-1 right-1/2 -translate-x-1/2 h-4 w-4 flex items-center justify-center bg-[#DC2626] text-white text-[8px] font-bold rounded-full">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}