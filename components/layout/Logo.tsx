import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/data/products'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md'
  light?: boolean
  withSubline?: boolean
}

/**
 * EMIRATES* wordmark — refined uppercase serif with a raised gold asterisk.
 */
export function Logo({ className, size = 'md', light = false, withSubline = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('inline-flex flex-col items-center group', className)}
      aria-label="EMIRATES — Home"
    >
      <span className="flex items-start leading-none">
        <span
          className={cn(
            'font-heading font-bold uppercase tracking-[0.22em] transition-colors',
            size === 'md' ? 'text-[26px]' : 'text-[15px]',
            light ? 'text-white' : 'text-[#111111]'
          )}
        >
          Emirates
        </span>
        <span
          className={cn(
            'relative font-heading font-bold text-[#C9A227] transition-colors group-hover:text-[#D4956A]',
            size === 'md' ? '-top-1.5 text-xl' : '-top-1 text-xs'
          )}
          aria-hidden="true"
        >
          *
        </span>
      </span>
      {withSubline && (
        <span
          className={cn(
            'mt-1.5 text-[8px] tracking-[0.34em] uppercase font-medium',
            light ? 'text-gray-400' : 'text-[#6B7280]'
          )}
        >
          {SITE_CONFIG.regionLabel}
        </span>
      )}
    </Link>
  )
}