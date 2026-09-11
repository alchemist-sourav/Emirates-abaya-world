import { createClient } from '@/lib/supabase/server'
import { Tags } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">Categories</h1>
        <p className="text-sm text-[#6B7280] mt-1">{categories?.length ?? 0} categories</p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-[#F8F6F2] border-b border-[#E5E5E5]">
              <tr className="text-left text-xs uppercase tracking-wider text-[#6B7280]">
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3 text-right">Products</th>
                <th className="px-5 py-3 text-center">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEEC]">
              {(!categories || categories.length === 0) && (
                <tr><td colSpan={4} className="px-5 py-16 text-center text-sm text-[#6B7280]">No categories yet</td></tr>
              )}
              {categories?.map(c => (
                <tr key={c.id} className="hover:bg-[#F8F6F2] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Tags className="h-4 w-4 text-[#C9A227]" />
                      <span className="font-semibold text-[#111111]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#6B7280] font-mono text-xs">{c.slug}</td>
                  <td className="px-5 py-3.5 text-right text-[#6B7280]">{c.product_count}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
