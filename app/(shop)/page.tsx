import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { RecentlyViewed } from '@/components/home/RecentlyViewed'
import {
  getBestSellers,
  getNewArrivals,
  getCategories,
  getLuxuryProducts,
  getCollections,
  getCustomerReviews,
  getSiteConfig,
  getProducts,
} from '@/lib/services/products'

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
    <div className="flex items-end justify-between mb-6">
      <div>
        {eyebrow && <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A227] block mb-1.5">{eyebrow}</span>}
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#111111]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-medium text-[#111111] hover:text-[#C9A227] whitespace-nowrap">
          {linkLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

function EditorialBanner({
  image,
  eyebrow,
  title,
  description,
  href,
  cta = 'SHOP NOW',
  overlay = false,
  tall = false,
}: {
  image: string
  eyebrow?: string
  title: string
  description?: string
  href: string
  cta?: string
  overlay?: boolean
  tall?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative block overflow-hidden bg-[#F7F4F1]',
        tall ? 'aspect-[4/5] sm:aspect-[3/4]' : 'aspect-[4/5] sm:aspect-[16/10]'
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        sizes="(max-width: 640px) 100vw, 50vw"
      />
      {overlay && <div className="absolute inset-0 bg-black/25" aria-hidden="true" />}
      <div className={cn(
        'absolute inset-0 flex flex-col justify-end p-6 lg:p-8',
        overlay ? 'text-white' : 'text-[#111111]'
      )}>
        {eyebrow && (
          <span className={cn(
            'text-[10px] font-semibold uppercase tracking-[0.28em] mb-2',
            overlay ? 'text-white/90' : 'text-[#C9A227]'
          )}>
            {eyebrow}
          </span>
        )}
        <h3 className={cn('font-heading text-2xl lg:text-3xl font-bold leading-tight', overlay ? 'text-white' : 'text-[#111111]')}>
          {title}
        </h3>
        {description && (
          <p className={cn('mt-2 text-sm max-w-sm', overlay ? 'text-white/85' : 'text-[#6B7280]')}>
            {description}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] pb-1 border-b transition-colors"
          style={{ borderColor: overlay ? 'rgba(255,255,255,0.6)' : '#C9A227', color: overlay ? '#fff' : '#111111' }}>
          {cta}
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

// Local cn (server component — no clsx tailwind-merge needed)
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default async function HomePage() {
  const [
    bestSellers, newArrivals, categories, luxury,
    collections, reviews, config, hijabs, prayer,
  ] = await Promise.all([
    getBestSellers(4),
    getNewArrivals(4),
    getCategories(),
    getLuxuryProducts(4),
    getCollections(),
    getCustomerReviews(6),
    getSiteConfig(),
    getProducts({ categories: ['hijabs'] }).then((p) => p.slice(0, 4)),
    getProducts({ categories: ['prayer-abayas'] }).then((p) => p.slice(0, 4)),
  ])

  const heroImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80'
  const newBanner = collections.find((c) => c.slug === 'new-arrivals')?.image
  const luxBanner = collections.find((c) => c.slug === 'luxury')?.image
  const saleBanner = collections.find((c) => c.slug === 'sale')?.image

  return (
    <>
      {/* ═══════════ 1. HERO — full-width editorial banner ═══════════ */}
      <section className="hero" aria-label="Featured collection">
        <div className="hero-image">
          <Image
            src={heroImage}
            alt="Luxury abaya collection"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="hero-inner">
          <div className="hero-content">
            <span className="eyebrow">Emirates Abaya World</span>
            <h1>Modesty Meets Elegance</h1>
            <p>Discover our latest abaya collection — handcrafted modest fashion for the modern woman across India.</p>
            <Link href="/shop?tag=new" className="hero-cta">
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. COLLECTION BANNERS — editorial ═══════════ */}
      <section className="py-10 lg:py-14 bg-white" aria-labelledby="collection-heading">
        <div className="site-container">
          <SectionHeader eyebrow="Collections" title="Shop by Collection" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EditorialBanner image={newBanner ?? heroImage} eyebrow="Just in" title="New Arrivals" href="/shop?tag=new" />
            <EditorialBanner image={luxBanner ?? heroImage} eyebrow="Premium" title="Luxury Abayas" href="/shop?collection=luxury" />
            <EditorialBanner image={heroImage} eyebrow="Everyday" title="Everyday Modest Wear" href="/shop?category=everyday-abayas" />
            <EditorialBanner image={saleBanner ?? heroImage} eyebrow="Limited time" title="Clearance Sale" href="/shop?sale=true" />
          </div>
        </div>
      </section>

      {/* ═══════════ 3. CATEGORY COLLECTIONS ═══════════ */}
      <section className="py-10 lg:py-14 bg-[#F9F6F2]" aria-labelledby="category-heading">
        <div className="site-container">
          <SectionHeader eyebrow="Browse" title="Shop by Category" href="/shop" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-white"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/25 opacity-100 group-hover:opacity-70 transition-opacity" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white font-heading text-base font-semibold leading-tight">{cat.name}</p>
                  <p className="text-white/70 text-[11px] mt-0.5">{cat.productCount} styles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 4. NEW ARRIVALS ═══════════ */}
      <section className="py-10 lg:py-14 bg-white" aria-labelledby="new-heading">
        <div className="site-container">
          <SectionHeader eyebrow="Just in" title="New Arrivals" href="/shop?tag=new" />
          <ProductGrid products={newArrivals} columns={4} priorityCount={4} />
        </div>
      </section>

      {/* ═══════════ 5. BESTSELLERS ═══════════ */}
      <section className="py-10 lg:py-14 bg-[#F9F6F2]" aria-labelledby="best-heading">
        <div className="site-container">
          <SectionHeader eyebrow="Most loved" title="Best Sellers" href="/shop?sort=best-selling" />
          <ProductGrid products={bestSellers} columns={4} />
        </div>
      </section>

      {/* ═══════════ 6. FEATURED ABAYAS ═══════════ */}
      <section className="py-10 lg:py-14 bg-white" aria-labelledby="featured-heading">
        <div className="site-container lg:grid lg:grid-cols-[1fr_1.4fr] lg:gap-10 items-center">
          <div className="mb-6 lg:mb-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A227] block mb-2">The Edit</span>
            <h2 id="featured-heading" className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] mb-3">
              Featured Abayas
            </h2>
            <p className="text-[#6B7280] text-sm mb-6 max-w-xs">
              Hand-embroidered masterpieces for weddings, Eid and special occasions.
            </p>
            <Link href="/shop?collection=luxury" className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111] border-b border-[#111111] pb-1 hover:border-[#C9A227] hover:text-[#C9A227] transition-colors">
              Explore the Edit <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ProductGrid products={luxury} columns={4} />
        </div>
      </section>

      {/* ═══════════ 7. PRAYER / UMRAH COLLECTION ═══════════ */}
      <section className="py-10 lg:py-14 bg-[#111111]" aria-labelledby="prayer-heading">
        <div className="site-container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A227] block mb-1.5">Serenity</span>
              <h2 id="prayer-heading" className="font-heading text-xl sm:text-2xl font-bold text-white">Prayer / Umrah Collection</h2>
            </div>
            <Link href="/shop?category=prayer-abayas" className="text-sm text-white/80 hover:text-[#C9A227] whitespace-nowrap flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ProductGrid products={prayer} columns={4} />
        </div>
      </section>

      {/* ═══════════ 8. HIJABS ═══════════ */}
      <section className="py-10 lg:py-14 bg-white" aria-labelledby="hijab-heading">
        <div className="site-container">
          <SectionHeader eyebrow="Complement" title="Matching Hijabs" href="/shop?category=hijabs" />
          <ProductGrid products={hijabs} columns={4} />
        </div>
      </section>

      {/* ═══════════ 9. CUSTOMER REVIEWS ═══════════ */}
      <section className="py-10 lg:py-14 bg-[#F9F6F2]" aria-labelledby="reviews-heading">
        <div className="site-container">
          <SectionHeader eyebrow="Loved by women" title="Customer Reviews" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <figure key={review.id} className="bg-white border border-[#E5E5E5] p-6">
                <div className="flex items-center gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={i <= review.rating ? 'h-3.5 w-3.5 fill-[#C9A227] text-[#C9A227]' : 'h-3.5 w-3.5 fill-gray-200 text-gray-200'}
                      strokeWidth={1}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="text-sm text-[#4b5563] leading-relaxed mb-4">&ldquo;{review.comment}&rdquo;</blockquote>
                <figcaption>
                  <p className="text-[13px] font-semibold text-[#111111]">{review.userName}</p>
                  <p className="text-[11px] text-[#6B7280]">{review.location}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 10. ABOUT / BRAND STORY ═══════════ */}
      <section className="py-12 lg:py-16 bg-white" aria-labelledby="about-heading">
        <div className="site-container max-w-3xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-3">Our Story</span>
          <h2 id="about-heading" className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] mb-4">
            Elegance, Tailored for the Modern Woman
          </h2>
          <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed mb-6">
            Emirates Abaya World brings refined, handcrafted modest fashion to women across India. Each abaya is designed for grace, comfort and every occasion — from everyday elegance to weddings and prayer. Quality-checked, delivered pan-India, with {config.claims.freeShipping ? `free shipping above ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(config.freeShippingAbove)}, ` : ''}COD and easy returns.
          </p>
          <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111] border-b border-[#111111] pb-1 hover:border-[#C9A227] hover:text-[#C9A227] transition-colors">
            Read More <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ═══════════ 11. RECENTLY VIEWED ═══════════ */}
      <section className="pb-12 lg:pb-16 bg-white border-t border-[#E5E5E5]">
        <RecentlyViewed />
      </section>
    </>
  )
}
