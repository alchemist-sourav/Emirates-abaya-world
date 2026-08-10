'use client'

import React, { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShoppingBag, Heart, Search, Menu, X,
  User, Store, ChevronDown, LayoutGrid
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useSearchStore } from '@/store/search'
import { SITE_CONFIG } from '@/lib/data/products'
import { cn } from '@/lib/utils'

interface NavChild {
  label: string
  href: string
}

interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/shop?tag=new' },
  { label: 'Prayer / Umrah', href: '/shop?tag=new&category=prayer-abayas' },
  { label: 'Bestsellers', href: '/shop?sort=best-selling' },
  { label: 'Clearance Sale', href: '/shop?sale=true' },
  {
    label: 'Abayas',
    href: '/shop?category=abayas',
    children: [
      { label: 'All Abayas', href: '/shop?category=abayas' },
      { label: 'Abaya Dresses', href: '/shop?category=abayas&subcategory=modern' },
      { label: 'Luxury Abayas', href: '/shop?category=luxury-abayas' },
      { label: 'Open Abayas', href: '/shop?category=open-abayas' },
      { label: 'Everyday Abayas', href: '/shop?category=everyday-abayas' },
      { label: 'Prayer Abayas', href: '/shop?category=prayer-abayas' },
    ],
  },
]

const SECONDARY_NAV: NavItem[] = [
  {
    label: 'Abaya Dresses',
    href: '/shop?category=abayas&subcategory=modern',
    children: [
      { label: 'All Abaya Dresses', href: '/shop?category=abayas&subcategory=modern' },
      { label: 'Everyday Abayas', href: '/shop?category=everyday-abayas' },
      { label: 'Party Abayas', href: '/shop?occasion=party' },
      { label: 'Wedding Abayas', href: '/shop?occasion=wedding' },
    ],
  },
  {
    label: 'Hijabs',
    href: '/shop?category=hijabs',
    children: [
      { label: 'All Hijabs', href: '/shop?category=hijabs' },
      { label: 'Matching Hijabs', href: '/shop?category=matching-hijabs' },
      { label: 'Georgette Hijabs', href: '/shop?category=hijabs&q=Georgette' },
      { label: 'Silk Hijabs', href: '/shop?category=hijabs&q=Silk' },
    ],
  },
  {
    label: 'Accessories',
    href: '/shop?category=accessories',
    children: [
      { label: 'All Accessories', href: '/shop?category=accessories' },
      { label: 'Handbags', href: '/shop?category=accessories&q=bag' },
      { label: 'Jewellery', href: '/shop?category=accessories&q=gold' },
    ],
  },
  { label: 'Reviews', href: '/shop?sort=rating-desc' },
  { label: 'Return & Exchange', href: '/returns' },
  { label: 'Login / Sign Up', href: '/account' },
]

const TERTIARY_NAV = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'About Us', href: '/about' },
]

const MOBILE_CATEGORIES = [
  { label: 'Abayas', href: '/shop?category=abayas' },
  { label: 'Hijabs', href: '/shop?category=hijabs' },
  { label: 'New', href: '/shop?tag=new' },
  { label: 'Best Sellers', href: '/shop?sort=best-selling' },
  { label: 'Prayer', href: '/shop?category=prayer-abayas' },
  { label: 'Offers', href: '/shop?sale=true' },
]

const MOBILE_NAV = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/shop?tag=new' },
  { label: 'Abayas', href: '/shop?category=abayas' },
  { label: 'Abaya Dresses', href: '/shop?category=abayas&subcategory=modern' },
  { label: 'Hijabs', href: '/shop?category=hijabs' },
  { label: 'Accessories', href: '/shop?category=accessories' },
  { label: 'Bestsellers', href: '/shop?sort=best-selling' },
  { label: 'Clearance Sale', href: '/shop?sale=true' },
  { label: 'Prayer / Umrah', href: '/shop?category=prayer-abayas' },
  { label: 'Reviews', href: '/shop?sort=rating-desc' },
  { label: 'Return & Exchange', href: '/returns' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'About Us', href: '/about' },
]

