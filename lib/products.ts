export interface Product {
  id: string
  title: string
  slug: string
  image: string
  thumbnail: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  rating: number
  reviewCount: number
  colors: Color[]
  sizes: Size[]
  inStock: boolean
  isNew: boolean
  isSale: boolean
  description: string
  shippingInfo?: string
}

export interface Color {
  name: string
  hex: string
}

export interface Size {
  label: string
  value: string
}

export const products: Product[] = [
  {
    id: "1",
    title: "Seamless Slip Dress",
    slug: "seamless-slip-dress",
    image: "/images/products/dress1.jpg",
    thumbnail: "/images/products/dress1-thumb.jpg",
    price: 129,
    originalPrice: 159,
    discountPercentage: 18.5,
    rating: 4.8,
    reviewCount: 24,
    colors: [
      { name: "Desert Tan", hex: "#C9A46C" },
      { name: "Black", hex: "#111111" }
    ],
    sizes: [
      { label: "XS", value: "XS" },
      { label: "S", value: "S" },
      { label: "M", value: "M" },
      { label: "L", value: "L" },
      { label: "XL", value: "XL" }
    ],
    inStock: true,
    isNew: true,
    isSale: true,
    description: "A luxurious slip dress crafted from premium silk-blend fabric. The flowing silhouette is both elegant and modest, perfect for any occasion."
  },
  {
    id: "2",
    title: "Embroidered Abaya",
    slug: "embroidered-abaya",
    image: "/images/products/abaya1.jpg",
    thumbnail: "/images/products/abaya1-thumb.jpg",
    price: 249,
    originalPrice: 329,
    discountPercentage: 24.3,
    rating: 4.9,
    reviewCount: 15,
    colors: [
      { name: "Desert Tan", hex: "#C9A46C" },
      { name: "Pure Black", hex: "#111111" }
    ],
    sizes: [
      { label: "XS", value: "XS" },
      { label: "S", value: "S" },
      { label: "M", value: "M" },
      { label: "L", value: "L" },
      { label: "XL", value: "XL" }
    ],
    inStock: true,
    isNew: false,
    isSale: true,
    description: "Hand-embroidered abaya with intricate UAE-inspired patterns. Premium crepe fabric with a fluid drape."
  },
  {
    id: "3",
    title: "Pearl-Trimmed Hijab",
    slug: "pearl-trimmed-hijab",
    image: "/images/products/hijab1.jpg",
    thumbnail: "/images/products/hijab1-thumb.jpg",
    price: 45,
    rating: 4.5,
    reviewCount: 32,
    colors: [
      { name: "Blush", hex: "#E7C6B8" },
      { name: "Cream", hex: "#FAF7F2" }
    ],
    sizes: [
      { label: "One Size", value: "OS" }
    ],
    inStock: true,
    isNew: false,
    isSale: false,
    description: "Soft pearl-trimmed hijab in muted blush. Premium chiffon fabric with elegant drape."
  },
  {
    id: "4",
    title: "Crystal Belt",
    slug: "crystal-belt",
    image: "/images/products/belt1.jpg",
    thumbnail: "/images/products/belt1-thumb.jpg",
    price: 125,
    originalPrice: 165,
    discountPercentage: 24.2,
    rating: 4.3,
    reviewCount: 8,
    colors: [
      { name: "Gold", hex: "#C9A46C" },
      { name: "Silver", hex: "#E5E7E9" }
    ],
    sizes: [
      { label: "One Size", value: "OS" }
    ],
    inStock: true,
    isNew: true,
    isSale: true,
    description: "Crystal-embellished belt to cinch the waist over abayas. Adjustable fit with premium hardware."
  },
  {
    id: "5",
    title: "Modern Minimal Abaya",
    slug: "modern-minimal-abaya",
    image: "/images/products/abaya2.jpg",
    thumbnail: "/images/products/abaya2-thumb.jpg",
    price: 299,
    rating: 4.7,
    reviewCount: 41,
    colors: [
      { name: "Black", hex: "#111111" }
    ],
    sizes: [
      { label: "XS", value: "XS" },
      { label: "S", value: "S" },
      { label: "M", value: "M" },
      { label: "L", value: "L" },
      { label: "XL", value: "XL" }
    ],
    inStock: true,
    isNew: false,
    isSale: false,
    description: "Sleek modern minimal abaya with clean lines. Premium weighted crepe fabric."
  },
  {
    id: "6",
    title: "Embellished Clutch",
    slug: "embellished-clutch",
    image: "/images/products/clutch1.jpg",
    thumbnail: "/images/products/clutch1-thumb.jpg",
    price: 89,
    originalPrice: 119,
    discountPercentage: 25.2,
    rating: 4.6,
    reviewCount: 19,
    colors: [
      { name: "Blush", hex: "#E7C6B8" },
      { name: "Desert Tan", hex: "#C9A46C" }
    ],
    sizes: [
      { label: "One Size", value: "OS" }
    ],
    inStock: true,
    isNew: false,
    isSale: true,
    description: "Evening clutch with subtle bead embellishment. Secure magnetic closure."
  },
  {
    id: "7",
    title: "Silk Crepe Abaya Dress",
    slug: "silk-crepe-abaya-dress",
    image: "/images/products/dress2.jpg",
    thumbnail: "/images/products/dress2-thumb.jpg",
    price: 329,
    originalPrice: 399,
    discountPercentage: 17.5,
    rating: 4.9,
    reviewCount: 30,
    colors: [
      { name: "Desert Tan", hex: "#C9A46C" },
      { name: "Midnight Black", hex: "#0a0a0a" }
    ],
    sizes: [
      { label: "XS", value: "XS" },
      { label: "S", value: "S" },
      { label: "M", value: "M" },
      { label: "L", value: "L" },
      { label: "XL", value: "XL" }
    ],
    inStock: true,
    isNew: true,
    isSale: true,
    description: "Silk crepe abaya dress with draped overlay. Perfect for formal events."
  },
  {
    id: "8",
    title: "Lace Trimmed Hijab",
    slug: "lace-trimmed-hijab",
    image: "/images/products/hijab2.jpg",
    thumbnail: "/images/products/hijab2-thumb.jpg",
    price: 52,
    rating: 4.4,
    reviewCount: 28,
    colors: [
      { name: "Cream", hex: "#FAF7F2" },
      { name: "Soft Blush", hex: "#E7C6B8" }
    ],
    sizes: [
      { label: "One Size", value: "OS" }
    ],
    inStock: true,
    isNew: false,
    isSale: false,
    description: "Delicate lace trimmed hijab in premium cream. Breathable fabric for all-day comfort."
  }
]