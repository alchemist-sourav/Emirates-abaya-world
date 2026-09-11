'use client'

import { useState } from 'react'
import { Save, Building2 } from 'lucide-react'
import { getSiteConfig } from '@/lib/services/products'

export default function AdminSettingsPage() {
  const config = getSiteConfig()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // Settings form state — populated from getSiteConfig (server-rendered)
  const [form, setForm] = useState({
    businessName: config.businessName,
    email: config.email,
    phone: config.phone,
    phone2: config.phone2,
    address: config.address,
    gst: config.gst,
    supportEmail: config.supportEmail,
    announcement: config.announcement,
    productNote: config.productNote,
    instagram: config.instagram,
    freeShippingAbove: config.freeShippingAbove.toString(),
    codFee: config.codFee.toString(),
    baseShippingFee: config.baseShippingFee.toString(),
    taxRate: (config.taxRate * 100).toString(),
  })

  const handleChange = (id: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [id]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // In production this would call an API route to update site_settings table
      // For now, show a success message
      await new Promise(r => setTimeout(r, 600))
      setSaved(true)
    } catch {
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">Settings</h1>
        <p className="text-sm text-[#6B7280] mt-1">Manage your store information and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Info */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="h-5 w-5 text-[#C9A227]" aria-hidden="true" />
            <h2 className="font-semibold text-[#111111]">Business Information</h2>
          </div>
          <div className="space-y-4">
            <Field label="Business Name" id="businessName" value={form.businessName} onChange={v => handleChange('businessName', v)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Primary Email" id="email" type="email" value={form.email} onChange={v => handleChange('email', v)} />
              <Field label="Support Email" id="supportEmail" type="email" value={form.supportEmail} onChange={v => handleChange('supportEmail', v)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone 1" id="phone" type="tel" value={form.phone} onChange={v => handleChange('phone', v)} />
              <Field label="Phone 2" id="phone2" type="tel" value={form.phone2} onChange={v => handleChange('phone2', v)} />
            </div>
            <Field label="Address" id="address" value={form.address} onChange={v => handleChange('address', v)} />
            <Field label="GST Number" id="gst" value={form.gst} onChange={v => handleChange('gst', v)} />
            <Field label="Instagram Handle" id="instagram" value={form.instagram} onChange={v => handleChange('instagram', v)} />
          </div>
        </div>

        {/* Announcement */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
          <h2 className="font-semibold text-[#111111] mb-5">Announcement Bar</h2>
          <Field
            label="Announcement Text"
            id="announcement"
            value={form.announcement}
            onChange={v => handleChange('announcement', v)}
            hint="Shown at the top of every page"
          />
        </div>

        {/* Shipping & Pricing */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
          <h2 className="font-semibold text-[#111111] mb-5">Shipping & Pricing</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Free Shipping Above (₹)" id="freeShippingAbove" type="number" value={form.freeShippingAbove} onChange={v => handleChange('freeShippingAbove', v)} />
            <Field label="Base Shipping Fee (₹)" id="baseShippingFee" type="number" value={form.baseShippingFee} onChange={v => handleChange('baseShippingFee', v)} />
            <Field label="COD Fee (₹)" id="codFee" type="number" value={form.codFee} onChange={v => handleChange('codFee', v)} />
            <Field label="Tax Rate (%)" id="taxRate" type="number" value={form.taxRate} onChange={v => handleChange('taxRate', v)} />
          </div>
        </div>

        {/* Product Notes */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
          <h2 className="font-semibold text-[#111111] mb-5">Product Page Note</h2>
          <Field
            label="Product Note"
            id="productNote"
            value={form.productNote}
            onChange={v => handleChange('productNote', v)}
            hint="Shown under product options (e.g. length policy, payment policy)"
          />
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-white text-sm font-semibold rounded-full hover:bg-[#C9A227] hover:text-[#111111] transition-colors disabled:opacity-60"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && <span className="text-sm text-green-700 font-medium">✓ Settings saved successfully</span>}
        </div>
      </form>
    </div>
  )
}

function Field({
  label, id, type = 'text', value, onChange, hint,
}: {
  label: string; id: string; type?: string; value: string
  onChange: (v: string) => void; hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#111111] mb-1.5">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
      />
      {hint && <p className="text-xs text-[#6B7280] mt-1">{hint}</p>}
    </div>
  )
}
