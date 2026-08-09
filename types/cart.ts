export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded'

export interface ShippingAddress {
  fullName: string
  phone: string
  email: string
  address: string
  apartment?: string
  city: string
  state: string
  pinCode: string
  country: string
  isDefault?: boolean
}

export type BillingAddress = ShippingAddress

export interface DeliveryMethod {
  id: string
  name: string
  description: string
  price: number
  currency: string
  estimatedDays: string
}

export interface PaymentMethodOption {
  id: string
  type: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'
  name: string
  description: string
  icon: string
  isEnabled: boolean
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  shippingAddress: ShippingAddress
  billingAddress: BillingAddress
  deliveryMethod: DeliveryMethod
  paymentMethodType: string
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  currency: string
  notes?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  size?: string
  length?: string
  hijab?: string
  quantity: number
  slug: string
}

export interface Coupon {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderValue?: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  isActive: boolean
}
