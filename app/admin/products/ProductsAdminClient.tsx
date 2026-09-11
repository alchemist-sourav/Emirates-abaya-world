'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Edit, Minus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

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

interface Props {
  initialProducts: ProductRow[]
}

export function ProductsAdminClient({ initialProducts }: Props) {
  const [products] = useState<ProductRow[]>(initialProducts)
  const [search, setSearch] = useState('')

  const filtered = products.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-[#F0EEEC]">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E5E5E5] rounded-lg text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-[#F8F6F2] border-b border-[#E5E5E5]">
            <tr className="text-left text-xs uppercase tracking-wider text-[#6B7280]">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-center">Flags</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EEEC]">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-[#F8F6F2] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-[#F8F6F2]">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex-shrink-0 rounded bg-[#F8F6F2]" />
                    )}
                    <div className="min-w-0">
                      <Link href={`/products/${p.slug}`} target="_blank" className="font-semibold text-[#111111] hover:text-[#C9A227] truncate block">
                        {p.name}
                      </Link>
                      <p className="text-xs text-[#6B7280]">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#6B7280] capitalize">{p.category.replace(/-/g, ' ')}</td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold text-[#111111]">{formatPrice(p.price)}</span>
                  {p.original_price && p.original_price > p.price && (
                    <span className="block text-xs text-gray-400 line-through">{formatPrice(p.original_price)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`inline-flex items-center gap-1 font-semibold ${p.stock <= 5 ? 'text-red-600' : 'text-[#111111]'}`}>
                    {p.stock <= 5 && <Minus className="h-3 w-3 text-red-500" />}
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {p.is_new && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">NEW</span>}
                    {p.is_featured && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">FEATURED</span>}
                    {p.is_on_sale && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">SALE</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#C9A227] hover:text-[#111111] border-b border-[#C9A227] hover:border-[#111111] pb-0.5 transition-colors"
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
