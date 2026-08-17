'use client'

import React, { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

/**
 * Cream "Stay Updated" newsletter section (shown above the dark footer).
 */
export function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false)

  return (
    <section className="bg-[#FAF7F2] border-t border-[#F0EEEC]" aria-labelledby="newsletter-heading">
      <div className="site-container py-14 lg:py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2
            id="newsletter-heading"
            className="font-heading text-2xl lg:text-3xl font-bold text-[#111111] mb-2"
          >
            Stay Updated
          </h2>
          <p className="text-sm text-[#6B7280] mb-7 leading-relaxed">
            Subscribe for exclusive access to new collections, private styling previews and
            members-only offers.
          </p>
          {subscribed ? (
            <p className="flex items-center justify-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-100 rounded-full px-6 py-3 max-w-md mx-auto">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Thank you for subscribing — see you in your inbox.
            </p>
          ) : (
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault()
                setSubscribed(true)
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-3 bg-white border border-[#E5E5E5] text-sm text-[#111111] placeholder-gray-400 rounded-full focus:outline-none focus:border-[#C9A227] transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4956A] text-white text-sm font-semibold rounded-full hover:bg-[#C98557] transition-colors whitespace-nowrap"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Subscribe
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-gray-400">
            By subscribing you agree to our Privacy Policy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}