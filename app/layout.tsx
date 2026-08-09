import React from 'react'
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { ToasterProvider } from '@/components/ui/ToasterProvider'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Emirates Abaya World',
    default: 'Emirates Abaya World – Premium Luxury Abayas',
  },
  description:
    'Discover timeless abayas crafted for modern elegance. Shop our luxury collection of handcrafted abayas, hijabs and accessories.',
  keywords: ['abaya', 'luxury abaya', 'hijab', 'modest fashion', 'UAE fashion', 'Islamic fashion'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    siteName: 'Emirates Abaya World',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Emirates Abaya World – Luxury Abaya Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@emiratesabaya',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} font-body antialiased bg-[#F8F6F2] text-[#111111] min-h-screen`}
      >
        {children}
        {/* ToasterProvider is a Client Component — safe to render from Server layout */}
        <ToasterProvider />
      </body>
    </html>
  )
}
