import { createClient } from '@/lib/supabase/server'
import type { AdminOrder } from '@/types/admin'
import { OrdersPageClient } from '@/app/admin/orders/OrdersPageClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { count, data: orders } = await supabase
    .from('orders')
    .select('id, order_number, email, first_name, last_name, total, currency, status, payment_method, payment_status, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(100)

  // Fetch items for each order
  const orderIds = (orders ?? []).map(o => o.id)
  const { data: allItems } = orderIds.length > 0
    ? await supabase
        .from('order_items')
        .select('id, order_id, product_name, quantity, unit_price, selected_size, selected_color, subtotal')
        .in('order_id', orderIds)
    : { data: [] }

  const itemsByOrder: Record<string, NonNullable<AdminOrder['order_items']>> = {}
  for (const item of (allItems ?? [])) {
    if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = []
    itemsByOrder[item.order_id].push(item as NonNullable<AdminOrder['order_items']>[number])
  }

  const ordersWithItems: AdminOrder[] = (orders ?? []).map(o => ({
    id: o.id,
    order_number: o.order_number,
    user_id: null,
    email: o.email,
    first_name: o.first_name,
    last_name: o.last_name,
    phone: '',
    shipping_address: {},
    delivery_method: '',
    payment_method: o.payment_method,
    payment_status: o.payment_status,
    shipping_fee: 0,
    cod_fee: 0,
    discount_amount: 0,
    tax_amount: 0,
    subtotal: o.total,
    total: o.total,
    currency: o.currency,
    status: o.status,
    notes: undefined,
    created_at: o.created_at,
    updated_at: o.created_at,
    order_items: itemsByOrder[o.id] ?? [],
  }))

  return (
    <OrdersPageClient
      initialOrders={ordersWithItems}
      totalCount={count ?? 0}
    />
  )
}
