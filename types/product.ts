export interface Product {
  id: string
  slug: string
  name: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  currency: string
  images: string[]
  category: string
  subcategory?: string
  occasion?: string
  collection?: string
  sizes: SizeOption[]
  lengths: LengthOption[]
  hijabOptions: HijabOption[]
  fabric: string
  color: string
  colors?: ColorOption[]
  sku: string
  stock: number
  rating: number
  reviewCount: number
  isNew: boolean
  isFeatured: boolean
  isOnSale: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  isActive: boolean
}

export interface Occasion {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  badge?: string
}

export interface SiteClaims {
  securePayments: boolean
  codAvailable: boolean
  easyReturns: boolean
  qualityChecked: boolean
  fastDelivery: boolean
  freeShipping: boolean
}

export interface SiteConfig {
  /** Thin promo/announcement bar text shown at the very top of the site */
  announcement: string
  /** Optional note shown under the product options (e.g. payment/length policy) */
  productNote: string
  freeShippingAbove: number
  codFee: number
  taxRate: number
  baseShippingFee: number
  currency: string
  currencySymbol: string
  whatsappNumber: string
  email: string
  phone: string
  address: string
  claims: SiteClaims
  delivery: {
    minPinPrefix: number
    maxPinPrefix: number
  }
}

export interface SizeOption {
  id: string
  label: string
  value: string
  isAvailable: boolean
}

export interface LengthOption {
  id: string
  label: string
  value: string
  inches: number
  isAvailable: boolean
}

export interface HijabOption {
  id: string
  name: string
  description: string
  price: number
  image: string
  isMatching: boolean
}

export interface ColorOption {
  id: string
  name: string
  hex: string
  images: string[]
}

export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  verifiedPurchase: boolean
  createdAt: string
  location?: string
}

export interface ProductFilters {
  categories: string[]
  occasions: string[]
  colors: string[]
  priceRange: [number, number]
  sizes: string[]
  fabrics: string[]
  lengths: string[]
  availability: 'in-stock' | 'out-of-stock' | 'all'
  rating: number
  collection: string
}

export interface ProductSortOption {
  value: string
  label: string
}

export const PRODUCT_SORT_OPTIONS: ProductSortOption[] = [
  { value: 'featured',     label: 'Featured' },
  { value: 'popularity',   label: 'Popularity' },
  { value: 'newest',       label: 'Newest First' },
  { value: 'price-asc',    label: 'Price: Low to High' },
  { value: 'price-desc',   label: 'Price: High to Low' },
  { value: 'best-rated',   label: 'Customer Rating' },
  { value: 'best-selling', label: 'Best Selling' },
]
