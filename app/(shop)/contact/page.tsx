'use client'

import React, { useState } from 'react'
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'

const TOPICS = ['Order Status', 'Returns & Exchanges', 'Size & Fit Help', 'Payment Issue', 'Bespoke / Custom Orders', 'Other']

export default function ContactPage() {
  const config = SITE_CONFIG
  const [submitted, setSubmitted] = useState(false)

  const CONTACT_METHODS = [
    { icon: MapPin, title: 'Flagship Showroom', desc: 'Visit the atelier in Al Quoz', value: config.showroom },
    { icon: MessageCircle, title: 'WhatsApp', desc: 'Fastest — reply within hours', value: config.whatsappNumber, href: `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}` },
    { icon: Mail, title: 'Email', desc: 'Replies within 24 hours', value: config.supportEmail, href: `mailto:${config.supportEmail}` },
    { icon: Phone, title: 'Call Us', desc: 'Mon–Sat, 10 AM – 7 PM GST', value: config.whatsappNumber, href: `tel:${config.whatsappNumber.replace(/[^\d+]/g, '')}` },
  ]

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-4">
            The Atelier
          </span>
          <h1 className="font-heading text-4xl font-bold text-[#111111] mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Reach the EMIRATES team by WhatsApp, email or phone — or visit the flagship atelier in
            Dubai. We reply to every message within 24 hours.
          </p>
        </div>

        {/* Method cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {CONTACT_METHODS.map(({ icon: Icon, title, desc, value, href }) => {
            const Comp = href ? 'a' : 'div'
            return (
              <Comp
                key={title}
                {...(href
                  ? {
                      href,
                      target: href.startsWith('http') ? '_blank' : undefined,
                      rel: href.startsWith('http') ? 'noopener noreferrer' : undefined,
                    }
                  : {})}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-[#C9A227] transition-colors"
              >
                <Icon className="h-7 w-7 text-[#C9A227] mx-auto mb-3" aria-hidden="true" />
                <p className="font-semibold text-[#111111]">{title}</p>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
                <p className="text-sm text-[#111111] mt-2 break-words">{value}</p>
              </Comp>
            )
          })}
        </div>

        {/* Enquiry form + showroom panel */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" aria-hidden="true" />
                <h2 className="font-heading text-xl font-bold text-[#111111] mb-2">Message sent!</h2>
                <p className="text-gray-600 text-sm">
                  Thank you for reaching out. Our team will reply to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
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
                <div className="mb-4">
                  <label htmlFor="topic" className="block text-sm font-medium text-[#111111] mb-1.5">Topic</label>
                  <select id="topic"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227] bg-white">
                    {TOPICS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="mb-5">
                  <label htmlFor="message" className="block text-sm font-medium text-[#111111] mb-1.5">Message</label>
                  <textarea id="message" rows={4} required placeholder="How can we help you?"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227] resize-y" />
                </div>
                <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#C9A227] hover:text-[#111111] transition-colors">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Showroom card */}
          <div className="bg-[#111111] text-white rounded-2xl p-8">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-4">
              Visit Us
            </span>
            <div className="flex items-start gap-3 mb-6">
              <MapPin className="h-5 w-5 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold mb-1">Flagship Showroom</p>
                <p className="text-sm text-gray-400 leading-relaxed">{config.showroom}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold mb-1">Opening Hours</p>
                <p className="text-sm text-gray-400">Mon–Sat: 10:00 AM – 7:00 PM GST</p>
                <p className="text-sm text-gray-400">Sunday: By appointment</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-6">
              Private styling sessions are available on request for brides and occasion dressing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}