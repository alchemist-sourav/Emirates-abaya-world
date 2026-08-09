'use client'

import React from 'react'
import { PRODUCT_SORT_OPTIONS } from '@/types/product'

interface SortSelectProps {
  value: string
  onChange: (value: string) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-gray-600 whitespace-nowrap hidden sm:block">
        Sort by
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 px-3 py-2 text-sm text-[#111111] bg-white focus:outline-none focus:border-[#111111] cursor-pointer min-w-[160px]"
      >
        {PRODUCT_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
