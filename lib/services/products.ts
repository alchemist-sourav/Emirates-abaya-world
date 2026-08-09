import type { Product, ProductCategory, ProductFilters, ProductReview, Occasion, Collection, SiteConfig } from '@/types/product'
import { PRODUCTS, CATEGORIES, MOCK_REVIEWS, OCCASIONS, COLLECTIONS, POPULAR_SEARCHES, SITE_CONFIG, STANDARD_SIZES, STANDARD_LENGTHS } from '@/lib/data/products'

export { POPULAR_SEARCHES }

export interface FilterOption {
  value: string
  label: string
}

export interface FilterOptions {
  categories: FilterOption[]
  occasions: FilterOption[]
  collections: FilterOption[]
  sizes: FilterOption[]
  lengths: FilterOption[]
  fabrics: FilterOption[]
  colors: FilterOption[]
  priceBounds: [number, number]
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const priceBounds: [number, number] = PRODUCTS.reduce<[number, number]>(
    ([min, max], p) => [Math.min(min, p.price), Math.max(max, p.price)],
    [Number.POSITIVE_INFINITY, 0]
  )

  const fabrics = [...new Set(PRODUCTS.map((p) => p.fabric))]
  const colors = [...new Set(PRODUCTS.flatMap((p) => p.colors?.map((c) => c.name) ?? [p.color]))]

  return {
    categories: CATEGORIES.filter((c) => c.isActive).map((c) => ({ value: c.slug, label: c.name })),
    occasions: OCCASIONS.map((o) => ({ value: o.slug, label: o.name })),
    collections: COLLECTIONS.map((c) => ({ value: c.slug, label: c.name })),
    sizes: STANDARD_SIZES.map((s) => ({ value: s.value, label: s.label })),
    lengths: STANDARD_LENGTHS.map((l) => ({ value: l.value, label: l.label })),
    fabrics: fabrics.map((f) => ({ value: f, label: f })),
    colors: colors.map((c) => ({ value: c, label: c })),
    priceBounds,
  }
}

export function getSiteConfig(): SiteConfig {
  return SITE_CONFIG
}

export async function getProducts(filters?: Partial<ProductFilters>): Promise<Product[]> {
  let products = [...PRODUCTS]
  if (!filters) return products

  if (filters.categories?.length) {
    products = products.filter(p => filters.categories!.includes(p.category))
  }
  if (filters.occasions?.length) {
    products = products.filter(p => p.occasion && filters.occasions!.includes(p.occasion))
  }
  if (filters.sizes?.length) {
    products = products.filter(p => p.sizes.some(s => filters.sizes!.includes(s.value)))
  }
  if (filters.fabrics?.length) {
    products = products.filter(p => filters.fabrics!.includes(p.fabric))
  }
  if (filters.priceRange) {
    const [min, max] = filters.priceRange
    products = products.filter(p => p.price >= min && p.price <= max)
  }
  if (filters.rating && filters.rating > 0) {
    products = products.filter(p => p.rating >= filters.rating!)
  }
  if (filters.availability && filters.availability !== 'all') {
    products = filters.availability === 'in-stock'
      ? products.filter(p => p.stock > 0)
      : products.filter(p => p.stock === 0)
  }
  return products
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return PRODUCTS.find(p => p.slug === slug) ?? null
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return PRODUCTS.filter(p => p.isFeatured).slice(0, limit)
}

export async function getNewArrivals(limit = 6): Promise<Product[]> {
  return PRODUCTS.filter(p => p.isNew)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export async function getBestSellers(limit = 6): Promise<Product[]> {
  return [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, limit)
}

export async function getSaleProducts(limit?: number): Promise<Product[]> {
  const products = PRODUCTS.filter(p => p.isOnSale)
  return limit ? products.slice(0, limit) : products
}

export async function getDealsProducts(limit = 8): Promise<Product[]> {
  return PRODUCTS
    .filter(p => p.isOnSale && p.originalPrice)
    .sort((a, b) => {
      const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0
      const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0
      return discB - discA
    })
    .slice(0, limit)
}

export async function getLuxuryProducts(limit = 6): Promise<Product[]> {
  return PRODUCTS
    .filter(p => p.subcategory === 'luxury-collection' || p.collection === 'luxury')
    .slice(0, limit)
}

export async function getTrendingProducts(limit = 8): Promise<Product[]> {
  return [...PRODUCTS]
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, limit)
}

export async function getCustomerReviews(limit = 6): Promise<ProductReview[]> {
  return [...MOCK_REVIEWS]
    .filter(r => r.verifiedPurchase)
    .slice(0, limit)
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return ids
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => Boolean(p))
}

export async function getProductsByOccasion(occasion: string, limit = 8): Promise<Product[]> {
  return PRODUCTS.filter(p => p.occasion === occasion).slice(0, limit)
}

export async function getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  const product = PRODUCTS.find(p => p.id === productId)
  if (!product) return []
  return PRODUCTS.filter(p => p.id !== productId && p.category === product.category).slice(0, limit)
}

export async function getCategories(): Promise<ProductCategory[]> {
  return CATEGORIES.filter(c => c.isActive)
}

export async function getOccasions(): Promise<Occasion[]> {
  return OCCASIONS
}

export async function getCollections(): Promise<Collection[]> {
  return COLLECTIONS
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase()
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    p.fabric.toLowerCase().includes(q) ||
    p.color.toLowerCase().includes(q) ||
    (p.occasion && p.occasion.toLowerCase().includes(q))
  )
}

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  return MOCK_REVIEWS.filter(r => r.productId === productId)
}

export async function checkPinCode(pin: string): Promise<{
  available: boolean
  estimatedDays: string
  codAvailable: boolean
  message: string
}> {
  // Mock PIN code check — replace with real API
  if (!/^\d{6}$/.test(pin)) {
    return { available: false, estimatedDays: '', codAvailable: false, message: 'Please enter a valid 6-digit PIN code.' }
  }
  const first = parseInt(pin[0])
  const available = first >= 1 && first <= 9
  const days = first <= 3 ? '2–4 business days' : first <= 6 ? '3–6 business days' : '5–8 business days'
  const cod = first !== 5
  return {
    available,
    estimatedDays: available ? days : '',
    codAvailable: available ? cod : false,
    message: available
      ? `Delivery available. Estimated: ${days}`
      : 'Delivery not available at this PIN code.',
  }
}

export async function createOrder(orderData: Record<string, unknown>): Promise<{ orderId: string; orderNumber: string }> {
  void orderData
  const orderId = `ORD-${Date.now()}`
  const orderNumber = `EAW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  return { orderId, orderNumber }
}
