'use client'

import React from 'react'

const SECTIONS = [
  { title: 'Acceptance of Terms', body: 'By using this website you agree to these terms. Please review them carefully; continued use of the site constitutes acceptance.' },
  { title: 'Products & Pricing', body: 'All prices are displayed in Indian Rupees (INR) inclusive of applicable taxes unless stated otherwise. We reserve the right to correct pricing errors and update product information without prior notice.' },
  { title: 'Orders', body: 'An order is confirmed only when you receive a confirmation on the order success page and via email. We may cancel orders in case of payment failure, stock unavailability or suspected fraud, with a full refund.' },
  { title: 'Payments', body: 'We accept UPI, cards, net banking, wallets and Cash on Delivery. All online payments are processed by trusted payment partners. COD is subject to availability and order value limits.' },
  { title: 'Delivery & Returns', body: 'Delivery timelines are estimates. Returns are governed by our Returns & Exchanges policy. Please read the Shipping and Returns pages for full details.' },
  { title: 'Intellectual Property', body: 'All content on this site — designs, images, text and branding — is the property of Emirates Abaya World and may not be reproduced without permission.' },
  { title: 'Limitation of Liability', body: 'To the maximum extent permitted by law, Emirates Abaya World is not liable for indirect or consequential damages arising from the use of this website.' },
  { title: 'Governing Law', body: 'These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.' },
]

export default function TermsPage() {
  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <h1 className="font-heading text-3xl font-bold text-[#111111] mb-3">Terms of Service</h1>
        <p className="text-gray-600 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="space-y-6">
          {SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <h2 className="font-semibold text-[#111111] mb-2">{title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-8">
          Questions? Email{' '}
          <a href="mailto:care@emiratesabayaworld.com" className="underline">care@emiratesabayaworld.com</a>.
        </p>
      </div>
    </div>
  )
}
