import type { AdminOrderStatus } from '@/types/admin'

const STYLES: Record<AdminOrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Processing: 'bg-indigo-100 text-indigo-700',
  Packed: 'bg-purple-100 text-purple-700',
  Shipped: 'bg-cyan-100 text-cyan-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-gray-200 text-gray-600',
  Refunded: 'bg-red-100 text-red-700',
}

export function OrderStatusBadge({ status }: { status: AdminOrderStatus | string }) {
  const style = STYLES[status as AdminOrderStatus] ?? 'bg-gray-100 text-gray-600'
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${style} cursor-pointer hover:opacity-80`}>
      {status}
    </span>
  )
}
