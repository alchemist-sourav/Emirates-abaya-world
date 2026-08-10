'use client'

import React from 'react'
import { X } from 'lucide-react'

export function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Size guide"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md bg-white border border-[#E5E5E5] shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
          <h3 className="font-heading text-lg font-bold text-[#111111]">Size Guide</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 transition-colors"
            aria-label="Close size guide"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="text-left py-2 font-semibold text-[#111111]">Size</th>
                <th className="text-left py-2 font-semibold text-[#111111]">Bust</th>
                <th className="text-left py-2 font-semibold text-[#111111]">Waist</th>
              </tr>
            </thead>
            <tbody>
              {[
                { s: 'XS', bust: '34–36', waist: '26–28' },
                { s: 'S', bust: '36–38', waist: '28–30' },
                { s: 'M', bust: '38–40', waist: '30–32' },
                { s: 'L', bust: '40–42', waist: '32–34' },
                { s: 'XL', bust: '42–44', waist: '34–36' },
                { s: '2XL', bust: '44–46', waist: '36–38' },
                { s: '3XL', bust: '46–48', waist: '38–40' },
              ].map((row) => (
                <tr key={row.s} className="border-b border-gray-100">
                  <td className="py-2 font-medium text-[#111111]">{row.s}</td>
                  <td className="py-2 text-gray-600">{row.bust}&quot;</td>
                  <td className="py-2 text-gray-600">{row.waist}&quot;</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-[#6B7280] leading-relaxed">
            Lengths run 50&quot;–60&quot;. If you are between sizes, we recommend sizing up for a relaxed, graceful drape.
          </p>
        </div>
      </div>
    </div>
  )
}
