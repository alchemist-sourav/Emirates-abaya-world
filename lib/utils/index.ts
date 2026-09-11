import { SITE_CONFIG } from '@/lib/data/products'

export { cn } from './cn'

/** Region-aware price formatting (reads currency, locale & decimals from SITE_CONFIG) */
export function formatPrice(price: number, currency?: string): string {
  return new Intl.NumberFormat(SITE_CONFIG.locale, {
    style: 'currency',
    currency: currency ?? SITE_CONFIG.currency,
    minimumFractionDigits: SITE_CONFIG.priceDecimals,
    maximumFractionDigits: SITE_CONFIG.priceDecimals,
  }).format(price)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(SITE_CONFIG.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/** Compute discount percentage from original & selling price */
export function discountPercent(originalPrice?: number, price?: number): number {
  if (!originalPrice || !price || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

/** Returns the currently active storefront currency code (e.g. "INR", "AED") */
export function getActiveCurrency(): string {
  return SITE_CONFIG.currency
}

/** Returns the currency symbol for the active storefront (e.g. "₹", "AED ") */
export function currencySymbol(currency?: string): string {
  if (currency) {
    return currency === 'INR' ? '₹' : currency === 'AED' ? 'AED ' : `${currency} `
  }
  return SITE_CONFIG.currencySymbol
}
