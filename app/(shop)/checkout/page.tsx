'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShieldCheck, CreditCard, Smartphone, Building, Wallet, Package, ArrowLeft, Lock } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { createOrder, getSiteConfig } from '@/lib/services/products'
import { formatPrice } from '@/lib/utils'

interface FormData {
  firstName: string
  lastName: string
  mobile: string
  email: string
  house: string
  area: string
  landmark: string
  city: string
  state: string
  country: string
  pinCode: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

function InputField({
  label, id, type = 'text', placeholder, value, onChange, error, required, maxLength
}: {
  label: string; id: keyof FormData; type?: string; placeholder?: string;
  value: string; onChange: (id: keyof FormData, v: string) => void;
  error?: string; required?: boolean; maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={e => onChange(id, e.target.value)}
        placeholder={placeholder}
        className={`form-input ${error ? 'border-red-400 focus:border-red-500' : ''}`}
        autoComplete="off"
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCartStore()
  const config = getSiteConfig()
  const subtotal = getSubtotal()

  const isIndia = config.currency === 'INR'

  const DELIVERY_METHODS = isIndia
    ? [
        { id: 'standard', name: 'Standard Delivery', description: '3–5 business days', price: 50 },
        { id: 'express', name: 'Express Delivery', description: '1–2 business days', price: 120 },
        { id: 'free', name: 'Free Delivery', description: '5–7 business days', price: 0, minOrder: 1999 },
      ]
    : [
        { id: 'standard', name: 'Standard Delivery', description: '2–3 business days', price: config.baseShippingFee },
        { id: 'express', name: 'Express Delivery', description: '1–2 business days', price: 60 },
        { id: 'free', name: 'Free Delivery', description: '2–4 business days', price: 0, minOrder: config.freeShippingAbove },
      ]

  const PAYMENT_OPTIONS = isIndia
    ? [
        { id: 'upi',        label: 'UPI',            icon: Smartphone },
        { id: 'card',       label: 'Credit / Debit Card', icon: CreditCard },
        { id: 'netbanking', label: 'Net Banking',    icon: Building },
        { id: 'wallet',     label: 'Wallet',         icon: Wallet },
        ...(config.claims.codAvailable ? [{ id: 'cod', label: 'Cash on Delivery', icon: Package }] : []),
      ]
    : [
        { id: 'card',       label: 'Credit / Debit Card', icon: CreditCard },
        { id: 'applepay',   label: 'Apple Pay',      icon: Smartphone },
        { id: 'banktransfer', label: 'Bank Transfer', icon: Building },
        ...(config.claims.codAvailable ? [{ id: 'cod', label: 'Cash on Delivery', icon: Package }] : []),
      ]

  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', mobile: '', email: '', house: '', area: '', landmark: '', city: '', state: '', country: '', pinCode: '',
  })
  const [errors, setErrors]         = useState<FormErrors>({})
  const [delivery, setDelivery]     = useState(isIndia ? 'standard' : subtotal >= config.freeShippingAbove ? 'free' : 'standard')
  const [payment, setPayment]       = useState(isIndia ? 'upi' : 'card')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coupon, setCoupon]         = useState('')
  const [applied, setApplied]       = useState(false)

  const selectedDelivery = DELIVERY_METHODS.find(d => d.id === delivery)
  const shipping = selectedDelivery?.price ?? (isIndia ? 50 : config.baseShippingFee)
  const codFee = payment === 'cod' ? config.codFee : 0
  const discount = applied ? 25 : 0
  const total = subtotal + shipping + codFee - discount

  const handleChange = (id: keyof FormData, value: string) => {
    const numeric = id === 'mobile' || (id === 'pinCode' && isIndia)
    const sanitized = numeric ? value.replace(/\D/g, '') : value
    setFormData(prev => ({ ...prev, [id]: sanitized }))
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: undefined }))
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    const required: Array<keyof FormData> = ['firstName', 'lastName', 'mobile', 'house', 'area', 'city', 'state', 'country', 'pinCode']
    required.forEach(f => { if (!formData[f].trim()) errs[f] = 'This field is required' })
    if (formData.mobile && !new RegExp(config.phonePattern).test(formData.mobile.trim())) {
      errs.mobile = isIndia ? 'Enter a valid 10-digit Indian mobile number' : 'Enter a valid phone number'
    }
    if (isIndia && formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) errs.pinCode = 'Enter a valid 6-digit PIN code'
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    setApplied(code === 'EMIRATES5')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (items.length === 0) return

    setIsSubmitting(true)
    try {
      const { orderNumber } = await createOrder({ formData, items, total, payment, delivery })
      clearCart()
      router.push(`/order-success?order=${orderNumber}`)
    } catch {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
        <div className="text-center py-20">
          <p className="font-heading text-2xl text-[#111111] mb-4">Your cart is empty</p>
          <Link href="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      {/* Header bar */}
      <div className="bg-white border-b border-[#E5E5E5] py-4">
        <div className="container-xl flex items-center justify-between gap-3">
          <Link href="/" className="font-heading text-base sm:text-lg font-bold text-[#111111] min-w-0 leading-snug break-words">
            {config.businessName}
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#6B7280] flex-shrink-0">
            <ShieldCheck className="h-4 w-4 text-[#C9A227]" aria-hidden="true" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="container-xl py-8 lg:py-10">
        <div className="mb-5">
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Cart
          </Link>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* ── Left: Form ── */}
            <div className="space-y-6">

              {/* Contact */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="text-base font-semibold text-[#111111] mb-5">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-[#111111] text-white text-xs font-bold mr-2">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Mobile Number" id="mobile" type="tel" placeholder={isIndia ? '10-digit mobile number' : 'e.g. 050 123 4567'} maxLength={isIndia ? 10 : 20} value={formData.mobile} onChange={handleChange} error={errors.mobile} required />
                  <InputField label="Email" id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} error={errors.email} />
                </div>
              </div>

              {/* Shipping address */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="text-base font-semibold text-[#111111] mb-5">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-[#111111] text-white text-xs font-bold mr-2">2</span>
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="First Name" id="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
                    <InputField label="Last Name" id="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="House / Flat No." id="house" placeholder="e.g. Flat 4B, Rose Villa" value={formData.house} onChange={handleChange} error={errors.house} required />
                    <InputField label="Area / Street / Locality" id="area" placeholder="e.g. Linking Road, Bandra West" value={formData.area} onChange={handleChange} error={errors.area} required />
                  </div>
                  <InputField label="Landmark (optional)" id="landmark" placeholder="e.g. Near City Mall" value={formData.landmark} onChange={handleChange} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="City" id="city" value={formData.city} onChange={handleChange} error={errors.city} required />
                    <div>
                      <label htmlFor="state" className="form-label">
                        {isIndia ? 'State' : 'Emirate'}<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <select
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className={`form-select ${errors.state ? 'border-red-400' : ''}`}
                      >
                        <option value="">{isIndia ? 'Select state' : 'Select emirate'}</option>
                        {config.states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && <p className="form-error">{errors.state}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="country" className="form-label">
                        Country<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className={`form-select ${errors.country ? 'border-red-400' : ''}`}
                      >
                        <option value="">Select country</option>
                        {['United Arab Emirates', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Oman', 'Qatar', 'United Kingdom', 'United States', 'India', 'Other'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {errors.country && <p className="form-error">{errors.country}</p>}
                    </div>
                    <InputField label="Postal Code" id="pinCode" type={isIndia ? 'tel' : 'text'} placeholder={isIndia ? '6-digit PIN' : 'e.g. 00000'} maxLength={isIndia ? 6 : 10} value={formData.pinCode} onChange={handleChange} error={errors.pinCode} required />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="text-base font-semibold text-[#111111] mb-5">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-[#111111] text-white text-xs font-bold mr-2">3</span>
                  Delivery Method
                </h2>
                <div className="space-y-3">
                  {DELIVERY_METHODS.map(method => {
                    const disabled = method.id === 'free' && subtotal < (method.minOrder ?? 0)
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                          delivery === method.id
                            ? 'border-[#111111] bg-[#F8F6F2]'
                            : disabled
                              ? 'border-[#E5E5E5] opacity-40 cursor-not-allowed'
                              : 'border-[#E5E5E5] hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="delivery"
                            value={method.id}
                            checked={delivery === method.id}
                            onChange={() => !disabled && setDelivery(method.id)}
                            disabled={disabled}
                            className="accent-[#111111]"
                          />
                          <div>
                            <p className="text-sm font-semibold text-[#111111]">{method.name}</p>
                            <p className="text-xs text-[#6B7280]">{method.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#111111]">
                          {method.price === 0 ? 'FREE' : formatPrice(method.price)}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="text-base font-semibold text-[#111111] mb-5">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-[#111111] text-white text-xs font-bold mr-2">4</span>
                  Payment Method
                  <span className="ml-2 text-[10px] font-medium text-[#6B7280] bg-[#F8F6F2] px-2 py-0.5 align-middle">
                    <Lock className="h-3 w-3 inline mr-0.5" aria-hidden="true" />
                    {isIndia ? 'Powered by Razorpay' : '256-bit SSL Secure'}
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {PAYMENT_OPTIONS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPayment(id)}
                      className={`flex flex-col items-center gap-2 p-4 border text-sm font-medium transition-all ${
                        payment === id
                          ? 'border-[#111111] bg-[#F8F6F2] text-[#111111]'
                          : 'border-[#E5E5E5] text-[#6B7280] hover:border-gray-400'
                      }`}
                      aria-pressed={payment === id}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Payment method details */}
                {payment === 'card' && (
                  <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
                    <p className="text-xs text-[#6B7280]">
                      Card details are collected securely at the payment step. {isIndia && 'This is handled by Razorpay.'}
                    </p>
                  </div>
                )}
                {payment === 'upi' && (
                  <div className="pt-4 border-t border-[#E5E5E5]">
                    <p className="text-xs text-[#6B7280] mb-3">
                      You will be redirected to your UPI app (GPay, PhonePe, Paytm) to approve the payment.
                    </p>
                  </div>
                )}
                {payment === 'netbanking' && (
                  <div className="pt-4 border-t border-[#E5E5E5]">
                    <p className="text-xs text-[#6B7280]">
                      Choose your bank at the Razorpay payment page after placing the order.
                    </p>
                  </div>
                )}
                {payment === 'wallet' && (
                  <div className="pt-4 border-t border-[#E5E5E5]">
                    <p className="text-xs text-[#6B7280]">
                      Pay using Amazon Pay, Paytm, Mobikwik, or Freecharge balance at the Razorpay payment page.
                    </p>
                  </div>
                )}
                {payment === 'applepay' && (
                  <div className="pt-4 border-t border-[#E5E5E5]">
                    <p className="text-xs text-[#6B7280]">
                      Pay securely with Apple Pay and confirm with Face ID or Touch ID at checkout.
                    </p>
                  </div>
                )}
                {payment === 'banktransfer' && (
                  <div className="pt-4 border-t border-[#E5E5E5]">
                    <p className="text-xs text-[#6B7280]">
                      We will email you the bank transfer details after you place your order.
                    </p>
                  </div>
                )}
                {payment === 'cod' && (
                  <div className="pt-4 border-t border-[#E5E5E5]">
                    <p className="text-sm text-[#6B7280] bg-amber-50 border border-amber-200 p-3">
                      Cash on delivery available. A convenience fee of <span className="font-semibold text-[#111111]">{formatPrice(config.codFee)}</span> applies.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:sticky lg:top-[150px] h-fit">
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="text-base font-semibold text-[#111111] mb-5">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-5 max-h-64 overflow-y-auto no-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-16 bg-gray-50 flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#111111] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#111111] line-clamp-2 leading-snug">
                          {item.name}
                        </p>
                        {item.color  && <p className="text-[10px] text-[#6B7280] mt-0.5">Colour: {item.color}</p>}
                        {item.size   && <p className="text-[10px] text-[#6B7280] mt-0.5">Size: {item.size}</p>}
                        {item.length && <p className="text-[10px] text-[#6B7280]">Length: {item.length}</p>}
                        {item.hijab && <p className="text-[10px] text-[#6B7280]">Hijab: {item.hijab}</p>}
                      </div>
                      <p className="text-xs font-semibold text-[#111111] flex-shrink-0">
                        {formatPrice((item.price + (item.hijabPrice ?? 0)) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-[#E5E5E5] pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="font-medium text-[#111111]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-[#111111]'}`}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Discount (EMIRATES5)</span>
                      <span className="font-medium text-green-600">− {formatPrice(discount)}</span>
                    </div>
                  )}
                  {codFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">COD fee</span>
                      <span className="font-medium text-[#111111]">{formatPrice(codFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-[#E5E5E5]">
                    <span className="font-semibold text-[#111111]">Total <span className="font-normal text-gray-400 text-[11px]">(VAT incl.)</span></span>
                    <span className="text-xl font-bold text-[#111111]">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Discount code */}
                <div className="mt-4">
                  <label htmlFor="checkout-coupon" className="sr-only">Discount code</label>
                  <div className="flex gap-2">
                    <input
                      id="checkout-coupon"
                      type="text"
                      value={coupon}
                      onChange={(e) => { setCoupon(e.target.value); setApplied(false) }}
                      placeholder={applied ? 'EMIRATES5 applied' : 'Discount code'}
                      disabled={applied}
                      className="flex-1 px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#111111] bg-white disabled:bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="px-4 py-2.5 bg-[#111111] text-white text-sm font-medium hover:bg-[#C9A227] hover:text-[#111111] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {applied && <p className="text-[11px] text-green-600 mt-1.5">Code applied — AED 25.00 off.</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full mt-6 py-4 text-base justify-center"
                >
                  {isSubmitting ? 'Placing Order…' : `Place Order • ${formatPrice(total)}`}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <ShieldCheck className="h-4 w-4 text-[#6B7280]" aria-hidden="true" />
                  <p className="text-[11px] text-[#6B7280]">256-bit SSL secure · PCI-DSS compliant checkout</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
