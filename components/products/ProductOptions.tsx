'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { formatINR } from '@/lib/utils'
import type { SizeOption, LengthOption, HijabOption } from '@/types/product'

interface ProductOptionsProps {
  sizes: SizeOption[]
  lengths: LengthOption[]
  hijabOptions: HijabOption[]
  selectedSize: string | null
  selectedLength: string | null
  selectedHijab: string | null
  onSizeChange: (value: string) => void
  onLengthChange: (value: string) => void
  onHijabChange: (id: string) => void
  errors: { size?: string; length?: string }
}

function OptionButton({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative px-4 py-2 text-sm font-medium border transition-all',
        selected
          ? 'bg-[#111111] text-white border-[#111111]'
          : disabled
          ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through'
          : 'bg-white text-gray-700 border-gray-300 hover:border-[#111111] hover:text-[#111111]'
      )}
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}

export function ProductOptions({
  sizes,
  lengths,
  hijabOptions,
  selectedSize,
  selectedLength,
  selectedHijab,
  onSizeChange,
  onLengthChange,
  onHijabChange,
  errors,
}: ProductOptionsProps) {
  return (
    <div className="space-y-6">
      {/* Size */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-[#111111] uppercase tracking-wide">
            Size
            {selectedSize && <span className="ml-2 font-normal text-gray-500">{selectedSize}</span>}
          </label>
          <a href="#size-guide" className="text-xs text-gray-500 hover:text-[#111111] underline transition-colors">
            Size Guide
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <OptionButton
              key={size.id}
              label={size.label}
              selected={selectedSize === size.value}
              disabled={!size.isAvailable}
              onClick={() => onSizeChange(size.value)}
            />
          ))}
        </div>
        {errors.size && (
          <p className="mt-2 text-xs text-red-500" role="alert">{errors.size}</p>
        )}
      </div>

      {/* Length */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-[#111111] uppercase tracking-wide">
            Length
            {selectedLength && <span className="ml-2 font-normal text-gray-500">{selectedLength}</span>}
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {lengths.map((length) => (
            <OptionButton
              key={length.id}
              label={length.label}
              selected={selectedLength === length.value}
              disabled={!length.isAvailable}
              onClick={() => onLengthChange(length.value)}
            />
          ))}
        </div>
        {errors.length && (
          <p className="mt-2 text-xs text-red-500" role="alert">{errors.length}</p>
        )}
      </div>

      {/* Hijab */}
      <div>
        <div className="mb-3">
          <label className="text-sm font-semibold text-[#111111] uppercase tracking-wide">
            Complete the Look
          </label>
          <p className="text-xs text-gray-500 mt-0.5">Optional – select a matching hijab</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {hijabOptions.map((hijab) => (
            <button
              key={hijab.id}
              onClick={() => onHijabChange(hijab.id)}
              className={cn(
                'flex flex-col items-start p-3 text-left border transition-all text-sm',
                selectedHijab === hijab.id
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#111111]'
              )}
              aria-pressed={selectedHijab === hijab.id}
            >
              <span className="font-medium">{hijab.name}</span>
              {hijab.price > 0 ? (
                <span className={cn('text-xs mt-0.5', selectedHijab === hijab.id ? 'text-[#C9A227]' : 'text-gray-500')}>
                  +{formatINR(hijab.price)}
                </span>
              ) : (
                <span className={cn('text-xs mt-0.5', selectedHijab === hijab.id ? 'text-gray-300' : 'text-gray-400')}>
                  No hijab
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
