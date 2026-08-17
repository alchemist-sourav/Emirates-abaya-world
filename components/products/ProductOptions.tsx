'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import type { SizeOption, LengthOption, HijabOption, ColorOption } from '@/types/product'

interface ProductOptionsProps {
  sizes: SizeOption[]
  lengths: LengthOption[]
  hijabOptions: HijabOption[]
  colors?: ColorOption[]
  selectedColor?: string | null
  onColorChange?: (id: string) => void
  selectedSize: string | null
  selectedLength: string | null
  selectedHijab: string | null
  onSizeChange: (value: string) => void
  onLengthChange: (value: string) => void
  onHijabChange: (id: string) => void
  onSizeGuide?: () => void
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
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'min-w-[44px] px-3.5 py-2 text-sm font-medium border transition-all duration-150',
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
  colors,
  selectedColor,
  onColorChange,
  selectedSize,
  selectedLength,
  selectedHijab,
  onSizeChange,
  onLengthChange,
  onHijabChange,
  onSizeGuide,
  errors,
}: ProductOptionsProps) {
  const selectedSizeLabel = sizes.find((s) => s.value === selectedSize)?.label ?? ''
  const selectedColorObj = colors?.find((c) => c.id === selectedColor) ?? null

  return (
    <div className="space-y-6">
      {/* Colour */}
      {colors && colors.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-[#111111] block mb-2.5">
            Colour
            {selectedColorObj && (
              <span className="ml-2 font-normal text-gray-500">: {selectedColorObj.name}</span>
            )}
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            {colors.map((color) => {
              const selected = selectedColor === color.id
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onColorChange?.(color.id)}
                  aria-pressed={selected}
                  aria-label={`Colour ${color.name}`}
                  title={color.name}
                  className={cn(
                    'relative w-9 h-9 rounded-full border transition-all duration-150',
                    selected
                      ? 'border-[#111111] ring-2 ring-[#111111] ring-offset-2 ring-offset-white'
                      : 'border-gray-200 hover:border-[#111111]'
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {selected && (
                    <span
                      className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                      style={{ color: ['#111111', '#001F3F', '#800020', '#047857'].includes(color.hex.toLowerCase()) ? '#FFFFFF' : '#111111' }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Size */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-sm font-semibold text-[#111111]">
            Size
            {selectedSize && (
              <span className="ml-2 font-normal text-gray-500">: {selectedSizeLabel}</span>
            )}
          </label>
          {onSizeGuide && (
            <button
              type="button"
              onClick={onSizeGuide}
              className="text-xs font-medium text-[#111111] underline underline-offset-2 hover:text-[#C9A227] transition-colors"
            >
              Size Guide
            </button>
          )}
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

      {/* Length v/s Height — dropdown */}
      {lengths.length > 0 && (
      <div>
        <label className="text-sm font-semibold text-[#111111] block mb-2.5">
          Length v/s Height
        </label>
        <div className="relative w-full">
          <select
            value={selectedLength ?? ''}
            onChange={(e) => onLengthChange(e.target.value)}
            className="w-full px-3.5 border border-gray-300 bg-white text-sm text-[#111111] appearance-none focus:outline-none focus:border-[#111111] transition-colors h-11 cursor-pointer pr-10 rounded-none"
            aria-label="Select length"
          >
            <option value="" disabled>Select your length</option>
            {lengths.map((length) => (
              <option
                key={length.id}
                value={length.value}
                disabled={!length.isAvailable}
              >
                {length.label} {length.inches ? `– ${Math.floor((length.inches - 48) * 2) / 2} ft ${(length.inches % 12)} inch` : ''}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        {errors.length && (
          <p className="mt-2 text-xs text-red-500" role="alert">{errors.length}</p>
        )}
      </div>
      )}

      {/* Matching Hijab */}
      <div>
        <div className="mb-2.5">
          <label className="text-sm font-semibold text-[#111111]">
            Add Matching Hijab
          </label>
          <p className="text-xs text-gray-500 mt-0.5">Optional</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hijabOptions.map((hijab) => (
            <button
              key={hijab.id}
              type="button"
              onClick={() => onHijabChange(hijab.id)}
              className={cn(
                'px-4 py-2.5 border text-sm transition-all duration-150 text-left',
                selectedHijab === hijab.id
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#111111]'
              )}
              aria-pressed={selectedHijab === hijab.id}
            >
              <span className="block leading-tight">{hijab.name}</span>
              <span className={cn(
                'block text-xs mt-0.5',
                selectedHijab === hijab.id ? 'text-[#C9A227]' : hijab.price > 0 ? 'text-gray-500' : 'text-gray-400'
              )}>
                {hijab.price > 0 ? `+${formatPrice(hijab.price)}` : 'No hijab'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
