'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, CalendarHeart, Send, CheckCircle2, ShieldCheck } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data/products'

const SUBJECTS = [
  'Order Status',
  'Returns & Exchanges',
  'Size & Fit Help',
  'Payment Issue',
  'Bespoke / Custom Orders',
  'Wholesale Enquiry',
  'Other',
]

const PHONE_1 = '8129914915'
const PHONE_2 = '9747793814'

interface InfoCard {
  icon: typeof Mail
  title: string
  desc?: string
  value?: string
  href?: string
  bg: string
  lines?: string[]
  phones?: string[]
}

const INFO_CARDS: InfoCard[] = [
  {
    icon: MapPin,
    title: 'Address',
    lines: ['10/488/CDEF', 'GOV: HOSPITAL KARUNAGAPPALLY', 'KOLLAM, KERALA', 'PIN - 690518'],
    bg: '#F9EEE6',
  },
  {
    icon: Phone,
    title: 'Phone',
    phones: [PHONE_1, PHONE_2],
    desc: 'Mon–Sat, 10:00 AM – 7:00 PM',
    bg: '#FAF0E4',
  },
  {
    icon: ShieldCheck,
    title: 'GST Number',
    value: SITE_CONFIG.gst,
    bg: '#F2EFE8',
  },
  {
    icon: Mail,
    title: 'Client Care Email',
    desc: 'For orders, returns and styling questions.',
    value: SITE_CONFIG.supportEmail,
    href: `mailto:${SITE_CONFIG.supportEmail}`,
    bg: '#FBF1E9',
  },
  {
    icon: CalendarHeart,
    title: 'Private Styling Hours',
    desc: 'Book a personal session, in-store or online.',
    value: 'Sunday: by appointment',
    bg: '#FAF1E2',
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: { [key: string]: string } = {}
    if (!firstName.trim()) errs.firstName = 'First name is required'
    if (!lastName.trim()) errs.lastName = 'Last name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
    if (!message.trim()) errs.message = 'Please write a message'
    setErrors(errs)
    if (Object.keys(errs).length === 0) setSubmitted(true)
  }

  const inputClass = 'w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 bg-white'

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] block mb-4">
            We&rsquo;d Love to Hear From You
          </span>
          <h1 className="font-heading italic text-4xl lg:text-5xl font-semibold text-[#111111] mb-5">
            Get in Touch
          </h1>
          <span className="block w-16 h-px bg-[#C9A227] mx-auto mb-6" aria-hidden="true" />
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Whether it&rsquo;s an order, a sizing question or a bespoke commission — the EMIRATES
            atelier team replies to every message within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
          {/* Enquiry form */}
          <div className="bg-white border border-[#EFE8E1] rounded-2xl p-6 lg:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" aria-hidden="true" />
                <h2 className="font-heading italic text-xl font-semibold text-[#111111] mb-2">Inquiry submitted</h2>
                <p className="text-gray-600 text-sm">
                  Thank you for reaching out. A member of the atelier team will reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="font-heading text-xl font-semibold text-[#111111] mb-6">Send an inquiry</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#111111] mb-1.5">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`${inputClass} ${errors.firstName ? 'border-red-400' : 'border-gray-300'} focus:border-[#C9A227] focus:ring-[#C9A227]`}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#111111] mb-1.5">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`${inputClass} ${errors.lastName ? 'border-red-400' : 'border-gray-300'} focus:border-[#C9A227] focus:ring-[#C9A227]`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-[#111111] mb-1.5">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClass} ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:border-[#C9A227] focus:ring-[#C9A227]`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-[#111111] mb-1.5">Subject</label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`${inputClass} border-gray-300 focus:border-[#C9A227] focus:ring-[#C9A227]`}
                  >
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-[#111111] mb-1.5">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="How can we help you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${inputClass} ${errors.message ? 'border-red-400' : 'border-gray-300'} focus:border-[#C9A227] focus:ring-[#C9A227] resize-y`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] text-white text-sm font-semibold px-10 py-3.5 rounded-full hover:bg-[#C9A227] hover:text-[#111111] transition-colors uppercase tracking-wider"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Atelier cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Business name */}
            <div className="rounded-2xl p-6 bg-[#1A1A1A] text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A227] mb-2">
                Business Name
              </p>
              <p className="font-heading text-lg lg:text-xl font-semibold leading-snug">
                EMIRATES ABAYA WORLD &amp; BOUTIQUE
              </p>
            </div>

            {INFO_CARDS.map(({ icon: Icon, title, desc, value, href, lines, phones, bg }) => {
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
                  className="rounded-2xl p-6 flex items-start gap-4 transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: bg }}
                >
                  <span className="h-11 w-11 flex-shrink-0 rounded-full bg-white border border-[#EFE8E1] flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[#C9A227]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-[#111111]">{title}</p>
                    {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
                    {lines && (
                      <div className="text-sm text-[#111111] mt-2 leading-relaxed break-words">
                        {lines.map((line, i) => (
                          <p key={i} className="whitespace-normal">{line}</p>
                        ))}
                      </div>
                    )}
                    {phones && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-[#111111] mt-2">
                        {phones.map((number, i) => (
                          <span key={number} className="flex items-center gap-2">
                            <a
                              href={`tel:+91${number}`}
                              className="whitespace-nowrap hover:text-[#C9A227] transition-colors"
                            >
                              {number}
                            </a>
                            {i < phones.length - 1 && (
                              <span className="hidden sm:inline text-gray-300" aria-hidden="true">|</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                    {value && <p className="text-sm text-[#111111] mt-2 break-words">{value}</p>}
                  </div>
                </Comp>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}