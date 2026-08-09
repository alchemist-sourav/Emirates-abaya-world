'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface NewsletterFormProps {
  inputId?: string
}

export function NewsletterForm({ inputId = 'newsletter-email' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    // Simulate API call — replace with real integration later
    await new Promise(resolve => setTimeout(resolve, 800))
    toast.success('Thank you for subscribing!')
    setEmail('')
    setIsSubmitting(false)
  }

  return (
    <form
      className="flex flex-col sm:flex-row gap-2"
      onSubmit={handleSubmit}
      noValidate
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        disabled={isSubmitting}
        className="form-input flex-1"
        autoComplete="email"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary whitespace-nowrap disabled:opacity-60"
      >
        {isSubmitting ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  )
}
