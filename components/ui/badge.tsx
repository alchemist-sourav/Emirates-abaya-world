'use client'

import { cn } from '@/lib/utils'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'new' | 'sale' | 'price'
}

export function Badge({
  className,
  variant = 'new',
  children,
  ...props
}: BadgeProps) {
  const baseClasses =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'

  const variantClasses = {
    new: 'bg-peach text-white',
    sale: 'bg-gold text-white',
    price: 'bg-black text-white',
  }

  return (
    <span
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}