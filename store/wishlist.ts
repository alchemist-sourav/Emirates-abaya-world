"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  currency: string
  image: string
  slug: string
  rating?: number
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  hasItem: (id: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const exists = get().items.some(
          (i) => (i.productId ?? i.id) === (item.productId ?? item.id)
        )
        if (exists) return
        set({ items: [...get().items, item] })
      },
      removeItem: (id: string) =>
        set({
          items: get().items.filter(
            (i) => (i.productId ?? i.id) !== id
          ),
        }),
      hasItem: (id: string) =>
        get().items.some((i) => (i.productId ?? i.id) === id),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "emirates-wishlist-storage",
      version: 2,
      storage: createJSONStorage(() => sessionStorage),
      migrate: (persistedState) => ({
        ...(persistedState as Partial<WishlistState>),
        items: [],
      }),
    }
  )
)
