'use client'

import React, { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { FilterSidebar, type FilterState } from './FilterSidebar'
import { PRODUCT_SORT_OPTIONS } from '@/types/product'
import type { FilterOptions } from '@/lib/services/products'
import { cn } from '@/lib/utils'

interface MobileFiltersProps {
  filters: FilterState
  options: FilterOptions | null
  priceBounds: [number, number]
  sort: string
  onChange: (filters: FilterState) => void
  onReset: () => void
  onSortChange: (value: string) => void
  resultCount: number
  activeCount: number
}

export function MobileFilters({ filters, options, priceBounds, sort, onChange, onReset, onSortChange, resultCount, activeCount }: MobileFiltersProps) {
  const [panel, setPanel] = useState<'none' | 'filters' | 'sort'>('none')

  const close = () => setPanel('none')
  const currentSort = PRODUCT_SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort'

  return (
    <>
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setPanel('filters')}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-sm font-medium text-[#111111] hover:bg-gray-50 transition-colors"
          aria-label="Open filters"
          aria-expanded={panel === 'filters'}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-[#111111] text-white rounded-full">
              {activeCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setPanel('sort')}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-sm font-medium text-[#111111] hover:bg-gray-50 transition-colors"
          aria-label="Open sort"
          aria-expanded={panel === 'sort'}
        >
          Sort
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {panel === 'filters' && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden="true" />
          <div className="absolute left-0 bottom-0 w-full max-h-[88vh] bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={close} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              <FilterSidebar
                filters={filters}
                options={options}
                priceBounds={priceBounds}
                onChange={onChange}
                onReset={onReset}
                activeCount={activeCount}
                className="w-full"
              />
            </div>

            <div className="px-5 py-4 border-t border-gray-100 grid grid-cols-2 gap-3">
              <button
                onClick={() => { onReset(); }}
                className="py-3 border border-gray-200 text-[#111111] font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={close}
                className="py-3 bg-[#111111] text-white font-semibold text-sm hover:bg-[#222222] transition-colors"
              >
                View {resultCount} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {panel === 'sort' && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Sort">
          <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden="true" />
          <div className="absolute left-0 bottom-0 w-full bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Sort By</h2>
              <button onClick={close} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" aria-label="Close sort">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto py-2">
              {PRODUCT_SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { onSortChange(option.value); close() }}
                  className={cn(
                    'w-full text-left px-5 py-3 text-sm transition-colors',
                    sort === option.value ? 'bg-[#F8F6F2] font-semibold text-[#111111]' : 'text-gray-600 hover:bg-gray-50'
                  )}
                  aria-pressed={sort === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* keep current sort label invisible on desktop */}
      <span className="sr-only">{currentSort}</span>
    </>
  )
}
