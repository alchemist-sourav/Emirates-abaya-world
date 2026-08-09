'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const goNext = () => setActiveIndex((i) => (i + 1) % images.length)
  const goPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className={cn(
          'relative aspect-[3/4] bg-gray-50 overflow-hidden cursor-zoom-in',
          isZoomed && 'cursor-zoom-out'
        )}
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isZoomed && setIsZoomed(false)}
        role="img"
        aria-label={`${productName} - image ${activeIndex + 1} of ${images.length}`}
      >
        <Image
          src={images[activeIndex] ?? ''}
          alt={`${productName} - view ${activeIndex + 1}`}
          fill
          priority
          className={cn(
            'object-cover transition-transform duration-300',
            isZoomed ? 'scale-150' : 'scale-100'
          )}
          style={
            isZoomed
              ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` }
              : undefined
          }
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Zoom indicator */}
        {!isZoomed && (
          <div className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <ZoomIn className="h-4 w-4 text-gray-600" aria-hidden="true" />
          </div>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i) }}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  i === activeIndex ? 'bg-[#111111] w-4' : 'bg-gray-400'
                )}
                aria-label={`View image ${i + 1}`}
                aria-current={i === activeIndex}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide" role="list" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border-2 transition-all',
                i === activeIndex ? 'border-[#111111]' : 'border-transparent hover:border-gray-300'
              )}
              role="listitem"
              aria-label={`View image ${i + 1}`}
              aria-current={i === activeIndex}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
