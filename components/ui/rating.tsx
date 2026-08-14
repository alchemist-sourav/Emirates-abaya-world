'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  max?: number
  className?: string
}

export function Rating({
  value,
  max = 5,
  className = ''
}: RatingProps) {
  const stars = Math.round(value)

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const isFilled = i < stars
        return (
          <Star
            key={i}
            className={cn('h-4 w-4', isFilled ? 'text-gold' : 'text-gray-300')}
          />
        )
      })}
    </div>
  )
}