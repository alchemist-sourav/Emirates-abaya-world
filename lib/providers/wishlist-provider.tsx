'use client'

import { useWishlistStore } from '@/store/wishlist'

// Re-export the store hook directly - no extra context needed
export { useWishlistStore as useWishlist }

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
