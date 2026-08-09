'use client'

import React, { useState } from 'react'
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'

const CONTACT_METHODS = [
  { icon: MessageCircle, title: 'WhatsApp', desc: 'Fastest — reply within hours', value: SITE_CONFIG.whatsappNumber, href: `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/\D/g, '')}` },
  { icon: Mail, title: 'Email', desc: 'Replies within 24 hours', value: 'care@emiratesabayaworld.com', href: 'mailto:care@emiratesabayaworld.com' },
  { icon: Phone, title: 'Call Us', desc: 'Mon–Sat, 10 AM – 7 PM IST', value: SITE_CONFIG.whatsappNumber, href: `tel:${SITE_CONFIG.whatsappNumber}` },
]

const TOPICS = ['Order Status', 'Returns & Refunds', 'Size Help', 'Payment Issue', 'Other']

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-[#111111] mb-3">Contact Us</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            We are here to help. Choose the fastest way to reach us, or drop a message and our
            support team will get back to you within 24 hours.
          </p>
        </div>

        {/* Method cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {CONTACT_METHODS.map(({ icon: Icon, title, desc, value, href }) => (
            <a
              key={title}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-[#C9A227] transition-colors"
            >
              <Icon className="h-7 w-7 text-[#C9A227] mx-auto mb-3" aria-hidden="true" />
              <p className="font-semibold text-[#111111]">{title}</p>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
              <p className="text-sm text-[#111111] mt-2 break-all">{value}</p>
            </a>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" aria-hidden="true" />
              <h2 className="font-heading text-xl font-bold text-[#111111] mb-2">Message sent!</h2>
              <p className="text-gray-600 text-sm">
                Thank you for reaching out. Our team will reply to your email within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
            >
              <h2 className="font-heading text-xl font-bold text-[#111111] mb-6">Send us a message</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#111111] mb-1.5">Full Name</label>
                  <input id="name" type="text" required placeholder="Your name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#111111] mb-1.5">Email</label>
                  <input id="email" type="email" required placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#111111] mb-1.5">Mobile Number</label>
                  <input id="phone" type="tel" maxLength={10} placeholder="10-digit mobile"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
                </div>
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-[#111111] mb-1.5">Topic</label>
                  <select id="topic"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227] bg-white">
                    {TOPICS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="message" className="block text-sm font-medium text-[#111111] mb-1.5">Message</label>
                <textarea id="message" rows={4} required placeholder="How can we help you?"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227] resize-y" />
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2">
                <Send className="h-4 w-4" aria-hidden="true" />
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Store info */}
        <div className="max-w-2xl mx-auto mt-10 bg-[#111111] text-white rounded-lg p-6 flex flex-col sm:flex-row items-start gap-4">
          <MapPin className="h-5 w-5 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold mb-1">Our Boutique</p>
            <p className="text-sm text-gray-400">
              2nd Floor, Fashion Plaza, Linking Road, Mumbai, Maharashtra 400052, India
            </p>
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#C9A227]" aria-hidden="true" />
              Mon–Sat: 10:00 AM – 7:00 PM IST
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
