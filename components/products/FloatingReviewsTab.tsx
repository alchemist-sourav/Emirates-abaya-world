'use client'

import React from 'react'
import { Star } from 'lucide-react'

export function FloatingReviewsTab() {
  const scrollToReviews = () => {
    const el = document.getElementById('reviews')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button
      type="button"
      onClick={scrollToReviews}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-1.5 bg-[#F3E7E0] border border-r-0 border-[#E8DCD2] rounded-l-lg px-2 py-3 shadow-sm hover:bg-[#EBDCD2] transition-colors"
      aria-label="Jump to customer reviews"
    >
      <Star className="h-4 w-4 text-[#C9A227] fill-[#C9A227] text-center mx-auto" strokeWidth={1} />
      <span
        className="text-[11px] font-semibold tracking-[0.18em] text-[#111111] uppercase mx-auto"
        style={{ writingMode: 'vertical-rl' }}
      >
        Reviews
      </span>
    </button>
  )
}
