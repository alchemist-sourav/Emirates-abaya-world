'use client'

import { useState, useCallback, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { AdminOrder, AdminOrderStatus } from '@/types/admin'
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge'
import { OrderStatusModal } from '@/components/admin/OrderStatusModal'
import { OrderDetailModal } from '@/components/admin/OrderDetailModal'
import { createClient } from '@/lib/supabase/server'

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All Orders' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Packed', label: 'Packed' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
]

interface Props {
  initialOrders: AdminOrder[]
  totalCount: number
}

export function OrdersPageClient({ initialOrders, totalCount }: Props) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [localCount, setLocalCount] = useState<number>(totalCount)

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      `${o.first_name} ${o.last_name}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || o.status === statusFilter
    return matchSearch && matchStatus
  })

useEffect(() => {
    ;(async () => {
      const supabase = await createClient()
      const channel = supabase.channel('admin_new_orders')
      ;(channel.on as any)/* eslint-disable-line @typescript-eslint/no-explicit-any */(
        'INSERT',
        (payload: { event: string; new: AdminOrder }) => {
          const newOrder = payload.new as AdminOrder
          setOrders(prev => [newOrder, ...prev].slice(0, 100))
          setLocalCount((prev) => prev + 1)
        },
        () => {}
      )
      channel.subscribe()
      return () => {
        supabase.removeChannel(channel)
      }
    })()
  }, [])

  const handleStatusUpdate = useCallback(async (orderId: string, newStatus: AdminOrderStatus) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Update failed')
      const { order } = await res.json()
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: order.status, updated_at: order.updated_at } : o))
      if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: order.status, updated_at: order.updated_at })
    } catch {
      alert('Failed to update order status. Please try again.')
    } finally {
      setUpdating(false)
      setStatusModalOpen(false)
    }
  }, [selectedOrder])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">Orders</h1>
        <p className="text-sm text-[#6B7280] mt-1">{localCount} total orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by order number, email, name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E5E5E5] rounded-lg text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-[#E5E5E5] rounded-lg text-sm bg-white focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227] cursor-pointer"
          >
            {STATUS_FILTERS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" aria-hidden="true" />
        </div>
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter('') }}
            className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#111111] transition-colors"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-[#F8F6F2] border-b border-[#E5E5E5]">
              <tr className="text-left text-xs uppercase tracking-wider text-[#6B7280]">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3 text-right">Items</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-right">Status</th>
                <th className="px-5 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEEC]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm text-[#6B7280]">
                    No orders found
                  </td>
                </tr>
              )}
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-[#F8F6F2] transition-colors">
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="font-semibold text-[#111111] hover:text-[#C9A227] text-left"
                    >
                      {order.order_number}
                    </button>
                    <p className="text-xs text-[#6B7280] mt-0.5">{order.payment_method?.toUpperCase()} · {order.payment_status}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[#111111]">{order.first_name} {order.last_name}</p>
                    <p className="text-xs text-[#6B7280]">{order.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right text-[#6B7280]">
                    {order.order_items?.length ?? '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-[#111111]">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => { setSelectedOrder(order); setStatusModalOpen(true) }}
                      disabled={updating}
                      className="inline-block"
                    >
                      <OrderStatusBadge status={order.status} />
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-[#6B7280]">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && !statusModalOpen && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onChangeStatus={() => setStatusModalOpen(true)}
        />
      )}

      {/* Status change modal */}
      {selectedOrder && statusModalOpen && (
        <OrderStatusModal
          order={selectedOrder}
          onClose={() => setStatusModalOpen(false)}
          onConfirm={(newStatus) => handleStatusUpdate(selectedOrder.id, newStatus)}
          loading={updating}
        />
      )}
    </div>
  )
}
