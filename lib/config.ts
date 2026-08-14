import type { SiteConfig } from '@/types/product'
import { INDIAN_STATES } from '@/lib/data/india'

export type RegionKey = 'uae' | 'india'

/**
 * Regional presets that re-skin the storefront (currency, shipping,
 * contacts, addresses, legal text). Switch `ACTIVE_REGION` to toggle
 * between the UAE (default) and India (legacy) storefronts.
 */
export const REGIONS: Record<RegionKey, SiteConfig> = {
  uae: {
    announcement: 'FIRST PURCHASE 5% OFF | FREE SHIPPING ABOVE AED 500',
    productNote: '*Made-to-order lengths available on request — please contact client care for bespoke sizing.',
    freeShippingAbove: 500,
    codFee: 0,
    taxRate: 0.05,
    baseShippingFee: 25,
    currency: 'AED',
    currencySymbol: 'AED ',
    locale: 'en-AE',
    priceDecimals: 2,
    whatsappNumber: '+971 50 123 4567',
    email: 'support@emiratesmodest.com',
    phone: '+971 4 123 4567',
    address: 'EMIRATES Atelier, Alserkal Avenue, Al Quoz 1, Dubai, UAE',
    showroom: 'Flagship Showroom · Alserkal Avenue, Al Quoz 1, Dubai',
    supportEmail: 'support@emiratesmodest.com',
    instagram: '@emiratesmodest',
    tagline: 'Bringing bespoke modesty and modern premium abayas to women across the globe. Handcrafted with fine fabrics in the UAE.',
    regionLabel: 'Premium Modest Fashion · Dubai',
    pinLabel: 'Emirate / City',
    phonePattern: '^[0-9+\\-\\s]{7,}$',
    states: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
    listPriceLabel: '',
    copyright: '© 2026 EMIRATES. All rights reserved. Handcrafted in Dubai, UAE.',
    claims: {
      securePayments: true,
      codAvailable: false,
      easyReturns: true,
      qualityChecked: true,
      fastDelivery: true,
      freeShipping: true,
    },
    delivery: {
      minPinPrefix: 1,
      maxPinPrefix: 5,
    },
    shippingZones: [
      { name: 'UAE', transit: '2–3 business days', fee: 25, freeAbove: 500 },
      { name: 'GCC (KSA, Kuwait, Bahrain, Oman, Qatar)', transit: '5–7 business days', fee: 50, freeAbove: 800 },
      { name: 'International', transit: '10–14 business days', fee: 100 },
    ],
  },
  india: {
    announcement: 'First Purchase Offer | Free Shipping Above ₹1999',
    productNote: '*Lengths 50–54 available on Prepaid / Online payment orders only.',
    freeShippingAbove: 1999,
    codFee: 49,
    taxRate: 0.05,
    baseShippingFee: 50,
    currency: 'INR',
    currencySymbol: '₹',
    locale: 'en-IN',
    priceDecimals: 0,
    whatsappNumber: '+91-9876543210',
    email: 'hello@emiratesabayaworld.in',
    phone: '+91 98765 43210',
    address: 'Shop 12, Fashion Street, Bandra West, Mumbai – 400050',
    showroom: '2nd Floor, Fashion Plaza, Linking Road, Mumbai 400052',
    supportEmail: 'care@emiratesabayaworld.com',
    instagram: '@emiratesabayaworld',
    tagline: 'Premium abayas and hijabs crafted for modern women, delivered across India.',
    regionLabel: 'Premium Modest Fashion · India',
    pinLabel: 'PIN Code',
    phonePattern: '^[6-9]\\d{9}$',
    states: INDIAN_STATES,
    listPriceLabel: 'MRP ',
    copyright: '© 2026 Emirates Abaya World. All rights reserved. Handcrafted with care.',
    claims: {
      securePayments: true,
      codAvailable: true,
      easyReturns: true,
      qualityChecked: true,
      fastDelivery: true,
      freeShipping: true,
    },
    delivery: {
      minPinPrefix: 1,
      maxPinPrefix: 9,
    },
    shippingZones: [
      { name: 'Metro Cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata)', transit: '3–5 business days', fee: 0, freeAbove: 0 },
      { name: 'Tier 2 Cities', transit: '4–6 business days', fee: 50, freeAbove: 1999 },
      { name: 'Rest of India', transit: '5–7 business days', fee: 50, freeAbove: 1999 },
    ],
  },
}

/** Active storefront region. Toggle to 'india' to restore the legacy storefront. */
export const ACTIVE_REGION: RegionKey = 'uae'
