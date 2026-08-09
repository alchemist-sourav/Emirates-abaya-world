'use client'

import React from 'react'

const SECTIONS = [
  { title: 'Information We Collect', body: 'We collect information you provide when placing an order — name, mobile number, email, delivery address and payment details (processed securely by our payment partners; we never store full card numbers).' },
  { title: 'How We Use Your Information', body: 'Your details are used to process orders, arrange delivery, send order updates and improve your shopping experience. We may send promotional messages only if you opt in.' },
  { title: 'Data Sharing', body: 'We share information only with service providers essential to fulfil your order (logistics partners, payment processors). We never sell your personal data.' },
  { title: 'Data Security', body: 'All transactions are encrypted. Access to your personal data is restricted to authorised staff who require it to serve you.' },
  { title: 'Your Rights', body: 'You may request a copy of the data we hold, or ask us to correct or delete it, at any time by contacting care@emiratesabayaworld.com.' },
  { title: 'Cookies', body: 'Our store uses cookies to keep your cart and preferences while you browse. You can disable cookies in your browser, though some features may not work as intended.' },
]

export default function PrivacyPage() {
  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <h1 className="font-heading text-3xl font-bold text-[#111111] mb-3">Privacy Policy</h1>
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
          Questions about privacy? Email{' '}
          <a href="mailto:care@emiratesabayaworld.com" className="underline">care@emiratesabayaworld.com</a>.
        </p>
      </div>
    </div>
  )
}
