'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { FilterSidebar, type FilterState } from '@/components/shop/FilterSidebar'
import { MobileFilters } from '@/components/shop/MobileFilters'
import { SortSelect } from '@/components/shop/SortSelect'
import { getProducts, getFilterOptions, type FilterOptions } from '@/lib/services/products'
import type { Product } from '@/types/product'
import { cn } from '@/lib/utils'

const DEFAULT_PRICE_BOUNDS: [number, number] = [0, 22000]

const HERO_IMAGE = '/images/products/shop-banner.jpg'

function defaultFilters(bounds: [number, number], categories: string[] = []): FilterState {
  return {
    categories,
    sizes: [],
    lengths: [],
    colors: [],
    fabrics: [],
    occasions: [],
    collection: '',
    price: [bounds[0], bounds[1]],
    rating: 0,
    availability: 'all',
    offersOnly: false,
  }
}

function sortProducts(products: Product[], sort: string): Product[] {
  const copy = [...products]
  switch (sort) {
    case 'newest':       return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'price-asc':    return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':   return copy.sort((a, b) => b.price - a.price)
    case 'best-rated':   return copy.sort((a, b) => b.rating - a.rating)
    case 'popularity':
    case 'best-selling': return copy.sort((a, b) => b.reviewCount - a.reviewCount)
    default:             return copy.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating)
  }
}

const PAGE_SIZE = 9

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return isDesktop
}

