import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface RecentlyViewedState {
  ids: string[]
  addProduct: (id: string) => void
  clear: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      ids: [],
      addProduct: (id) => {
        const ids = get().ids.filter((i) => i !== id)
        set({ ids: [id, ...ids].slice(0, 8) })
      },
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'recently-viewed-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
