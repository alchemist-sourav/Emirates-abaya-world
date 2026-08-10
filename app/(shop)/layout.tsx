import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { QuickViewModal } from '@/components/products/QuickViewModal'
import { CartDrawer } from '@/components/cart/CartDrawer'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <SearchOverlay />
      <QuickViewModal />
      <CartDrawer />
      <FloatingWhatsApp />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
