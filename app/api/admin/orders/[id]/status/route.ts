import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { AdminOrderStatus } from '@/types/admin'

const VALID_STATUSES: AdminOrderStatus[] = [
  'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded',
]

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Admin authorization check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const newStatus = body?.status as AdminOrderStatus

  if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  const { data: order, error } = await supabase
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, status, updated_at')
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found or update failed' }, { status: 404 })
  }

  // Audit log
  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'order_status_changed',
    target_table: 'orders',
    target_id: id,
    metadata: { order_number: id, previous_status: null, new_status: newStatus },
  })

  return NextResponse.json({ order })
}
