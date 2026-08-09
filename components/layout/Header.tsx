'use client'

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShoppingBag, Heart, Search, Menu, X,
  ChevronDown, User, Package, Home, LayoutGrid, Tag,
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useSearchStore } from '@/store/search'
import { SITE_CONFIG } from '@/lib/data/products'
import { formatINR } from '@/lib/utils'
import { cn } from '@/lib/utils'

const ABAYA_DROPDOWN = [
  { label: 'All Abayas',        href: '/shop?category=abayas' },
  { label: 'Open Abayas',       href: '/shop?category=open-abayas' },
  { label: 'Everyday Abayas',   href: '/shop?category=everyday-abayas' },
  { label: 'Luxury Abayas',     href: '/shop?category=luxury-abayas' },
  { label: 'Party Abayas',      href: '/shop?category=abayas&occasion=party' },
  { label: 'Prayer Abayas',     href: '/shop?category=prayer-abayas' },
  { label: 'Embroidered Abayas',href: '/shop?tag=Embroidered' },
]

const CAT_NAV = [
  { label: 'Women',             href: '/shop' },
  { label: 'Abayas',            href: '/shop?category=abayas', dropdown: ABAYA_DROPDOWN },
  { label: 'Hijabs',            href: '/shop?category=hijabs' },
  { label: 'New Arrivals',      href: '/shop?tag=new' },
  { label: 'Best Sellers',      href: '/shop?sort=best-selling' },
  { label: 'Luxury Collection', href: '/shop?collection=luxury' },
  { label: 'Offers',            href: '/shop?sale=true', highlight: true },
  { label: 'Track Order',       href: '/account/orders' },
  { label: 'Contact',           href: '/contact' },
]

