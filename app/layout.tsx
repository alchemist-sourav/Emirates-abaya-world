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
    template: '%s | EMIRATES',
    default: 'EMIRATES — Premium Modest Fashion, Kerala',
  },
  description:
    'Bringing bespoke modesty and modern premium abayas to women across the globe. Handcrafted with fine fabrics in Kerala, India.',
  keywords: ['abaya', 'luxury abaya', 'hijab', 'modest fashion', 'India fashion', 'Kerala fashion', 'EMIRATES'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'EMIRATES',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EMIRATES — Premium Modest Fashion, Kerala',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@emiratesabayaworld',
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
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-[#FAF7F2] text-[#111111] min-h-screen`}
      >
        {children}
        {/* ToasterProvider is a Client Component — safe to render from Server layout */}
        <ToasterProvider />
      </body>
    </html>
  )
}
