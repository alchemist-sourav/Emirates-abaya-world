import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Quote } from 'lucide-react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductCarousel } from '@/components/home/ProductCarousel'
import { RecentlyViewed } from '@/components/home/RecentlyViewed'
import { formatPrice } from '@/lib/utils'
import {
  getNewArrivals,
  getCategories,
  getLuxuryProducts,
  getCollections,
  getCustomerReviews,
  getSiteConfig,
  getProducts,
} from '@/lib/services/products'

export const metadata: Metadata = {
  title: 'EMIRATES — Premium Abayas, Abaya Dresses & Hijabs | Handcrafted in Dubai',
  description:
    'Discover handcrafted abayas, abaya dresses and hijabs from Dubai. Premium modest fashion with express GCC delivery and easy returns.',
  openGraph: {
    title: 'EMIRATES — Premium Modest Fashion, Dubai',
    description: 'Handcrafted abayas and hijabs, tailored for the modern woman.',
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
        <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-[#111111]">{title}</h2>
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
      className="group relative block overflow-hidden bg-[#F7F4F1]"
      style={{ aspectRatio: tall ? '3 / 4' : '16 / 10' }}
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

const INSTAGRAM_GRID = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
  'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80',
  'https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?w=600&q=80',
]

export default async function HomePage() {
  const [
    newArrivals, categories, luxury,
    collections, reviews, config, hijabs, prayer,
  ] = await Promise.all([
    getNewArrivals(8),
    getCategories(),
    getLuxuryProducts(4),
    getCollections(),
    getCustomerReviews(6),
    getSiteConfig(),
    getProducts({ categories: ['hijabs'] }).then((p) => p.slice(0, 4)),
    getProducts({ categories: ['prayer-abayas'] }).then((p) => p.slice(0, 4)),
  ])

  const heroImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80'
  const editorialImage = 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1200&q=80'
  const newBanner = collections.find((c) => c.slug === 'new-arrivals')?.image
  const luxBanner = collections.find((c) => c.slug === 'luxury')?.image

  return (
    <>
      {/* ═══════════ 1. HERO — editorial with watermark ═══════════ */}
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
            <span className="font-heading italic text-[13px] lg:text-sm tracking-[0.35em] uppercase text-[#C9A227]">
              New Collection
            </span>
            <h1>Modest Fashion, Redefined</h1>
            <p>
              Handcrafted abayas, abaya dresses and hijabs from the heart of Dubai —
              tailored for the modern woman who moves gracefully through every occasion.
            </p>
            <Link href="/shop?tag=new" className="hero-cta">
              SHOP NOW
            </Link>
          </div>
        </div>
        <span className="absolute bottom-2 right-3 lg:right-8 font-heading font-bold text-[64px] lg:text-[160px] leading-none text-white/10 tracking-[0.15em] select-none pointer-events-none" aria-hidden="true">
          EMIRATES
        </span>
      </section>

      {/* ═══════════ 2. SHOP THE COLLECTIONS — two editorial cards ═══════════ */}
      <section className="py-10 lg:py-14 bg-white" aria-labelledby="collection-heading">
        <div className="site-container">
          <SectionHeader eyebrow="Curated for you" title="Shop the Collections" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <EditorialBanner image={newBanner ?? heroImage} eyebrow="Just in" title="New Arrivals" description="Fresh silhouettes and limited drops, straight from the atelier." href="/shop?tag=new" tall />
            <EditorialBanner image={luxBanner ?? heroImage} eyebrow="The Maison Edit" title="Luxury Abayas" description="Hand-finished masterpieces for weddings, Eid and grand occasions." href="/shop?collection=luxury" tall />
          </div>
        </div>
      </section>

      {/* ═══════════ 3. LATEST DESIGNS — carousel ═══════════ */}
      <section className="py-10 lg:py-14 bg-[#F9F6F2]" aria-labelledby="latest-heading">
        <div className="site-container">
          <SectionHeader eyebrow="Just landed" title="Latest Designs" href="/shop?tag=new" />
          <ProductCarousel products={newArrivals} id="latest-carousel" />
        </div>
      </section>

      {/* ═══════════ 4. SHOP BY CATEGORY ═══════════ */}
      <section className="py-10 lg:py-14 bg-white" aria-labelledby="category-heading">
        <div className="site-container">
          <SectionHeader eyebrow="Browse" title="Shop by Category" href="/shop" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-[#F7F4F1]"
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

      {/* ═══════════ 5. THE EDIT — editorial split banner ═══════════ */}
      <section className="py-10 lg:py-14 bg-[#F9F6F2]" aria-labelledby="edit-heading">
        <div className="site-container grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden">
          <div className="relative min-h-[320px] lg:min-h-full">
            <Image
              src={editorialImage}
              alt="The Emirates Edit — luxury abayas"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="bg-[#111111] text-white p-8 lg:p-14 flex flex-col justify-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] mb-4">The Emirates Edit</span>
            <h2 id="edit-heading" className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-5">
              Where heritage
              <br />
              <span className="italic text-[#D4956A]">meets modern form.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
              Every piece is cut, draped and hand-finished in our Dubai atelier. We obsess over
              fabric, fit and finish so you can feel quietly extraordinary.
            </p>
            <div>
              <Link href="/about" className="inline-flex items-center gap-2 bg-[#C9A227] text-[#111111] text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-[#D4956A] transition-colors">
                Discover Our Story <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
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

      {/* ═══════════ 8. MATCHING HIJABS ═══════════ */}
      <section className="py-10 lg:py-14 bg-white" aria-labelledby="hijab-heading">
        <div className="site-container">
          <SectionHeader eyebrow="Complement" title="Matching Hijabs" href="/shop?category=hijabs" />
          <ProductGrid products={hijabs} columns={4} />
        </div>
      </section>

      {/* ═══════════ 9. TESTIMONIALS ═══════════ */}
      <section className="py-10 lg:py-14 bg-[#F9F6F2]" aria-labelledby="reviews-heading">
        <div className="site-container">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-3">Testimonials</span>
            <h2 id="reviews-heading" className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">
              Loved by women worldwide
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review) => (
              <figure key={review.id} className="bg-white border border-[#F0EEEC] rounded-xl p-7 relative hover:shadow-md transition-shadow">
                <Quote className="h-7 w-7 text-[#C9A227]/40 mb-4" strokeWidth={1.2} aria-hidden="true" />
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
                <blockquote className="text-sm text-[#4b5563] leading-relaxed mb-5">&ldquo;{review.comment}&rdquo;</blockquote>
                <figcaption className="border-t border-gray-100 pt-4">
                  <p className="text-[13px] font-semibold text-[#111111]">{review.userName}</p>
                  <p className="text-[11px] text-[#6B7280]">{review.location}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 10. BRAND STORY ═══════════ */}
      <section className="py-12 lg:py-16 bg-white" aria-labelledby="about-heading">
        <div className="site-container max-w-3xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-3">Our Story</span>
          <h2 id="about-heading" className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] mb-4">
            Elegance, Tailored for the Modern Woman
          </h2>
          <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed mb-6">
            EMIRATES brings refined, handcrafted modest fashion from Dubai to women across the
            globe. Each abaya is designed for grace, comfort and every occasion — from everyday
            elegance to weddings and prayer. Quality-checked, delivered worldwide
            {config.claims.freeShipping ? ` with free shipping above ${formatPrice(config.freeShippingAbove)},` : ''} and
            easy returns.
          </p>
          <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111] border-b border-[#111111] pb-1 hover:border-[#C9A227] hover:text-[#C9A227] transition-colors">
            Read More <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ═══════════ 11. INSTAGRAM GRID ═══════════ */}
      <section className="py-10 lg:py-14 bg-[#FAF7F2]" aria-labelledby="instagram-heading">
        <div className="site-container">
          <div className="text-center mb-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-3">Follow the maison</span>
            <h2 id="instagram-heading" className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] mb-1">
              @{config.instagram.replace('@', '')}
            </h2>
            <p className="text-sm text-gray-500">Daily style inspiration, atelier glimpses and member previews.</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {INSTAGRAM_GRID.map((src, i) => (
              <a
                key={i}
                href={`https://instagram.com/${config.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden bg-[#F0ECe6]"
                aria-label={`Instagram post ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`EMIRATES Instagram post ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 33vw, 16vw"
                />
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 12. RECENTLY VIEWED ═══════════ */}
      <section className="pb-12 lg:pb-16 bg-white border-t border-[#E5E5E5]">
        <RecentlyViewed />
      </section>
    </>
  )
}