import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminInventoryPage() {
  const supabase = await createClient()
  const { data: inventory } = await supabase
    .from('inventory')
    .select('id, product_id, sku, size, color, length, stock_quantity, low_stock_threshold, products(name, stock)')
    .order('product_id', { ascending: true })
    .order('size', { ascending: true })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">Inventory</h1>
        <p className="text-sm text-[#6B7280] mt-1">{inventory?.length ?? 0} inventory rows</p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-[#F8F6F2] border-b border-[#E5E5E5]">
              <tr className="text-left text-xs uppercase tracking-wider text-[#6B7280]">
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Size</th>
                <th className="px-5 py-3">Color</th>
                <th className="px-5 py-3">Length</th>
                <th className="px-5 py-3 text-right">Stock</th>
                <th className="px-5 py-3 text-right">Threshold</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEEC]">
              {(!inventory || inventory.length === 0) && (
                <tr><td colSpan={8} className="px-5 py-16 text-center text-sm text-[#6B7280]">No inventory records</td></tr>
              )}
              {inventory?.map(row => {
                const isLow = row.stock_quantity <= (row.low_stock_threshold ?? 3)
                const isOut = row.stock_quantity === 0
                return (
                  <tr key={row.id} className="hover:bg-[#F8F6F2] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-[#6B7280]">{row.sku}</td>
                    <td className="px-5 py-3.5 font-semibold text-[#111111]">
                      {(row.products as Array<{ name?: string }> | null)?.[0]?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-[#6B7280]">{row.size ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[#6B7280]">{row.color ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[#6B7280]">{row.length ?? '—'}</td>
                    <td className={`px-5 py-3.5 text-right font-semibold ${isOut ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-[#111111]'}`}>
                      {row.stock_quantity}
                    </td>
                    <td className="px-5 py-3.5 text-right text-[#6B7280]">{row.low_stock_threshold ?? '—'}</td>
                    <td className="px-5 py-3.5 text-center">
                      {isOut ? (
                        <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-red-100 text-red-700">Out of Stock</span>
                      ) : isLow ? (
                        <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">Low Stock</span>
                      ) : (
                        <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-green-100 text-green-700">In Stock</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