function NavLink({ item, compact = false }: { item: NavItem; compact?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const hasChildren = !!item.children?.length

  const base = cn(
    'relative py-2 inline-flex items-center gap-1 transition-colors whitespace-nowrap',
    compact ? 'text-[12px]' : 'text-[13px]',
    hasChildren ? 'font-medium' : 'font-normal'
  )

  return (
    <li
      className="relative"
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => hasChildren && setOpen(false)}
    >
      {hasChildren ? (
        <>
          <button
            className={cn(base, 'hover:text-[#C9A227] cursor-pointer')}
            onClick={(e) => {
              e.preventDefault()
              setOpen((o) => !o)
            }}
            aria-haspopup="true"
            aria-expanded={open}
          >
            {item.label}
            <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} aria-hidden="true" />
          </button>
          <ul
            className={cn(
              'absolute left-0 top-full z-50 min-w-[220px] bg-white border border-[#E5E5E5] shadow-md transition-all',
              open ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-1'
            )}
          >
            {item.children!.map((child) => (
              <li key={child.label + child.href}>
                <Link
                  href={child.href}
                  className="block px-4 py-2.5 text-[13px] text-[#444] hover:bg-[#F3E7E0] hover:text-[#111111] transition-colors"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Link
          href={item.href}
          className={cn(base, pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0])) ? 'text-[#C9A227] font-semibold' : 'text-[#444] hover:text-[#C9A227]')}
        >
          {item.label}
        </Link>
      )}
    </li>
  )
}

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
  const config = SITE_CONFIG

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      {/* ── Top Promotional Bar (Thin) ── */}
      <div className="bg-[#F3E7E0] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-medium text-[#444] py-1.5 tracking-wide">
            {config.announcement}
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5]">
        {/* ── Desktop Header ── */}
        <header className="hidden lg:block">
          {/* Row 1: Logo + Icons */}
          <div className="site-container">
            <div className="flex items-center justify-between h-[76px]">
              {/* Logo */}
              <Link href="/" className="flex flex-col" aria-label="Emirates Abaya World Home">
                <span className="font-heading text-[22px] font-bold tracking-wide leading-none">
                  <span className="text-[#C9A227]">EMIRATES</span>{' '}
                  <span className="text-[#111111]">ABAYA WORLD</span>
                </span>
                <span className="text-[8px] tracking-[0.34em] text-[#6B7280] uppercase font-medium mt-1 text-center">
                  Premium Modest Fashion · India
                </span>
              </Link>

              {/* Icons — one compact, vertically-centered group */}
              <div className="flex items-center gap-6">
                <button onClick={openSearch} className="p-2 text-[#111111] hover:text-[#C9A227] transition-colors flex items-center" aria-label="Search">
                  <Search className="h-[22px] w-[22px]" strokeWidth={1.4} />
                </button>
                <Link href="/account" className="p-2 text-[#111111] hover:text-[#C9A227] transition-colors flex items-center" aria-label="Account">
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

          {/* Row 2: Primary Nav — centered */}
          <div className="border-t border-[#E5E5E5]">
            <div className="site-container">
              <nav aria-label="Primary navigation">
                <ul className="flex items-center justify-center gap-8 h-[52px]">
                  {PRIMARY_NAV.map((item) => (
                    <NavLink key={item.label} item={item} />
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Row 3: Secondary Nav */}
          <div className="border-t border-[#E5E5E5] bg-white">
            <div className="site-container">
              <nav aria-label="Secondary navigation">
                <ul className="flex items-center justify-center gap-7 h-[48px]">
                  {SECONDARY_NAV.map((item) => (
                    <NavLink key={item.label} item={item} compact />
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Row 4: Tertiary Nav (tiny) */}
          <div className="border-t border-[#F0EEEC] bg-[#FDFBFA]">
            <div className="site-container">
              <nav aria-label="Utility navigation">
                <ul className="flex items-center justify-center gap-6 h-[38px]">
                  {TERTIARY_NAV.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-[11px] text-[#6B7280] hover:text-[#C9A227] transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </header>

        {/* ── Mobile Header ── */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-14 px-4 bg-white border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(true)}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.4} />
              </button>

              <Link href="/" className="flex flex-col" aria-label="Emirates Abaya World Home">
                <span className="font-heading text-[13px] font-bold tracking-wide leading-none whitespace-nowrap">
                  <span className="text-[#C9A227]">EMIRATES</span>{' '}
                  <span className="text-[#111111]">ABAYA WORLD</span>
                </span>
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

          {/* Mobile Horizontal Categories */}
          <div className="bg-white border-b border-[#E5E5E5] overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 px-3 py-2">
              {MOBILE_CATEGORIES.map(cat => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={cn(
                    'flex-shrink-0 px-3 py-1.5 text-[11px] font-medium border whitespace-nowrap transition-colors',
                    pathname.includes(cat.href.split('?')[0])
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'border-[#E5E5E5] text-[#444] hover:border-[#111111]'
                  )}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Slide-Out Menu ── */}
      <div
        className={cn('fixed inset-0 z-[60] lg:hidden', mobileOpen ? 'pointer-events-auto' : 'pointer-events-none')}
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
          'absolute left-0 top-0 h-full w-[300px] max-w-[88vw] bg-white flex flex-col shadow-xl transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] bg-[#111111]">
            <span className="font-heading text-base font-bold text-white">
              <span className="text-[#C9A227]">EMIRATES</span> ABAYA WORLD
            </span>
            <button onClick={() => setMobileOpen(false)} className="p-1.5 hover:bg-white/10 rounded" aria-label="Close menu">
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-2" aria-label="Mobile navigation">
            {MOBILE_NAV.map(item => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-5 py-3 text-[14px] font-medium border-b border-gray-100',
                  pathname === item.href ? 'bg-[#F3E7E0] text-[#111111]' : 'text-[#444] hover:bg-[#F7F4F1]'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
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
