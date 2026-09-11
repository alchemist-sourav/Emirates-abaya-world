import { X, Edit, MapPin, Phone, Mail, CreditCard, Truck, Calendar } from 'lucide-react'
import Image from 'next/image'
import type { AdminOrder } from '@/types/admin'
import { formatPrice } from '@/lib/utils'
import { OrderStatusBadge } from './OrderStatusBadge'

interface Props {
  order: AdminOrder
  onClose: () => void
  onChangeStatus: () => void
}

export function OrderDetailModal({ order, onClose, onChangeStatus }: Props) {
  const addr = order.shipping_address ?? {}
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Order details">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-semibold text-[#111111]">Order Details</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">{order.order_number}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#F8F6F2] rounded-lg" aria-label="Close">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#6B7280] uppercase tracking-wider">Status</span>
              <OrderStatusBadge status={order.status} />
              <span className="text-xs text-[#6B7280]">Payment: <span className="font-semibold text-[#111111]">{order.payment_status}</span></span>
            </div>
            <button
              onClick={onChangeStatus}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9A227] hover:text-[#111111] border-b border-[#C9A227] hover:border-[#111111] pb-0.5"
            >
              <Edit className="h-3 w-3" /> Change Status
            </button>
          </div>

          {/* Customer info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">Customer</p>
              <p className="font-semibold text-[#111111]">{order.first_name} {order.last_name}</p>
              <p className="text-sm text-[#6B7280] flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {order.email}
              </p>
              <p className="text-sm text-[#6B7280] flex items-center gap-1.5 mt-1">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {order.phone}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">Shipping Address</p>
              <p className="text-sm text-[#111111] flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-[#6B7280] flex-shrink-0" aria-hidden="true" />
                <span>
                  {addr.house && <>{addr.house}, </>}
                  {addr.area && <>{addr.area}, </>}
                  <br />
                  {addr.city && <>{addr.city}, </>}
                  {addr.state && <>{addr.state} </>}
                  {addr.pinCode && <>- {addr.pinCode}</>}
                  <br />
                  {addr.country}
                </span>
              </p>
            </div>
          </div>

          {/* Line items */}
          <div>
            <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-3">Items ({order.order_items?.length ?? 0})</p>
            <div className="border border-[#E5E5E5] rounded-lg divide-y divide-[#F0EEEC]">
              {order.order_items?.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3">
                  {item.product_image ? (
                    <div className="relative w-14 h-16 flex-shrink-0 rounded overflow-hidden bg-[#F8F6F2]">
                      <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="56px" />
                    </div>
                  ) : (
                    <div className="w-14 h-16 flex-shrink-0 rounded bg-[#F8F6F2]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#111111] truncate">{item.product_name}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {item.selected_size && <>Size: {item.selected_size} · </>}
                      {item.selected_color && <>Color: {item.selected_color} · </>}
                      {item.selected_length && <>Length: {item.selected_length}</>}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {formatPrice(item.unit_price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-sm text-[#111111] flex-shrink-0">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-[#E5E5E5] pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#6B7280]">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>−{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#6B7280]">
              <span>Shipping ({order.delivery_method})</span>
              <span>{order.shipping_fee === 0 ? 'FREE' : formatPrice(order.shipping_fee)}</span>
            </div>
            {order.cod_fee > 0 && (
              <div className="flex justify-between text-[#6B7280]">
                <span>COD Fee</span>
                <span>{formatPrice(order.cod_fee)}</span>
              </div>
            )}
            {order.tax_amount > 0 && (
              <div className="flex justify-between text-[#6B7280]">
                <span>Tax (5% VAT)</span>
                <span>{formatPrice(order.tax_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-[#111111] pt-2 border-t border-[#E5E5E5]">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#6B7280]">
            <div>
              <p className="uppercase tracking-wider">Payment</p>
              <p className="text-[#111111] font-semibold flex items-center gap-1.5 mt-1">
                <CreditCard className="h-3.5 w-3.5" /> {order.payment_method?.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="uppercase tracking-wider">Delivery</p>
              <p className="text-[#111111] font-semibold flex items-center gap-1.5 mt-1 capitalize">
                <Truck className="h-3.5 w-3.5" /> {order.delivery_method}
              </p>
            </div>
            <div>
              <p className="uppercase tracking-wider">Placed</p>
              <p className="text-[#111111] font-semibold flex items-center gap-1.5 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
