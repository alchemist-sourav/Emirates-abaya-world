"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  currency: string
  image: string
  slug: string
  quantity: number
  size?: string
  color?: string
  length?: string
  hijab?: string
  hijabPrice?: number
}

export type CartItemInput = Omit<CartItem, "quantity"> & { quantity?: number }

interface CartState {
  items: CartItem[]
  isDrawerOpen: boolean
  addItem: (item: CartItemInput) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      addItem: (item) => {
        const quantity = Math.max(1, item.quantity ?? 1)
        const existingItem = get().items.find((i) => i.id === item.id)
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          })
        } else {
          set({
            items: [
              ...get().items,
              {
                id: item.id,
                productId: item.productId,
                name: item.name,
                price: item.price,
                currency: item.currency,
                image: item.image,
                slug: item.slug,
                quantity,
                size: item.size,
                color: item.color,
                length: item.length,
                hijab: item.hijab,
                hijabPrice: item.hijabPrice,
              },
            ],
          })
        }
      },
      removeItem: (id: string) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) })
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + (item.price + (item.hijabPrice ?? 0)) * item.quantity,
          0
        ),
      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "emirates-cart-storage",
      version: 3,
      storage: createJSONStorage(() => sessionStorage),
      migrate: (persistedState) => ({
        ...(persistedState as Partial<CartState>),
        items: [],
        isDrawerOpen: false,
      }),
    }
  )
)
