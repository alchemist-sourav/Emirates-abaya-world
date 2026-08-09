'use client'

import { Toaster } from 'react-hot-toast'

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#111111',
          color: '#FFFFFF',
          borderRadius: '4px',
          fontSize: '14px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#C9A227', secondary: '#FFFFFF' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
        },
      }}
    />
  )
}
