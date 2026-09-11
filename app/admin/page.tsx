import Link from 'next/link'
import { ShoppingBag, Users, Package, TrendingUp, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, getActiveCurrency, currencySymbol } from '@/lib/utils'
import { getSiteConfig } from '@/lib/services/products'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const config = getSiteConfig()
  const currency = getActiveCurrency()
  const symbol = currencySymbol(currency)

  // Fetch aggregate stats in parallel
  const [
    { count: totalOrders },
    { count: pendingOrders },
    { data: revenueRows },
    { count: totalCustomers },
    { count: totalProducts },
    { count: lowStockProducts },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('orders').select('total, currency, payment_status').eq('payment_status', 'Paid'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'admin'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).lte('stock', 5),
    supabase
      .from('orders')
      .select('id, order_number, email, first_name, last_name, total, currency, status, payment_status, created_at')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const totalRevenue = (revenueRows ?? []).reduce((sum: number, r: { total: number }) => sum + Number(r.total), 0)

  const stats = [
    { label: 'Total Revenue', value: `${symbol}${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Total Orders', value: totalOrders ?? 0, icon: ShoppingBag, color: 'text-[#C9A227]', bg: 'bg-amber-50' },
    { label: 'Pending Orders', value: pendingOrders ?? 0, icon: ShoppingBag, color: 'text-orange-700', bg: 'bg-orange-50' },
    { label: 'Total Customers', value: totalCustomers ?? 0, icon: Users, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Total Products', value: totalProducts ?? 0, icon: Package, color: 'text-purple-700', bg: 'bg-purple-50' },
    { label: 'Low Stock', value: lowStockProducts ?? 0, icon: Package, color: 'text-red-700', bg: 'bg-red-50' },
  ]

  const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Processing: 'bg-indigo-100 text-indigo-700',
    Packed: 'bg-purple-100 text-purple-700',
    Shipped: 'bg-cyan-100 text-cyan-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-gray-200 text-gray-600',
    Refunded: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">Welcome back. Here is what is happening with {config.businessName} today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-[#E5E5E5] rounded-xl p-4">
            <div className={`inline-flex items-center justify-center h-9 w-9 rounded-lg ${bg} ${color} mb-3`}>
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <p className="text-xs text-[#6B7280] uppercase tracking-wider">{label}</p>
            <p className="font-heading text-xl font-bold text-[#111111] mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <h2 className="font-semibold text-[#111111]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#C9A227] hover:underline flex items-center gap-1">
            View All
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-[#F8F6F2] border-b border-[#E5E5E5]">
              <tr className="text-left text-xs uppercase tracking-wider text-[#6B7280]">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEEC]">
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#6B7280]">
                    No orders yet
                  </td>
                </tr>
              )}
              {recentOrders?.map((o) => (
                <tr key={o.id} className="hover:bg-[#F8F6F2] transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/orders/${o.id}`} className="font-semibold text-[#111111] hover:text-[#C9A227]">
                      {o.order_number}
                    </Link>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[#111111]">{o.first_name} {o.last_name}</p>
                    <p className="text-xs text-[#6B7280]">{o.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-[#111111]">
                    {formatPrice(o.total)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {o.status}
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
