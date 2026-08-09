export { cn } from './cn'

/** India-first currency formatting (₹, en-IN grouping) */
export function formatINR(price: number): string {
  return `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

/** Generic price formatter, defaults to INR for India-first store */
export function formatPrice(price: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
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
