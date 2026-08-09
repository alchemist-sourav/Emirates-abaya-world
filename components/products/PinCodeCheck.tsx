'use client'

import React, { useState } from 'react'
import { MapPin, CheckCircle2, XCircle, Package, Zap } from 'lucide-react'
import { checkPinCode } from '@/lib/services/products'
import { cn } from '@/lib/utils'

interface PinResult {
  available: boolean
  estimatedDays: string
  codAvailable: boolean
  message: string
}

export function PinCodeCheck() {
  const [pin, setPin] = useState('')
  const [result, setResult] = useState<PinResult | null>(null)
  const [checking, setChecking] = useState(false)

  const handleCheck = async () => {
    setChecking(true)
    const res = await checkPinCode(pin)
    setResult(res)
    setChecking(false)
  }

  return (
    <div className="border border-gray-200 bg-[#F8F6F2] p-3">
      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-[#C9A227]" aria-hidden="true" />
        Check Delivery to Your PIN Code
      </p>
      <div className="flex gap-2">
        <input
          type="tel"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ''))
            if (result) setResult(null)
          }}
          placeholder="Enter 6-digit PIN code"
          aria-label="PIN code"
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#111111]"
        />
        <button
          onClick={handleCheck}
          disabled={pin.length !== 6 || checking}
          className="px-4 py-2 bg-[#111111] text-white text-sm font-semibold hover:bg-[#222222] transition-colors disabled:opacity-40 whitespace-nowrap"
        >
          {checking ? 'Checking…' : 'Check'}
        </button>
      </div>

      {result && (
        <div className={cn('mt-3 text-sm', result.available ? 'text-green-700' : 'text-red-600')}>
          <p className="flex items-center gap-1.5 font-medium">
            {result.available ? (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <XCircle className="h-4 w-4" aria-hidden="true" />
            )}
            {result.message}
          </p>
          {result.available && (
            <div className="mt-2 space-y-1.5">
              <p className="flex items-center gap-1.5 text-gray-600 text-[13px]">
                <Package className="h-3.5 w-3.5 text-[#C9A227]" aria-hidden="true" />
                Estimated delivery: <span className="font-semibold">{result.estimatedDays}</span>
              </p>
              <p className="flex items-center gap-1.5 text-gray-600 text-[13px]">
                <Zap className="h-3.5 w-3.5 text-[#C9A227]" aria-hidden="true" />
                COD: <span className="font-semibold">{result.codAvailable ? 'Available' : 'Not available'}</span>
              </p>
            </div>
          )}
          <p className="mt-2 text-[11px] text-gray-400">
            Delivery timelines are estimates and subject to courier availability.
          </p>
        </div>
      )}
    </div>
  )
}
