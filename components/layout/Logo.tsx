import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md'
  light?: boolean
  withSubline?: boolean
}

/**
 * EMIRATES wordmark — refined uppercase serif.
 */
export function Logo({ className, size = 'md', light = false, withSubline = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('inline-flex flex-col items-center group', className)}
      aria-label="EMIRATES — Home"
    >
      <span
        className={cn(
          'font-bold uppercase transition-colors leading-none',
          size === 'md' ? 'text-xl sm:text-[28px]' : 'text-[16px]',
          light ? 'text-white' : 'text-[#111111]'
        )}
        style={{ fontFamily: "'Times New Roman MT', 'Times New Roman', Times, serif", fontWeight: '900', letterSpacing: '0.08em', textShadow: '0.4px 0 0 currentColor, -0.4px 0 0 currentColor' }}
      >
        Emirates
      </span>
      {withSubline && (
        <span
          className={cn(
            'mt-0.5 font-sans font-medium uppercase',
            size === 'md' ? 'text-[8.5px] sm:text-[9.5px]' : 'text-[7.5px]',
            light ? 'text-white/60' : 'text-[#111111]'
          )}
          style={{ letterSpacing: '0.45em', textIndent: '0.45em', textTransform: 'lowercase' }}
        >
          abaya world
        </span>
      )}
    </Link>
  )
}