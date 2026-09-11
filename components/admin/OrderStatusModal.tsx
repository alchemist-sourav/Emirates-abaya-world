import { X } from 'lucide-react'
import type { AdminOrder, AdminOrderStatus } from '@/types/admin'
import { OrderStatusBadge } from './OrderStatusBadge'

const ALL_STATUSES: AdminOrderStatus[] = [
  'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded',
]

const STATUS_HINTS: Record<AdminOrderStatus, string> = {
  Pending: 'Awaiting confirmation from the business',
  Confirmed: 'Order confirmed and awaiting processing',
  Processing: 'Order is being prepared',
  Packed: 'Order is packed and ready for dispatch',
  Shipped: 'Order has been shipped to the customer',
  Delivered: 'Order has been delivered',
  Cancelled: 'Order has been cancelled',
  Refunded: 'Order has been cancelled and refunded',
}

interface Props {
  order: AdminOrder
  onClose: () => void
  onConfirm: (status: AdminOrderStatus) => void
  loading: boolean
}

export function OrderStatusModal({ order, onClose, onConfirm, loading }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Change order status">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="font-semibold text-[#111111]">Change Order Status</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F8F6F2] rounded-lg transition-colors" aria-label="Close">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-[#6B7280] mb-1">Order <span className="font-semibold text-[#111111]">{order.order_number}</span></p>
          <p className="text-sm text-[#6B7280] mb-4">Current status: <OrderStatusBadge status={order.status} /></p>

          <div className="space-y-2">
            {ALL_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => !loading && onConfirm(status)}
                disabled={loading || status === order.status}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all
                  ${status === order.status
                    ? 'border-[#C9A227] bg-amber-50 cursor-default'
                    : 'border-[#E5E5E5] hover:border-[#C9A227] hover:bg-[#F8F6F2] cursor-pointer'
                  }`}
              >
                <div className="text-left">
                  <span className={`font-semibold ${status === order.status ? 'text-[#C9A227]' : 'text-[#111111]'}`}>
                    {status}
                  </span>
                  <span className="block text-xs text-[#6B7280] mt-0.5">{STATUS_HINTS[status]}</span>
                </div>
                <OrderStatusBadge status={status} />
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold border border-[#E5E5E5] rounded-full text-[#111111] hover:bg-[#F8F6F2] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
