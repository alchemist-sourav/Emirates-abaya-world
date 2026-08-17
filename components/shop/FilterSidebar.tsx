'use client'

import React from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/data/products'
import type { FilterOptions } from '@/lib/services/products'

export interface FilterState {
  categories: string[]
  sizes: string[]
  lengths: string[]
  colors: string[]
  fabrics: string[]
  occasions: string[]
  collection: string
  price: [number, number]
  rating: number
  availability: 'all' | 'in-stock'
  offersOnly: boolean
}

export const DEFAULT_PRICE_BOUNDS: [number, number] = [0, 22000]

interface FilterSidebarProps {
  filters: FilterState
  options: FilterOptions | null
  priceBounds: [number, number]
  onChange: (filters: FilterState) => void
  onReset: () => void
  className?: string
  activeCount: number
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[#111111] uppercase tracking-wide">{title}</span>
        <ChevronDown className={cn('h-4 w-4 text-gray-500 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: FilterOptions['categories']
  selected: string[]
  onChange: (values: string[]) => void
}) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val])
  }
  return (
    <div className="space-y-2">
      {options.map(({ value, label, count }) => (
        <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => toggle(value)}
            className="w-4 h-4 accent-[#111111] cursor-pointer"
          />
          <span className="text-sm text-gray-600 group-hover:text-[#111111] transition-colors">{label}</span>
          {typeof count === 'number' && (
            <span className="ml-auto text-[11px] text-gray-400 tabular-nums">{count}</span>
          )}
        </label>
      ))}
    </div>
  )
}

