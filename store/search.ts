import { create } from 'zustand'

export interface SearchState {
  query: string
  isOpen: boolean
  results: string[]
  recentSearches: string[]
  setQuery: (query: string) => void
  openSearch: () => void
  closeSearch: () => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  setResults: (results: string[]) => void
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: '',
  isOpen: false,
  results: [],
  recentSearches: [],

  setQuery: (query) => set({ query }),

  openSearch: () => set({ isOpen: true }),

  closeSearch: () => set({ isOpen: false, query: '' }),

  addRecentSearch: (query) => {
    const { recentSearches } = get()
    const filtered = recentSearches.filter((s) => s !== query)
    set({ recentSearches: [query, ...filtered].slice(0, 8) })
  },

  clearRecentSearches: () => set({ recentSearches: [] }),

  setResults: (results) => set({ results }),
}))
