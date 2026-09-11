import { createClient } from '@/lib/supabase/server'
import { Ticket, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
  const supabase = await createClient()
  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">Coupons</h1>
        <p className="text-sm text-[#6B7280] mt-1">{coupons?.length ?? 0} coupons</p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-[#F8F6F2] border-b border-[#E5E5E5]">
              <tr className="text-left text-xs uppercase tracking-wider text-[#6B7280]">
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3 text-right">Min Order</th>
                <th className="px-5 py-3 text-right">Usage</th>
                <th className="px-5 py-3">Validity</th>
                <th className="px-5 py-3 text-center">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEEC]">
              {(!coupons || coupons.length === 0) && (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-[#6B7280]">No coupons yet</td></tr>
              )}
              {coupons?.map(c => (
                <tr key={c.id} className="hover:bg-[#F8F6F2] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-[#C9A227]" />
                      <span className="font-semibold text-[#111111] font-mono">{c.code}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[#6B7280]">
                    {c.minimum_order_value ? `₹${c.minimum_order_value}` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[#6B7280]">
                    {c.usage_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#6B7280]">
                    {c.starts_at || c.expires_at ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {c.starts_at ? new Date(c.starts_at).toLocaleDateString('en-IN') : '—'} → {c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-IN') : '—'}
                      </span>
                    ) : 'No expiry'}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.active ? 'Active' : 'Inactive'}
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
