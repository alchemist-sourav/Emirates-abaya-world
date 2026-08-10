import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getProductBySlug, getRelatedProducts, getProductReviews } from '@/lib/services/products'
import { ProductDetailClient } from './ProductDetailClient'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductReviews } from '@/components/products/ProductReviews'
import { FloatingReviewsTab } from '@/components/products/FloatingReviewsTab'
import { RecentlyViewed } from '@/components/home/RecentlyViewed'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0] ?? '', alt: product.name }],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const [product, related, reviews] = await Promise.all([
    getProductBySlug(slug),
    getRelatedProducts(slug, 4),
    getProductReviews(slug),
  ])

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#111111] transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/shop" className="hover:text-[#111111] transition-colors">Shop</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-[#111111] transition-colors capitalize">
            {product.category.replace(/-/g, ' ')}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111111] line-clamp-1">{product.name}</span>
        </nav>

        {/* Product detail */}
        <ProductDetailClient product={product} />

        {/* Floating reviews tab */}
        <FloatingReviewsTab />

        {/* Reviews */}
        <div className="mt-10 scroll-mt-24" id="reviews">
          <ProductReviews reviews={reviews} rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-10 py-10 border-t border-gray-100" aria-labelledby="related-heading">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-[#C9A227] text-xs font-semibold uppercase tracking-[0.25em] block mb-1">You may also like</span>
                <h2 id="related-heading" className="font-heading text-2xl font-bold text-[#111111]">
                  Related Products
                </h2>
              </div>
            </div>
            <ProductGrid products={related} columns={4} />
          </section>
        )}

        {/* Recently viewed */}
        <div className="mt-6 pb-10">
          <RecentlyViewed />
        </div>
      </div>
    </div>
  )
}