const MOBILE_CATS = [
  { label: 'Abayas',      href: '/shop?category=abayas' },
  { label: 'Hijabs',      href: '/shop?category=hijabs' },
  { label: 'New',         href: '/shop?tag=new' },
  { label: 'Best Sellers',href: '/shop?sort=best-selling' },
  { label: 'Offers',      href: '/shop?sale=true' },
  { label: 'Prayer',      href: '/shop?category=prayer-abayas' },
  { label: 'Eid',         href: '/shop?occasion=eid' },
  { label: 'Luxury',      href: '/shop?collection=luxury' },
]

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled]         = useState(false)
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // True after hydration so SSR HTML doesn't mismatch client state (cart/wishlist persisted in localStorage)
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const cartCount     = useCartStore(s => s.getItemCount())
  const openCartDrawer = useCartStore(s => s.openDrawer)
  const wishlistCount = useWishlistStore(s => s.items.length)
  const { openSearch } = useSearchStore()
  const config = SITE_CONFIG

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 4)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu / dropdowns when the route changes (URL is an external system)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const openDrop  = (label: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
    setActiveDropdown(label)
  }
  const closeDrop = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 80)
  }

  return (
    <>
      {/* ── Fixed header wrapper ── */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 bg-white transition-shadow duration-300',
          isScrolled ? 'shadow-[0_2px_16px_rgba(0,0,0,0.10)]' : '',
        )}
        role="banner"
      >
        {/* ROW 1 — Announcement bar */}
        {announcementVisible && (
          <div className="bg-[#111111] text-white relative">
            <p className="text-center py-1.5 text-[11px] tracking-wide px-8">
              {[
                config.claims.freeShipping && `Free Shipping above ${formatINR(config.freeShippingAbove)}`,
                config.claims.codAvailable && 'COD Available',
                config.claims.easyReturns && 'Easy 14-day Returns',
                config.claims.fastDelivery && 'Pan-India Delivery',
              ].filter(Boolean).join(' · ')}
            </p>
            <button
              onClick={() => setAnnouncementVisible(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-60 hover:opacity-100"
              aria-label="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* ROW 2 — Logo + Search + Icons */}
        <div className="border-b border-[#E5E5E5] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* DESKTOP ROW */}
            <div className="hidden lg:flex items-center gap-5 py-3">
              {/* Logo */}
              <Link href="/" className="flex flex-col flex-shrink-0" aria-label="Emirates Abaya World Home">
                <span className="font-heading text-[18px] font-bold text-[#111111] leading-none tracking-tight">
                  Emirates Abaya World
                </span>
                <span className="text-[8px] tracking-[0.3em] text-[#C9A227] uppercase font-semibold mt-[3px]">
                  Premium Modest Fashion
                </span>
              </Link>

              {/* Search bar */}
              <div className="flex-1 flex items-stretch h-[42px] border border-[#C9A227] overflow-hidden">
                <button
                  onClick={openSearch}
                  className="flex-1 flex items-center px-4 text-gray-400 text-sm bg-white hover:bg-gray-50 text-left gap-3"
                  aria-label="Open search"
                >
                  <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-400 text-[13px]">Search for abayas, hijabs and more...</span>
                </button>
                <button
                  onClick={openSearch}
                  className="px-5 bg-[#C9A227] hover:bg-[#D4AF37] text-[#111111] font-semibold text-sm flex items-center transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              {/* Icons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link href="/account" className="flex flex-col items-center px-2.5 py-1 hover:text-[#C9A227] transition-colors group">
                  <User className="h-5 w-5 text-[#444]  group-hover:text-[#C9A227]" />
                  <span className="text-[10px] text-[#444] group-hover:text-[#C9A227] mt-0.5 font-medium">Account</span>
                </Link>
                <Link href="/account/orders" className="flex flex-col items-center px-2.5 py-1 hover:text-[#C9A227] transition-colors group">
                  <Package className="h-5 w-5 text-[#444] group-hover:text-[#C9A227]" />
                  <span className="text-[10px] text-[#444] group-hover:text-[#C9A227] mt-0.5 font-medium">Orders</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="relative flex flex-col items-center px-2.5 py-1 hover:text-[#C9A227] transition-colors group"
                  aria-label={`Wishlist${isMounted && wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
                >
                  <Heart className="h-5 w-5 text-[#444] group-hover:text-[#C9A227]" />
                  {isMounted && wishlistCount > 0 && (
                    <span className="absolute top-0 right-1 h-[14px] w-[14px] flex items-center justify-center bg-[#DC2626] text-white text-[8px] font-bold rounded-full">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                  <span className="text-[10px] text-[#444] group-hover:text-[#C9A227] mt-0.5 font-medium">Wishlist</span>
                </Link>
                <Link
                  href="/cart"
                  className="relative flex items-center gap-2 ml-1 h-[42px] px-4 bg-[#111111] text-white text-sm font-semibold hover:bg-[#1a1a1a] transition-colors"
                  aria-label={`Cart${isMounted && cartCount > 0 ? `, ${cartCount} items` : ''}`}
                >
                  <ShoppingBag className="h-[17px] w-[17px]" />
                  <span className="text-[13px]">Cart</span>
                  {isMounted && cartCount > 0 && (
                    <span className="flex items-center justify-center h-5 w-5 bg-[#C9A227] text-[#111] text-[10px] font-bold rounded-full">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* MOBILE ROW */}
            <div className="flex lg:hidden items-center h-14 gap-2">
              <button
                onClick={() => setMobileOpen(true)}
                className="w-10 h-10 flex items-center justify-center -ml-1.5 hover:bg-gray-50"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link href="/" className="flex-1 flex flex-col items-center">
                <span className="font-heading text-[15px] font-bold text-[#111111] leading-none">Emirates Abaya World</span>
                <span className="text-[7px] tracking-[0.25em] text-[#C9A227] uppercase font-semibold mt-0.5">Premium Modest Fashion</span>
              </Link>

              <button onClick={openSearch} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={openCartDrawer}
                className="relative w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                aria-label={`Cart${isMounted && cartCount > 0 ? `, ${cartCount} items` : ''}`}
              >
                <ShoppingBag className="h-5 w-5" />
                {isMounted && cartCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center bg-[#DC2626] text-white text-[8px] font-bold rounded-full">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ROW 3 — Category nav (desktop only) */}
        <div className="hidden lg:block bg-[#111111]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center h-10" aria-label="Category navigation">
              {/* All Categories */}
              <button className="flex items-center gap-1.5 pr-4 mr-2 border-r border-white/20 text-white text-[13px] font-semibold hover:text-[#C9A227] transition-colors h-full">
                <LayoutGrid className="h-3.5 w-3.5" />
                All Categories
              </button>

              {CAT_NAV.map(link => (
                <div
                  key={link.label}
                  className="relative h-full"
                  onMouseEnter={() => link.dropdown && openDrop(link.label)}
                  onMouseLeave={() => link.dropdown && closeDrop()}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-0.5 px-3 h-full text-[12.5px] font-medium transition-colors whitespace-nowrap',
                      link.highlight
                        ? 'text-[#C9A227] hover:text-[#D4AF37]'
                        : 'text-gray-200 hover:text-white',
                    )}
                  >
                    {link.label}
                    {link.dropdown && (
                      <ChevronDown className={cn('h-3 w-3 transition-transform', activeDropdown === link.label && 'rotate-180')} />
                    )}
                  </Link>

                  {link.dropdown && activeDropdown === link.label && (
                    <div
                      className="absolute top-full left-0 w-52 bg-white border border-[#E5E5E5] shadow-lg z-50 py-1"
                      onMouseEnter={() => openDrop(link.label)}
                      onMouseLeave={() => closeDrop()}
                    >
                      {link.dropdown.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2.5 text-[13px] text-[#444] hover:bg-[#F8F6F2] hover:text-[#111111] transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* MOBILE — horizontal category pills */}
        <div className="lg:hidden bg-white border-b border-[#E5E5E5] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 px-4 py-2 w-max">
            {MOBILE_CATS.map(cat => (
              <Link
                key={cat.href}
                href={cat.href}
                className={cn(
                  'flex-shrink-0 px-3 py-1 text-[12px] font-medium border transition-colors whitespace-nowrap',
                  pathname.includes(cat.href.split('?')[0]) && cat.href !== '/shop'
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'border-[#E5E5E5] text-[#444] hover:border-[#111111]',
                )}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* ── Height spacer ── */}
      <div
        className={cn('lg:hidden', announcementVisible ? 'h-[132px]' : 'h-[108px]')}
        aria-hidden="true"
      />
      <div
        className={cn('hidden lg:block', announcementVisible ? 'h-[148px]' : 'h-[125px]')}
        aria-hidden="true"
      />

      {/* ── Mobile drawer ── */}
      <div
        className={cn('fixed inset-0 z-[60] lg:hidden', mobileOpen ? 'pointer-events-auto' : 'pointer-events-none')}
        role="dialog" aria-modal="true" aria-label="Navigation menu"
      >
        <div
          className={cn('absolute inset-0 bg-black/40 transition-opacity duration-300', mobileOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div className={cn(
          'absolute left-0 top-0 h-full w-[300px] max-w-[88vw] bg-white flex flex-col shadow-2xl transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] bg-[#111111]">
            <span className="font-heading text-base font-bold text-white">Emirates Abaya World</span>
            <button onClick={() => setMobileOpen(false)} className="p-1.5 hover:bg-white/10 rounded" aria-label="Close menu">
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto" aria-label="Mobile navigation">
            {CAT_NAV.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'flex items-center justify-between px-5 py-3.5 text-[14px] font-medium border-b border-gray-50 transition-colors',
                  link.highlight ? 'text-[#C9A227]' : 'text-[#333] hover:bg-[#F8F6F2]',
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
                {link.highlight && <Tag className="h-3.5 w-3.5" />}
              </Link>
            ))}
          </nav>

          {/* Account links */}
          <div className="border-t border-[#E5E5E5] px-5 py-4 space-y-1">
            <Link href="/account" className="flex items-center gap-3 py-2.5 text-[13px] text-[#444] hover:text-[#111]" onClick={() => setMobileOpen(false)}>
              <User className="h-4 w-4 text-[#C9A227]" /> My Account
            </Link>
            <Link href="/account/orders" className="flex items-center gap-3 py-2.5 text-[13px] text-[#444] hover:text-[#111]" onClick={() => setMobileOpen(false)}>
              <Package className="h-4 w-4 text-[#C9A227]" /> My Orders
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 py-2.5 text-[13px] text-[#444] hover:text-[#111]" onClick={() => setMobileOpen(false)}>
              <Heart className="h-4 w-4 text-[#C9A227]" /> Wishlist {isMounted && wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom navigation (mobile) ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#E5E5E5] pb-safe"
        aria-label="Bottom navigation"
      >
        <div className="flex items-stretch h-16">
          {[
            { href: '/',          icon: Home,        label: 'Home' },
            { href: '/shop',      icon: LayoutGrid,  label: 'Categories' },
            { href: '/wishlist',  icon: Heart,       label: 'Wishlist',  badge: isMounted ? wishlistCount : 0 },
            { href: '/cart',      icon: ShoppingBag, label: 'Cart',      badge: isMounted ? cartCount : 0 },
            { href: '/account',   icon: User,        label: 'Account' },
          ].map(({ href, icon: Icon, label, badge }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                  isActive ? 'text-[#C9A227]' : 'text-[#6B7280] hover:text-[#111111]',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                {badge !== undefined && badge > 0 && (
                  <span className="absolute top-2 right-[calc(50%-14px)] h-4 w-4 flex items-center justify-center bg-[#DC2626] text-white text-[8px] font-bold rounded-full">
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
