'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { MapPin, Plus, Trash2, Check } from 'lucide-react'
import { INDIAN_STATES } from '@/lib/data/india'

type Address = {
  id: number
  fullName: string
  mobile: string
  house: string
  area: string
  city: string
  state: string
  pinCode: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [form, setForm] = useState({ fullName: '', mobile: '', house: '', area: '', city: '', state: '', pinCode: '' })
  const [showForm, setShowForm] = useState(false)
  const addressSeq = useRef(0)

  const addAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (addresses.length === 0 && Object.values(form).some((v) => v.trim() === '')) return
    addressSeq.current += 1
    setAddresses((prev) => [
      ...prev,
      { id: addressSeq.current, ...form, isDefault: prev.length === 0 },
    ])
    setForm({ fullName: '', mobile: '', house: '', area: '', city: '', state: '', pinCode: '' })
    setShowForm(false)
  }

  const removeAddress = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const setDefault = (id: number) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <h1 className="font-heading text-2xl font-bold text-[#111111] mb-2">Saved Addresses</h1>
        <p className="text-gray-600 text-sm mb-8">Manage the addresses used for delivery at checkout.</p>

        {addresses.length === 0 && !showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
            <MapPin className="h-8 w-8 text-[#C9A227] mx-auto mb-3" aria-hidden="true" />
            <p className="text-gray-600 text-sm mb-4">You have no saved addresses yet.</p>
            <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add New Address
            </button>
          </div>
        )}

        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-[#111111]">{addr.fullName}</p>
                  <span className="text-sm text-gray-500">· {addr.mobile}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#C9A227]/15 text-[#8a6d12] px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {addr.house}, {addr.area}, {addr.city}, {addr.state} — {addr.pinCode}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!addr.isDefault && (
                  <button type="button" onClick={() => setDefault(addr.id)} className="text-xs text-[#111111] hover:text-[#C9A227] flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" /> Set Default
                  </button>
                )}
                <button type="button" onClick={() => removeAddress(addr.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {addresses.length > 0 && !showForm && (
          <button type="button" onClick={() => setShowForm(true)} className="btn-secondary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add New Address
          </button>
        )}

        {showForm && (
          <form onSubmit={addAddress} className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-[#111111] mb-4">Add Address</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">Full Name</label>
                <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">Mobile</label>
                <input required type="tel" maxLength={10} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#111111] mb-1.5">House No, Building, Street</label>
              <input required value={form.house} onChange={(e) => setForm({ ...form, house: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#111111] mb-1.5">Area / Locality</label>
              <input required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">City</label>
                <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">State</label>
                <select required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227] bg-white">
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">PIN Code</label>
                <input required type="tel" maxLength={6} value={form.pinCode} onChange={(e) => setForm({ ...form, pinCode: e.target.value.replace(/\D/g, '') })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary">Save Address</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        )}

        <p className="text-sm text-center mt-8">
          <Link href="/account" className="text-[#111111] underline hover:text-[#C9A227] transition-colors">Back to My Account</Link>
        </p>
      </div>
    </div>
  )
}