export function ShopClient() {
  const searchParams = useSearchParams()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [options, setOptions] = useState<FilterOptions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const [mobileCount, setMobileCount] = useState(PAGE_SIZE)
  const [filters, setFilters] = useState<FilterState>(defaultFilters(DEFAULT_PRICE_BOUNDS))
  const isDesktop = useIsDesktop()

  // URL params
  const q = searchParams.get('q')
  const category = searchParams.get('category')
  const sale = searchParams.get('sale')
  const tag = searchParams.get('tag')
  const collection = searchParams.get('collection')
  const occasion = searchParams.get('occasion')

  useEffect(() => {
    let cancelled = false
    Promise.all([getProducts(), getFilterOptions()]).then(([products, opts]) => {
      if (cancelled) return
      setAllProducts(products)
      setOptions(opts)
      // Respect the URL category on first load
      setFilters(defaultFilters(opts.priceBounds, category ? [category] : []))
      setIsLoading(false)
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep filters in sync when URL category changes (URL is an external system)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters((prev) => {
      const cats = category ? [category] : []
      return { ...prev, categories: cats }
    })
  }, [category])

  const priceBounds = options?.priceBounds ?? DEFAULT_PRICE_BOUNDS

  const filtered = useMemo(() => {
    let p = allProducts

    // URL-driven search
    if (q && q.trim().length >= 2) {
      const query = q.trim().toLowerCase()
      p = p.filter(
        (x) =>
          x.name.toLowerCase().includes(query) ||
          x.description.toLowerCase().includes(query) ||
          x.fabric.toLowerCase().includes(query) ||
          x.color.toLowerCase().includes(query) ||
          x.tags.some((t) => t.toLowerCase().includes(query)) ||
          (x.occasion && x.occasion.toLowerCase().includes(query))
      )
    }

    if (sale === 'true') p = p.filter((x) => x.isOnSale)
    if (tag === 'new') p = p.filter((x) => x.isNew)
    if (collection === 'featured') p = p.filter((x) => x.isFeatured)
    if (collection === 'luxury') p = p.filter((x) => x.subcategory === 'luxury-collection' || x.collection === 'luxury')
    if (occasion) p = p.filter((x) => x.occasion === occasion)

    if (filters.categories.length) p = p.filter((x) => filters.categories.includes(x.category))
    if (filters.sizes.length) p = p.filter((x) => x.sizes.some((s) => filters.sizes.includes(s.value)))
    if (filters.lengths.length) p = p.filter((x) => x.lengths.some((l) => filters.lengths.includes(l.value)))
    if (filters.colors.length) p = p.filter((x) => x.colors?.some((c) => filters.colors.includes(c.name)) ?? filters.colors.includes(x.color))
    if (filters.fabrics.length) p = p.filter((x) => filters.fabrics.includes(x.fabric))
    if (filters.occasions.length) p = p.filter((x) => x.occasion && filters.occasions.includes(x.occasion))
    if (filters.collection) p = p.filter((x) => x.collection === filters.collection || x.subcategory === filters.collection)

    const [min, max] = filters.price
    if (min !== priceBounds[0] || max !== priceBounds[1]) {
      p = p.filter((x) => x.price >= min && x.price <= max)
    }

    if (filters.rating > 0) p = p.filter((x) => x.rating >= filters.rating)
    if (filters.availability === 'in-stock') p = p.filter((x) => x.stock > 0)
    if (filters.offersOnly) p = p.filter((x) => x.isOnSale)

    return sortProducts(p, sort)
  }, [allProducts, filters, sort, q, sale, tag, collection, occasion, priceBounds])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const desktopPage = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const mobileVisible = filtered.slice(0, mobileCount)
  const displayed = isDesktop ? desktopPage : mobileVisible
  const hasMoreMobile = mobileCount < filtered.length

  const activeCount =
    filters.categories.length +
    filters.sizes.length +
    filters.lengths.length +
    filters.colors.length +
    filters.fabrics.length +
    filters.occasions.length +
    (filters.collection ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.offersOnly ? 1 : 0) +
    ((filters.price[0] !== priceBounds[0] || filters.price[1] !== priceBounds[1]) ? 1 : 0)

  const handleFiltersChange = (f: FilterState) => { setFilters(f); setPage(1); setMobileCount(PAGE_SIZE) }
  const handleReset = () => { setFilters(defaultFilters(priceBounds)); setPage(1); setMobileCount(PAGE_SIZE) }
  const handleSortChange = (v: string) => { setSort(v); setPage(1); setMobileCount(PAGE_SIZE) }

  /* Derive page title */
  const categoryTitle = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : ''
  const shortTitle =
    sale === 'true' ? 'Deals & Offers'
    : tag === 'new' ? 'New Arrivals'
    : collection === 'luxury' ? 'Luxury Collection'
    : occasion ? (options?.occasions.find((o) => o.value === occasion)?.label ?? occasion.charAt(0).toUpperCase() + occasion.slice(1))
    : q ? `Results for "${q}"`
    : category === 'abayas' ? 'Abayas'
    : categoryTitle || 'Abayas'

  const fullTitle =
    sale === 'true' ? 'Deals & Offers'
    : tag === 'new' ? 'New Arrivals'
    : collection === 'luxury' ? 'Luxury Collection'
    : occasion ? (options?.occasions.find((o) => o.value === occasion)?.label ?? occasion.charAt(0).toUpperCase() + occasion.slice(1))
    : q ? `Results for "${q}"`
    : 'Abayas Collection'

  const subtitle =
    sale === 'true' ? 'Limited-time savings on handcrafted pieces.'
    : tag === 'new' ? 'Fresh from the atelier — the latest silhouettes.'
    : collection === 'luxury' ? 'Hand-finished masterpieces for grand occasions.'
    : 'Handcrafted premium abayas, draped and stitched in our Kerala atelier.'

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* ── Hero banner ── */}
      <div className="relative bg-[#111111] text-white overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Abayas Collection — premium modest fashion"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" aria-hidden="true" />
        <div className="container-xl relative pt-12 lg:pt-16 pb-14 lg:pb-20 text-center">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-[11px] text-white/60 uppercase tracking-wider mb-5">
            <Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="text-[#C9A227]" aria-current="page">Shop</span>
          </nav>
          <span className="font-heading italic text-[12px] sm:text-sm tracking-[0.35em] uppercase text-[#C9A227] block mb-3">
            The Emirates Collection
          </span>
          <h1 className="font-heading italic text-3xl sm:text-4xl lg:text-5xl font-semibold">
            <span className="lg:hidden">{shortTitle}</span>
            <span className="hidden lg:inline">{fullTitle}</span>
          </h1>
          <p className="text-white/75 text-sm mt-3 max-w-xl mx-auto">{subtitle}</p>
          <p className="text-[#C9A227] text-[12px] mt-4 font-medium tracking-wide">
            {isLoading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}
          </p>
        </div>
      </div>

      <div className="container-xl py-6 lg:py-8">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <MobileFilters
              filters={filters}
              options={options}
              priceBounds={priceBounds}
              sort={sort}
              onChange={handleFiltersChange}
              onReset={handleReset}
              onSortChange={handleSortChange}
              resultCount={filtered.length}
              activeCount={activeCount}
            />
            <span className="text-sm text-[#111111] font-semibold hidden sm:block">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280] hidden sm:inline">Sort by:</span>
            <SortSelect value={sort} onChange={handleSortChange} />
          </div>
        </div>

        <div className="flex gap-8 lg:gap-10 items-start">
          {/* Desktop filter sidebar */}
          <FilterSidebar
            filters={filters}
            options={options}
            priceBounds={priceBounds}
            onChange={handleFiltersChange}
            onReset={handleReset}
            activeCount={activeCount}
            className="hidden lg:block"
          />

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <ProductGridSkeleton count={9} />
            ) : displayed.length === 0 ? (
              <div className="py-20 text-center bg-white border border-[#E5E5E5]">
                <p className="text-xl text-[#111111] mb-2">No products found</p>
                <p className="text-[#6B7280] text-sm mb-6">Try adjusting or clearing your filters</p>
                <button onClick={handleReset} className="btn-primary btn-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <ProductGrid products={displayed} columns={3} priorityCount={6} />

                {/* Mobile: Load More Products */}
                {!isDesktop && hasMoreMobile && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setMobileCount((c) => c + PAGE_SIZE)}
                      className="btn-secondary px-10 py-3.5 text-sm"
                    >
                      Load More Products
                    </button>
                  </div>
                )}

                {/* Desktop: numbered pagination */}
                {isDesktop && totalPages > 1 && (
                  <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 text-[#111111] hover:bg-[#111111] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors rounded-full"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        aria-current={page === n ? 'page' : undefined}
                        className={cn(
                          'w-10 h-10 flex items-center justify-center text-sm font-medium border transition-colors rounded-full',
                          page === n
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'border-gray-300 text-[#111111] hover:border-[#111111]'
                        )}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 text-[#111111] hover:bg-[#111111] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors rounded-full"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
