import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw, BadgeCheck, Zap, CheckCircle2 } from 'lucide-react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { RecentlyViewed } from '@/components/home/RecentlyViewed'
import { formatINR, discountPercent } from '@/lib/utils'
import {
  getDealsProducts,
  getBestSellers,
  getNewArrivals,
  getCategories,
  getOccasions,
  getLuxuryProducts,
  getTrendingProducts,
  getCustomerReviews,
  getSiteConfig,
} from '@/lib/services/products'
import type { Product } from '@/types/product'

export const metadata: Metadata = {
  title: 'Emirates Abaya World – Premium Abayas & Hijabs, Delivered Across India',
  description:
    'Shop premium abayas, hijabs and modest fashion online in India. Luxury, everyday, open, party and prayer abayas with COD, easy returns and free shipping above ₹1,999.',
  openGraph: {
    title: 'Emirates Abaya World – Premium Abayas & Hijabs',
    description: 'Shop premium abayas, hijabs and modest fashion online in India.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = 'View All',
}: {
  eyebrow?: string
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        {eyebrow && <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A227] block mb-1">{eyebrow}</span>}
        <h2 className="text-lg sm:text-2xl font-bold text-[#111111]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-[#111111] hover:text-[#C9A227] whitespace-nowrap">
          {linkLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

function DealsCard({ product }: { product: Product }) {
  const discount = discountPercent(product.originalPrice, product.price)
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex-shrink-0 w-[168px] sm:w-[190px] bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <Image
          src={product.images[0] ?? '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="190px"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 leading-none">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="p-2.5 flex flex-col gap-0.5 flex-1">
        <h3 className="text-[12px] text-gray-800 line-clamp-2 leading-snug group-hover:underline">{product.name}</h3>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-bold text-[#111111]">{formatINR(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-gray-400 line-through">{formatINR(product.originalPrice)}</span>
          )}
        </div>
        {discount > 0 && <span className="text-[11px] font-semibold text-green-600">{discount}% off</span>}
      </div>
    </Link>
  )
}

export default async function HomePage() {
  const [deals, bestSellers, newArrivals, categories, occasions, luxury, trending, reviews, config] =
    await Promise.all([
      getDealsProducts(10),
      getBestSellers(8),
      getNewArrivals(8),
      getCategories(),
      getOccasions(),
      getLuxuryProducts(4),
      getTrendingProducts(8),
      getCustomerReviews(6),
      getSiteConfig(),
    ])

  const promoItems: { icon: typeof Truck; label: string }[] = []
  if (config.claims.freeShipping) promoItems.push({ icon: Truck, label: `Free Shipping above ${formatINR(config.freeShippingAbove)}` })
  if (config.claims.codAvailable) promoItems.push({ icon: Zap, label: 'COD Available across India' })
  if (config.claims.easyReturns) promoItems.push({ icon: RotateCcw, label: 'Easy 14-day Returns' })
  if (config.claims.fastDelivery) promoItems.push({ icon: Truck, label: 'Fast Pan-India Delivery' })

  return (
    <>
      {/* ═══════════ 1. HERO / OFFER BANNER ═══════════ */}
      <section className="bg-[#F8F6F2] border-b border-[#E5E5E5]" aria-label="Featured offer">
        <div className="container-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] gap-6 py-6 lg:py-10 items-center">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 bg-[#111111] text-white text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1 mb-4">
                <BadgeCheck className="h-3.5 w-3.5 text-[#C9A227]" aria-hidden="true" />
                Ramadan &amp; Eid Collection 2026
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#111111] leading-[1.1] mb-3">
                Elegant Abayas for <span className="text-[#C9A227]">Every Occasion</span>
              </h1>
              <p className="text-[#6B7280] text-sm sm:text-base mb-6 max-w-md leading-relaxed">
                Premium modest fashion delivered across India. Handpicked luxury, everyday and prayer abayas with matching hijabs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/shop?category=abayas" className="btn-primary btn-lg">
                  Shop Abayas <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/shop?sale=true" className="btn-secondary btn-lg">
                  View Offers
                </Link>
              </div>

              {/* Promo chips */}
              {promoItems.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {promoItems.map(({ icon: Icon, label }) => (
                    <span key={label} className="inline-flex items-center gap-1.5 bg-white border border-[#E5E5E5] px-3 py-1.5 text-[11px] font-semibold text-[#111111]">
                      <Icon className="h-3.5 w-3.5 text-[#C9A227]" aria-hidden="true" />
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Visual */}
            <div className="relative hidden md:block">
              <div className="grid grid-cols-2 gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80"
                  alt="Luxury black abaya"
                  width={240}
                  height={300}
                  className="object-cover w-full aspect-[4/5] border border-[#E5E5E5]"
                  sizes="(min-width: 1024px) 240px, 40vw"
                />
                <Image
                  src="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80"
                  alt="Modern open abaya"
                  width={240}
                  height={300}
                  className="object-cover w-full aspect-[4/5] border border-[#E5E5E5] mt-8"
                  sizes="(min-width: 1024px) 240px, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. SHOP BY CATEGORY ═══════════ */}
      <section className="py-8 lg:py-12 bg-white" aria-labelledby="category-heading">
        <div className="container-xl">
          <SectionHeader eyebrow="Browse" title="Shop by Category" href="/shop" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group flex items-center gap-3 bg-[#F8F6F2] border border-[#E5E5E5] hover:border-[#111111] p-3 transition-colors"
              >
                <div className="relative w-14 h-16 flex-shrink-0 bg-white border border-[#E5E5E5] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#111111] leading-tight group-hover:text-[#C9A227] transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{cat.productCount} styles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 3. TODAY'S OFFERS ═══════════ */}
      <section className="py-8 lg:py-12 bg-[#FFF7E6] border-y border-[#EED9A9]" aria-labelledby="deals-heading">
        <div className="container-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-red-600 block mb-1">Limited time</span>
              <h2 id="deals-heading" className="text-lg sm:text-2xl font-bold text-[#111111]">
                Deals &amp; Offers
              </h2>
            </div>
            <Link href="/shop?sale=true" className="flex items-center gap-1 text-sm font-semibold text-[#111111] hover:text-red-600 whitespace-nowrap">
              See all deals <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
            {deals.map((product) => (
              <div key={product.id} className="snap-start">
                <DealsCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 4. BEST SELLERS ═══════════ */}
      <section className="py-8 lg:py-12 bg-white" aria-labelledby="best-heading">
        <div className="container-xl">
          <SectionHeader eyebrow="Most loved" title="Best Sellers" href="/shop?sort=best-selling" />
          <ProductGrid products={bestSellers.slice(0, 4)} columns={4} priorityCount={4} />
        </div>
      </section>

      {/* ═══════════ 5. NEW ARRIVALS ═══════════ */}
      <section className="py-8 lg:py-12 bg-[#F8F6F2]" aria-labelledby="new-heading">
        <div className="container-xl">
          <SectionHeader eyebrow="Just in" title="New Arrivals" href="/shop?tag=new" />
          <ProductGrid products={newArrivals.slice(0, 4)} columns={4} />
        </div>
      </section>

      {/* ═══════════ 6. LUXURY COLLECTION ═══════════ */}
      <section className="py-8 lg:py-12 bg-white" aria-labelledby="luxury-heading">
        <div className="container-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-8 w-1 bg-[#C9A227] flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <h2 id="luxury-heading" className="text-lg sm:text-2xl font-bold text-[#111111]">
                Luxury Collection
              </h2>
              <p className="text-xs text-[#6B7280]">Hand-embroidered masterpieces for weddings &amp; special occasions</p>
            </div>
            <Link href="/shop?collection=luxury" className="flex items-center gap-1 text-sm font-semibold text-[#111111] hover:text-[#C9A227] whitespace-nowrap">
              Explore <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {luxury.map((product) => (
              <DealsCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 7. SHOP BY OCCASION ═══════════ */}
      <section className="py-8 lg:py-12 bg-[#111111]" aria-labelledby="occasion-heading">
        <div className="container-xl">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A227] block mb-1">Find your fit</span>
              <h2 id="occasion-heading" className="text-lg sm:text-2xl font-bold text-white">Shop by Occasion</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {occasions.map((occ) => (
              <Link
                key={occ.id}
                href={`/shop?occasion=${occ.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-white/10 border border-white/10"
              >
                <Image
                  src={occ.image}
                  alt={occ.name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  sizes="(max-width: 640px) 50vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-[12px] font-semibold leading-tight">{occ.name}</p>
                  <p className="text-white/60 text-[10px] mt-0.5">{occ.productCount} styles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 8. TRENDING NOW ═══════════ */}
      <section className="py-8 lg:py-12 bg-white" aria-labelledby="trending-heading">
        <div className="container-xl">
          <SectionHeader eyebrow="Most searched" title="Trending Now" href="/shop?sort=best-selling" />
          <ProductGrid products={trending.slice(0, 4)} columns={4} />
        </div>
      </section>

      {/* ═══════════ 9. CUSTOMER REVIEWS ═══════════ */}
      <section className="py-8 lg:py-12 bg-[#F8F6F2]" aria-labelledby="reviews-heading">
        <div className="container-xl">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 fill-[#f5a623] text-[#f5a623]" aria-hidden="true" />
            <h2 id="reviews-heading" className="text-lg sm:text-2xl font-bold text-[#111111]">
              Loved by Women Across India
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <figure key={review.id} className="bg-white border border-[#E5E5E5] p-5">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={i <= review.rating ? 'h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]' : 'h-3.5 w-3.5 fill-gray-200 text-gray-200'}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="text-sm text-[#4b5563] leading-relaxed mb-4">&ldquo;{review.comment}&rdquo;</blockquote>
                <figcaption>
                  <p className="text-[13px] font-semibold text-[#111111]">{review.userName}</p>
                  <p className="text-[11px] text-[#6B7280] flex items-center gap-1">
                    {review.location}
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-0.5 text-green-600 font-medium">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Verified Purchase
                      </span>
                    )}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 10. TRUST / WHY SHOP WITH US ═══════════ */}
      <section className="py-8 lg:py-12 bg-white border-b border-[#E5E5E5]" aria-label="Why shop with us">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: 'Secure Payments', sub: 'SSL-encrypted, UPI & cards' },
              { icon: Zap, title: 'COD Available', sub: 'Pay when it arrives' },
              { icon: RotateCcw, title: 'Easy Returns', sub: '14-day hassle-free policy' },
              { icon: Truck, title: 'Fast Delivery', sub: 'Pan-India shipping' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3 border border-[#E5E5E5] p-4 bg-[#F8F6F2]">
                <Icon className="h-6 w-6 text-[#C9A227] flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[13px] font-semibold text-[#111111] leading-tight">{title}</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 11. RECENTLY VIEWED ═══════════ */}
      <section className="py-8 lg:py-12 bg-[#F8F6F2]">
        <RecentlyViewed />
      </section>
    </>
  )
}
