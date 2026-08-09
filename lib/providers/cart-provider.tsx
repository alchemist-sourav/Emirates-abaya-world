'use client'

import { useCartStore } from '@/store/cart'

// Re-export the store hook directly - no extra context needed
export { useCartStore as useCart }

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