function ColorSwatchGroup({
  options,
  selected,
  onChange,
}: {
  options: FilterOptions['colors']
  selected: string[]
  onChange: (values: string[]) => void
}) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, label, hex }) => {
        const active = selected.includes(value)
        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            title={label}
            aria-pressed={active}
            aria-label={`Filter by colour ${label}`}
            className={cn(
              'relative w-8 h-8 rounded-full border transition-all duration-150',
              active ? 'border-[#111111] ring-2 ring-[#111111] ring-offset-2 ring-offset-white' : 'border-gray-200 hover:border-[#111111]'
            )}
            style={{ backgroundColor: hex ?? '#E5E5E5' }}
          >
            {active && (
              <span
                className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                style={{ color: ['#111111', '#001F3F', '#800020', '#047857'].includes((hex ?? '').toLowerCase()) ? '#FFFFFF' : '#111111' }}
                aria-hidden="true"
              >
                ✓
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function PriceSlider({
  value,
  bounds,
  onChange,
}: {
  value: [number, number]
  bounds: [number, number]
  onChange: (next: [number, number]) => void
}) {
  const [min, max] = bounds
  const [lo, hi] = value
  const pct = (v: number) => ((v - min) / Math.max(1, max - min)) * 100

  return (
    <div>
      <div className="relative h-1.5 bg-gray-200 rounded-full">
        <div
          className="absolute h-1.5 bg-[#111111] rounded-full"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="relative h-5 -mt-5 mb-4">
        <input
          type="range"
          min={min}
          max={max}
          step={5}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className="range-input"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={5}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className="range-input"
          aria-label="Maximum price"
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[#111111] font-medium">
        <span className="bg-[#F8F6F2] px-2.5 py-1 border border-gray-200">{formatPrice(lo)}</span>
        <span className="text-gray-400">–</span>
        <span className="bg-[#F8F6F2] px-2.5 py-1 border border-gray-200">{formatPrice(hi)}</span>
      </div>
    </div>
  )
}

function PillGroup({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (values: string[]) => void
}) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val])
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => toggle(value)}
          className={cn(
            'px-2.5 py-1 text-xs font-medium border transition-all',
            selected.includes(value)
              ? 'bg-[#111111] text-white border-[#111111]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-[#111111]'
          )}
          aria-pressed={selected.includes(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function RadioGroup({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[]
  selected: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      {options.map(({ value, label }) => (
        <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="radio"
            checked={selected === value}
            onChange={() => onChange(value)}
            className="w-4 h-4 accent-[#111111]"
          />
          <span className="text-sm text-gray-600 group-hover:text-[#111111] transition-colors">{label}</span>
        </label>
      ))}
    </div>
  )
}

export function FilterSidebar({ filters, options, priceBounds, onChange, onReset, className, activeCount }: FilterSidebarProps) {
  const priceIsActive = filters.price[0] !== priceBounds[0] || filters.price[1] !== priceBounds[1]

  return (
    <aside className={cn('w-64 flex-shrink-0', className)} aria-label="Product filters">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-[#111111]">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#111111] transition-colors"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Reset all ({activeCount})
          </button>
        )}
      </div>

      {/* Categories */}
      {options && (
        <FilterSection title="Category">
          <CheckboxGroup
            options={options.categories}
            selected={filters.categories}
            onChange={(v) => onChange({ ...filters, categories: v })}
          />
        </FilterSection>
      )}

      {/* Price */}
      <FilterSection title={`Price (${SITE_CONFIG.currency})`}>
        <PriceSlider
          value={filters.price}
          bounds={priceBounds}
          onChange={(next) => onChange({ ...filters, price: next })}
        />
        {priceIsActive && (
          <button
            onClick={() => onChange({ ...filters, price: [priceBounds[0], priceBounds[1]] })}
            className="mt-2 text-xs text-[#C9A227] hover:underline"
          >
            Clear price
          </button>
        )}
      </FilterSection>

      {/* Size */}
      {options && (
        <FilterSection title="Size">
          <CheckboxGroup
            options={options.sizes}
            selected={filters.sizes}
            onChange={(v) => onChange({ ...filters, sizes: v })}
          />
        </FilterSection>
      )}

      {/* Length */}
      {options && (
        <FilterSection title="Length">
          <PillGroup
            options={options.lengths}
            selected={filters.lengths}
            onChange={(v) => onChange({ ...filters, lengths: v })}
          />
        </FilterSection>
      )}

      {/* Colour */}
      {options && (
        <FilterSection title="Colour">
          <ColorSwatchGroup
            options={options.colors}
            selected={filters.colors}
            onChange={(v) => onChange({ ...filters, colors: v })}
          />
        </FilterSection>
      )}

      {/* Fabric */}
      {options && (
        <FilterSection title="Fabric">
          <CheckboxGroup
            options={options.fabrics}
            selected={filters.fabrics}
            onChange={(v) => onChange({ ...filters, fabrics: v })}
          />
        </FilterSection>
      )}

      {/* Occasion */}
      {options && (
        <FilterSection title="Occasion">
          <CheckboxGroup
            options={options.occasions}
            selected={filters.occasions}
            onChange={(v) => onChange({ ...filters, occasions: v })}
          />
        </FilterSection>
      )}

      {/* Collection */}
      {options && (
        <FilterSection title="Collection">
          <CheckboxGroup
            options={options.collections}
            selected={filters.collection ? [filters.collection] : []}
            onChange={(v) => onChange({ ...filters, collection: v[v.length - 1] ?? '' })}
          />
        </FilterSection>
      )}

      {/* Rating */}
      <FilterSection title="Rating">
        <RadioGroup
          options={[
            { value: '0', label: 'All ratings' },
            { value: '4', label: '4★ & above' },
            { value: '3', label: '3★ & above' },
          ]}
          selected={String(filters.rating)}
          onChange={(v) => onChange({ ...filters, rating: Number(v) })}
        />
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <RadioGroup
          options={[
            { value: 'all', label: 'All products' },
            { value: 'in-stock', label: 'In stock only' },
          ]}
          selected={filters.availability}
          onChange={(v) => onChange({ ...filters, availability: v as FilterState['availability'] })}
        />
      </FilterSection>

      {/* Offers */}
      <FilterSection title="Offers">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.offersOnly}
            onChange={() => onChange({ ...filters, offersOnly: !filters.offersOnly })}
            className="w-4 h-4 accent-[#111111] cursor-pointer"
          />
          <span className="text-sm text-gray-600 group-hover:text-[#111111] transition-colors">On sale / discounted</span>
        </label>
      </FilterSection>
    </aside>
  )
}
