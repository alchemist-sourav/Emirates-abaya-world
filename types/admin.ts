export type AdminOrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded'

export type AdminPaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded'

export interface AdminOrder {
  id: string
  order_number: string
  user_id: string | null
  email: string
  first_name: string
  last_name: string
  phone: string
  shipping_address: {
    house?: string
    area?: string
    city?: string
    state?: string
    country?: string
    pinCode?: string
  }
  delivery_method: string
  payment_method: string
  payment_status: AdminPaymentStatus
  shipping_fee: number
  cod_fee: number
  discount_amount: number
  tax_amount: number
  subtotal: number
  total: number
  currency: string
  status: AdminOrderStatus
  notes?: string
  created_at: string
  updated_at: string
  order_items?: AdminOrderItem[]
}

export interface AdminOrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string | null
  quantity: number
  unit_price: number
  selected_size: string | null
  selected_color: string | null
  selected_length: string | null
  selected_hijab: string | null
  selected_hijab_price: number
  subtotal: number
  created_at: string
}

export interface AdminProduct {
  id: string
  slug: string
  name: string
  description: string
  short_description: string
  price: number
  original_price: number | null
  currency: string
  category: string
  subcategory: string | null
  occasion: string | null
  collection: string | null
  fabric: string
  color: string
  colors: { id: string; name: string; hex: string }[] | null
  sku: string
  stock: number
  rating: number
  review_count: number
  is_new: boolean
  is_featured: boolean
  is_on_sale: boolean
  tags: string[]
  images: string[]
  created_at: string
  updated_at: string
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  product_count: number
  is_active: boolean
}

export interface AdminCustomer {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string | null
  created_at: string
  updated_at: string
}

export interface AdminReview {
  id: string
  product_id: string | null
  product_name?: string
  user_name: string
  rating: number
  title: string
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  verified_purchase: boolean
  created_at: string
}

export interface AdminCoupon {
  id: string
  code: string
  discount_type: 'fixed' | 'percentage'
  discount_value: number
  minimum_order_value: number | null
  usage_limit: number | null
  usage_count: number
  starts_at: string | null
  expires_at: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface AdminContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface AdminDashboardStats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  totalCustomers: number
  totalProducts: number
  lowStockProducts: number
  recentOrders: AdminOrder[]
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
