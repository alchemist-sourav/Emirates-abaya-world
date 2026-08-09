import React from 'react'
import { Star, CheckCircle } from 'lucide-react'
import type { ProductReview } from '@/types/product'
import { cn } from '@/lib/utils'

interface ProductReviewsProps {
  reviews: ProductReview[]
  rating: number
  reviewCount: number
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn('h-4 w-4', i < rating ? 'text-[#C9A227] fill-[#C9A227]' : 'text-gray-200')}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function ProductReviews({ reviews, rating, reviewCount }: ProductReviewsProps) {
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="py-12 border-t border-gray-100 scroll-mt-[150px]">
      <h2 id="reviews-heading" className="font-heading text-2xl font-bold text-[#111111] mb-8">
        Customer Reviews
      </h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-10">
        <div className="text-center sm:text-left">
          <p className="font-heading text-5xl font-bold text-[#111111]">{rating}</p>
          <StarDisplay rating={Math.round(rating)} />
          <p className="text-sm text-gray-500 mt-1">{reviewCount} reviews</p>
        </div>
        {/* Rating bars */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length
            const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-4 text-right">{star}</span>
                <Star className="h-3 w-3 text-[#C9A227] fill-[#C9A227]" aria-hidden="true" />
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A227] rounded-full"
                    style={{ width: `${pct}%` }}
                    aria-label={`${pct}% for ${star} stars`}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product.</p>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => (
            <article key={review.id} className="border-b border-gray-100 pb-8">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-[#111111] text-sm">{review.userName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarDisplay rating={review.rating} />
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" aria-hidden="true" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <time className="text-xs text-gray-400" dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </time>
              </div>
              <p className="font-semibold text-[#111111] text-sm mb-2">{review.title}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
