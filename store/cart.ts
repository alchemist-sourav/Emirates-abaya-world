import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SITE_CONFIG } from '@/lib/data/products'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  currency: string
  image: string
  size?: string
  length?: string
  hijab?: string
  hijabPrice?: number
  quantity: number
  slug: string
}

export interface CartState {
  items: CartItem[]
  isDrawerOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.length === item.length &&
            i.hijab === item.hijab
        )

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) })
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          })
        }
      },

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getItemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) =>
            total + (item.price + (item.hijabPrice ?? 0)) * item.quantity,
          0
        ),

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = subtotal >= SITE_CONFIG.freeShippingAbove ? 0 : SITE_CONFIG.baseShippingFee
        const tax = subtotal * SITE_CONFIG.taxRate
        return subtotal + shipping + tax
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
