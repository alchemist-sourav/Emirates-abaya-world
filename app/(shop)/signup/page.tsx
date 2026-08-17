'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'

function getStrength(pw: string): { score: number; label: string } {
  if (pw.length === 0) return { score: 0, label: '' }
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  s = Math.min(4, s)
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return { score: s, label: labels[s] }
}

const STRENGTH_COLORS: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-400',
  3: 'bg-[#C9A227]',
  4: 'bg-green-600',
}

export default function SignupPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(true)
  const [error, setError] = useState('')

  const strength = getStrength(password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (firstName.trim().length < 2) {
      setError('Please enter your first name.')
      return
    }
    if (lastName.trim().length < 2) {
      setError('Please enter your last name.')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (strength.score < 2) {
      setError('Please choose a stronger password.')
      return
    }
    if (!agreed) {
      setError('Please accept the Terms of Service to continue.')
      return
    }
    setError('')
    router.push('/account')
  }

  const inputClass =
    'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-[#111111] placeholder-gray-400 focus:outline-none focus:border-[#C9A227] transition-colors bg-white'

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="bg-white border border-[#EFE8E1] rounded-2xl p-8 lg:p-10">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A227] text-center mb-3">
            Join the Maison
          </p>
          <h1 className="font-heading italic text-2xl lg:text-3xl font-semibold text-[#111111] text-center mb-2">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[#C9A227] font-medium hover:underline">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#111111] mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Fatima"
                    autoComplete="given-name"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#111111] mb-1.5">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Almansouri"
                  autoComplete="family-name"
                  required
                  className={`${inputClass} pl-4`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111111] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#111111] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111111]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? STRENGTH_COLORS[strength.score] : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Password strength: <span className="font-medium text-[#111111]">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#C9A227]"
              />
              <span className="text-xs text-gray-500">
                I agree to the{' '}
                <Link href="/terms" className="underline hover:text-[#C9A227]">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-[#C9A227]">Privacy Policy</Link>.
              </span>
            </label>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#111111] text-white text-sm font-semibold py-3.5 rounded-full hover:bg-[#C9A227] hover:text-[#111111] transition-colors uppercase tracking-wider"
            >
              Create Account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or sign up with</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1877F2] text-white rounded-full text-sm font-medium hover:bg-[#155fd0] transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-full text-sm font-medium text-[#111111] hover:border-[#111111] transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-full text-sm font-medium text-[#111111] hover:border-[#111111] transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.52-3.2 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-6">
            <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
            100% free · No subscription required
          </p>
        </div>
      </div>
    </div>
  )
}