import { createClient } from '@/lib/supabase/server'
import { Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, product_id, user_name, rating, title, comment, status, verified_purchase, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">Reviews</h1>
        <p className="text-sm text-[#6B7280] mt-1">{reviews?.length ?? 0} reviews</p>
      </div>

      <div className="space-y-3">
        {(!reviews || reviews.length === 0) && (
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-16 text-center text-sm text-[#6B7280]">
            No reviews yet
          </div>
        )}
        {reviews?.map(r => (
          <div key={r.id} className="bg-white border border-[#E5E5E5] rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="font-semibold text-[#111111]">{r.title || r.user_name}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">by {r.user_name} · {new Date(r.created_at).toLocaleDateString('en-IN')}</p>
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {r.status}
              </span>
            </div>
            <div className="flex items-center gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-[#C9A227] text-[#C9A227]' : 'text-gray-200'}`}
                />
              ))}
              {r.verified_purchase && (
                <span className="ml-2 text-[10px] font-semibold text-green-700 uppercase tracking-wider">Verified</span>
              )}
            </div>
            <p className="text-sm text-[#6B7280]">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
