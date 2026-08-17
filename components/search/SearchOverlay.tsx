'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Clock, TrendingUp, ChevronRight, Tag, LayoutGrid } from 'lucide-react'
import { useSearchStore } from '@/store/search'
import { searchProducts, POPULAR_SEARCHES } from '@/lib/services/products'
import { CATEGORIES } from '@/lib/data/products'
import type { Product } from '@/types/product'
import { cn, formatPrice } from '@/lib/utils'
import Image from 'next/image'

// Quick category chips shown when the search box is empty
const QUICK_CATEGORIES = [
  { label: 'Abayas', slug: 'abayas' },
  { label: 'Luxury Abayas', slug: 'luxury-abayas' },
  { label: 'Hijabs', slug: 'hijabs' },
  { label: 'Everyday Abayas', slug: 'everyday-abayas' },
  { label: 'Prayer Abayas', slug: 'prayer-abayas' },
  { label: 'Offers', slug: 'sale' },
] as const

export function SearchOverlay() {
  const {
    isOpen,
    closeSearch,
    query,
    setQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useSearchStore()

  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Auto-focus input whenever the overlay opens
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(id)
    }
  }, [isOpen])

  // Debounced search – fires 250 ms after the user stops typing
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) return

    let cancelled = false
    const timer = setTimeout(async () => {
      if (cancelled) return
      setIsLoading(true)
      const res = await searchProducts(trimmed)
      if (!cancelled) {
        setResults(res.slice(0, 6))
        setIsLoading(false)
      }
    }, 250)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [query])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeSearch])

  // ── Actions ──────────────────────────────────────────────────────────────────

  /** Navigate to shop search results page */
  const handleSearch = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    addRecentSearch(trimmed)
    closeSearch()
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`)
  }

  /** Navigate to product detail page */
  const handleProductClick = (slug: string) => {
    closeSearch()
    router.push(`/products/${slug}`)
  }

  /** Navigate to a quick category */
  const handleCategoryClick = (slug: string) => {
    closeSearch()
    router.push(`/shop?category=${slug}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  // ── Derived state ─────────────────────────────────────────────────────────

  const hasQuery = query.trim().length >= 2
  const noResults = hasQuery && !isLoading && results.length === 0

  // Categories matching the query (data-driven)
  const matchingCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return CATEGORIES.filter((c) => c.isActive && (c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)))
  }, [query])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Slide-down panel ───────────────────────────────────────────────── */}
      <div
        aria-hidden={!isOpen}
        className={cn(
          // Positioning & layering
          'fixed top-0 left-0 right-0 z-[100]',
          // Slide animation
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        {/* White card */}
        <div className="bg-white shadow-xl">
          <div className="max-w-4xl mx-auto px-4 py-4">

            {/* ── Section 1: Search bar ─────────────────────────────────────── */}
            <form onSubmit={handleSubmit} role="search" className="relative flex items-center">
              {/* Search icon */}
              <Search
                className="absolute left-4 h-5 w-5 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />

              {/* Text input */}
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for abayas, hijabs and more..."
                aria-label="Search products"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className={cn(
                  'w-full pl-12 pr-24 py-3.5',
                  'text-[#111111] text-base placeholder:text-gray-400',
                  'border-2 border-gray-200 rounded-lg',
                  'focus:outline-none focus:border-[#C9A227]',
                  'transition-colors duration-200',
                )}
              />

              {/* Clear button – only visible when there's input */}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-14 p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Submit / Search button */}
              <button
                type="submit"
                aria-label="Submit search"
                className={cn(
                  'absolute right-2',
                  'flex items-center gap-1.5 px-3 py-2',
                  'bg-[#111111] text-white text-sm font-medium rounded-md',
                  'hover:bg-[#C9A227] hover:text-[#111111]',
                  'transition-colors duration-200',
                )}
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            {/* ── Section 2: Results panel (shown only when overlay is open) ── */}
            {isOpen && (
              <div className="mt-4 pb-2">

                {/* ── EMPTY QUERY STATE ──────────────────────────────────────── */}
                {!hasQuery && (
                  <div className="space-y-5">

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            Recent Searches
                          </span>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                          >
                            Clear
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleSearch(term)}
                              className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5',
                                'bg-gray-100 hover:bg-gray-200 rounded-full',
                                'text-sm text-gray-700 transition-colors',
                              )}
                            >
                              <Clock className="h-3 w-3 text-gray-400" aria-hidden="true" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div>
                      <span className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                        Popular Searches
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className={cn(
                              'flex items-center gap-1.5 px-3 py-1.5',
                              'bg-[#F8F6F2] hover:bg-[#EDE9E0] rounded-full',
                              'text-sm text-gray-700 transition-colors',
                            )}
                          >
                            <Tag className="h-3 w-3 text-[#C9A227]" aria-hidden="true" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Categories */}
                    <div>
                      <span className="block mb-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Shop by Category
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {QUICK_CATEGORIES.map(({ label, slug }) => (
                          <button
                            key={slug}
                            onClick={() => handleCategoryClick(slug)}
                            className={cn(
                              'flex items-center gap-1 px-4 py-1.5',
                              'border border-gray-200 hover:border-[#C9A227] rounded-full',
                              'text-sm text-gray-700 hover:text-[#111111]',
                              'bg-white hover:bg-[#FEFBF4]',
                              'transition-colors duration-150',
                            )}
                          >
                            {label}
                            <ChevronRight className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── LOADING STATE ──────────────────────────────────────────── */}
                {hasQuery && isLoading && (
                  <div className="flex items-center justify-center py-8 gap-3 text-gray-500">
                    {/* Spinner */}
                    <svg
                      className="h-5 w-5 animate-spin text-[#C9A227]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span className="text-sm">Searching…</span>
                  </div>
                )}

                {/* ── RESULTS STATE ──────────────────────────────────────────── */}
                {hasQuery && !isLoading && results.length > 0 && (
                  <div>
                    {/* Product rows */}
                    <ul role="listbox" aria-label="Search results" className="divide-y divide-gray-50">
                      {results.map((product) => (
                        <li key={product.id} role="option" aria-selected="false">
                          <button
                            onClick={() => handleProductClick(product.slug)}
                            className="w-full flex items-center gap-3 py-2.5 px-1 hover:bg-[#F8F6F2] rounded-md transition-colors text-left"
                          >
                            {/* Thumbnail – 40×40 */}
                            <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                              <Image
                                src={product.images[0] ?? '/placeholder.jpg'}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>

                            {/* Name + meta */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#111111] truncate leading-snug">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {product.fabric}
                                {product.color ? ` · ${product.color}` : ''}
                              </p>
                            </div>

                            {/* Price */}
                            <span className="flex-shrink-0 text-sm font-semibold text-[#111111]">
                              {formatPrice(product.price)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* Category suggestion */}
                    <div className="mt-3 mb-1 space-y-1">
                      {matchingCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {matchingCategories.slice(0, 4).map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => handleCategoryClick(cat.slug)}
                              className="flex items-center gap-1.5 text-sm text-gray-700 bg-[#F8F6F2] hover:bg-[#EDE9E0] px-3 py-1.5 transition-colors"
                            >
                              <LayoutGrid className="h-3.5 w-3.5 text-[#C9A227]" aria-hidden="true" />
                              {cat.name}
                              <ChevronRight className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                            </button>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => handleSearch(query)}
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#C9A227] transition-colors"
                      >
                        <Search className="h-3.5 w-3.5" aria-hidden="true" />
                        Search in all categories for{' '}
                        <span className="font-medium text-[#111111]">{query.trim()}</span>
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    {/* See-all button */}
                    <button
                      onClick={() => handleSearch(query)}
                      className={cn(
                        'mt-3 w-full py-2.5 rounded-md',
                        'bg-[#111111] text-white text-sm font-medium',
                        'hover:bg-[#C9A227] hover:text-[#111111]',
                        'transition-colors duration-200',
                      )}
                    >
                      See all results for &ldquo;{query.trim()}&rdquo;
                    </button>
                  </div>
                )}

                {/* ── NO RESULTS STATE ───────────────────────────────────────── */}
                {noResults && (
                  <div className="text-center py-8">
                    <p className="text-gray-700 text-sm font-medium mb-1">
                      No products found for &ldquo;{query.trim()}&rdquo;
                    </p>
                    <p className="text-gray-400 text-xs mb-5">
                      Try one of the popular searches below
                    </p>

                    <div className="flex flex-wrap justify-center gap-2">
                      {POPULAR_SEARCHES.slice(0, 6).map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-sm',
                            'bg-[#F8F6F2] hover:bg-[#EDE9E0]',
                            'text-gray-700 transition-colors',
                          )}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
            {/* /Section 2 */}

          </div>
          {/* /inner container */}
        </div>
        {/* /white card */}
      </div>
      {/* /slide-down panel */}

      {/* ── Backdrop ─────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={closeSearch}
          className={cn(
            'fixed inset-0 z-[99]',
            'bg-black/50',
            // Push the backdrop below the panel by offsetting from top
            // The panel itself sits at z-[100] so the click area starts beneath it
          )}
        />
      )}
    </>
  )
}
