import type { SiteConfig } from '@/types/product'
import { INDIAN_STATES } from '@/lib/data/india'

export type RegionKey = 'uae' | 'india'

/**
 * Regional presets that re-skin the storefront (currency, shipping,
 * contacts, addresses, legal text). Switch `ACTIVE_REGION` to toggle
 * between the India (official storefront, Kerala) and UAE storefronts.
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
    whatsappNumber: '+91 97477 93814',
    businessName: 'EMIRATES ABAYA WORLD & BOUTIQUE',
    phone2: '+91 81299 14915',
    gst: '32BMXPH3195M1ZD',
    email: 'support@emiratesmodest.com',
    phone: '+91 81299 14915',
    address: '10/488/CDEF, GOV: Hospital Karunagappally, Kollam, Kerala - 690518',
    showroom: 'Emirates Abaya World & Boutique · Karunagappally, Kollam, Kerala',
    supportEmail: 'support@emiratesmodest.com',
    instagram: '@emiratesmodest',
    tagline: 'Bringing bespoke modesty and modern premium abayas to women across the globe. Handcrafted with fine fabrics in the UAE.',
    regionLabel: 'Premium Modest Fashion · Dubai',
    pinLabel: 'Emirate / City',
    phonePattern: '^[0-9+\\-\\s]{7,}$',
    states: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
    listPriceLabel: '',
    copyright: '© 2026 EMIRATES ABAYA WORLD & BOUTIQUE. All rights reserved.',
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
    whatsappNumber: '+91 97477 93814',
    businessName: 'EMIRATES ABAYA WORLD & BOUTIQUE',
    phone2: '+91 81299 14915',
    gst: '32BMXPH3195M1ZD',
    email: 'hello@emiratesabayaworld.in',
    phone: '+91 81299 14915',
    address: '10/488/CDEF, GOV: Hospital Karunagappally, Kollam, Kerala - 690518',
    showroom: 'Emirates Abaya World & Boutique · Karunagappally, Kollam, Kerala',
    supportEmail: 'care@emiratesabayaworld.com',
    instagram: '@emiratesabayaworld',
    tagline: 'Premium abayas and hijabs crafted for modern women, delivered across India.',
    regionLabel: 'Premium Modest Fashion · India',
    pinLabel: 'PIN Code',
    phonePattern: '^[6-9]\\d{9}$',
    states: INDIAN_STATES,
    listPriceLabel: 'MRP ',
    copyright: '© 2026 EMIRATES ABAYA WORLD & BOUTIQUE. All rights reserved.',
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

/** Active storefront region. The India (Kerala) storefront is the official business. */
export const ACTIVE_REGION: RegionKey = 'india'
