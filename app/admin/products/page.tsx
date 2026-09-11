import { createClient } from '@/lib/supabase/server'
import { Package } from 'lucide-react'
import { ProductsAdminClient } from './ProductsAdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products, count } = await supabase
    .from('products')
    .select('id, slug, name, price, original_price, stock, category, images, is_featured, is_on_sale, is_new, rating, review_count, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">Products</h1>
          <p className="text-sm text-[#6B7280] mt-1">{count ?? 0} products</p>
        </div>
        <a
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-full hover:bg-[#C9A227] hover:text-[#111111] transition-colors"
        >
          + Add Product
        </a>
      </div>

      {(!products || products.length === 0) ? (
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-16 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-[#6B7280]">No products found.</p>
          <a href="/admin/products/new" className="mt-3 inline-block text-sm font-semibold text-[#C9A227] hover:text-[#111111]">
            Add your first product →
          </a>
        </div>
      ) : (
        <ProductsAdminClient initialProducts={products as ProductRow[]} />
      )}
    </div>
  )
}

interface ProductRow {
  id: string
  slug: string
  name: string
  price: number
  original_price: number | null
  stock: number
  category: string
  images: string[] | null
  is_featured: boolean
  is_on_sale: boolean
  is_new: boolean
  rating: number
  review_count: number
  created_at: string
}
