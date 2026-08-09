'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { FilterSidebar, type FilterState } from '@/components/shop/FilterSidebar'
import { MobileFilters } from '@/components/shop/MobileFilters'
import { SortSelect } from '@/components/shop/SortSelect'
import { getProducts, getFilterOptions, type FilterOptions } from '@/lib/services/products'
import { PRODUCT_SORT_OPTIONS } from '@/types/product'
import type { Product } from '@/types/product'

const DEFAULT_PRICE_BOUNDS: [number, number] = [0, 22000]

function defaultFilters(bounds: [number, number]): FilterState {
  return {
    categories: [],
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

const PAGE_SIZE = 12

export function ShopClient() {
  const searchParams = useSearchParams()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [options, setOptions] = useState<FilterOptions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>(defaultFilters(DEFAULT_PRICE_BOUNDS))

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
      setFilters(defaultFilters(opts.priceBounds))
      setIsLoading(false)
    })
    return () => { cancelled = true }
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

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filtered.length

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

  const handleFiltersChange = (f: FilterState) => { setFilters(f); setPage(1) }
  const handleReset = () => { setFilters(defaultFilters(priceBounds)); setPage(1) }

  /* Derive page title */
  const title =
    sale === 'true' ? 'Deals & Offers'
    : tag === 'new' ? 'New Arrivals'
    : collection === 'luxury' ? 'Luxury Collection'
    : occasion ? (options?.occasions.find((o) => o.value === occasion)?.label ?? occasion.charAt(0).toUpperCase() + occasion.slice(1))
    : q ? `Results for "${q}"`
    : category ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'All Abayas & Hijabs'

  const sortLabel = PRODUCT_SORT_OPTIONS.find((o) => o.value === sort)?.label

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-[#E5E5E5] py-6">
        <div className="container-xl">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#111111] mb-1">
            {title}
          </h1>
          <p className="text-sm text-[#6B7280]">
            {isLoading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}
            {sortLabel && sort !== 'featured' && ` · Sorted by ${sortLabel}`}
          </p>
        </div>
      </div>

      <div className="container-xl py-6 lg:py-8">
        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <MobileFilters
              filters={filters}
              options={options}
              priceBounds={priceBounds}
              sort={sort}
              onChange={handleFiltersChange}
              onReset={handleReset}
              onSortChange={(v) => setSort(v)}
              resultCount={filtered.length}
              activeCount={activeCount}
            />
            <span className="text-sm text-[#6B7280] hidden sm:block">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </span>
          </div>
          <SortSelect value={sort} onChange={(v) => { setSort(v); setPage(1) }} />
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
              <ProductGridSkeleton count={8} />
            ) : paginated.length === 0 ? (
              <div className="py-20 text-center bg-white border border-[#E5E5E5]">
                <p className="text-xl text-[#111111] mb-2">No products found</p>
                <p className="text-[#6B7280] text-sm mb-6">Try adjusting or clearing your filters</p>
                <button onClick={handleReset} className="btn-primary btn-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <ProductGrid products={paginated} columns={3} priorityCount={6} />

                {hasMore && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="btn-secondary px-12 py-3.5 text-sm"
                    >
                      Load More&nbsp;
                      <span className="text-[#6B7280] font-normal">
                        ({filtered.length - paginated.length} remaining)
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
