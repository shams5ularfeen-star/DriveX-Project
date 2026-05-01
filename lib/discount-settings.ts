"use client"

import { useSyncExternalStore } from "react"

export type DiscountTier<K extends string> = Record<K, number> & { pct: number }
export type LoyaltyTier = { minBookings: number; pct: number }
export type BulkTier = { minQty: number; pct: number }
export type CampaignTrigger = "weekend" | "night" | "eid" | "always"

export interface Campaign {
  id: string
  label: string
  pct: number
  trigger: CampaignTrigger
  enabled: boolean
}

export interface DiscountSettings {
  loyaltyEnabled: boolean
  loyaltyTiers: LoyaltyTier[]
  bulkEnabled: boolean
  bulkTiers: BulkTier[]
  categoryEnabled: boolean
  /** Max % a category is allowed to *receive* across stacking (cap per car class) */
  categoryCaps: Record<string, number>
  seasonalEnabled: boolean
  campaigns: Campaign[]
  /** Max number of automatic layers that can stack together */
  maxAutoLayers: number
  /** Hard cap on total discount % (auto + promo combined) */
  maxTotalPct: number
}

const KEY = "drivex.discount-settings.v1"

export const DEFAULT_DISCOUNT_SETTINGS: DiscountSettings = {
  loyaltyEnabled: true,
  loyaltyTiers: [
    { minBookings: 5, pct: 5 },
    { minBookings: 10, pct: 10 },
    { minBookings: 15, pct: 15 },
    { minBookings: 20, pct: 20 },
  ],
  bulkEnabled: true,
  bulkTiers: [
    { minQty: 5, pct: 5 },
    { minQty: 10, pct: 10 },
    { minQty: 15, pct: 15 },
    { minQty: 20, pct: 20 },
  ],
  categoryEnabled: true,
  categoryCaps: {
    Economy: 30,
    Sedan: 25,
    SUV: 25,
    Luxury: 15,
    Exotic: 10,
    Vans: 25,
    Family: 25,
    Wedding: 20,
  },
  seasonalEnabled: true,
  campaigns: [
    { id: "weekend", label: "Weekend Special", pct: 10, trigger: "weekend", enabled: true },
    { id: "night", label: "Night Booking", pct: 5, trigger: "night", enabled: false },
    { id: "eid", label: "Eid Festival", pct: 15, trigger: "eid", enabled: false },
  ],
  maxAutoLayers: 2,
  maxTotalPct: 40,
}

const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
const notify = () => listeners.forEach((l) => l())

/**
 * Snapshot cache for `useSyncExternalStore`. Without this, `getSnapshot`
 * would return a fresh `JSON.parse`d object on every render, triggering an
 * infinite re-render loop in any consumer ("Maximum update depth exceeded").
 */
let cachedRaw: string | null = null
let cachedValue: DiscountSettings = DEFAULT_DISCOUNT_SETTINGS
let cacheInitialized = false

function parseRaw(raw: string | null): DiscountSettings {
  if (!raw) return DEFAULT_DISCOUNT_SETTINGS
  try {
    const parsed = JSON.parse(raw) as Partial<DiscountSettings>
    return { ...DEFAULT_DISCOUNT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_DISCOUNT_SETTINGS
  }
}

function read(): DiscountSettings {
  if (typeof window === "undefined") return DEFAULT_DISCOUNT_SETTINGS
  const raw = window.localStorage.getItem(KEY)
  if (cacheInitialized && raw === cachedRaw) return cachedValue
  cachedRaw = raw
  cachedValue = parseRaw(raw)
  cacheInitialized = true
  return cachedValue
}

function write(settings: DiscountSettings) {
  if (typeof window === "undefined") return
  try {
    const serialized = JSON.stringify(settings)
    window.localStorage.setItem(KEY, serialized)
    cachedRaw = serialized
    cachedValue = settings
    cacheInitialized = true
    notify()
  } catch {}
}

export function getDiscountSettings(): DiscountSettings {
  return read()
}

export function updateDiscountSettings(patch: Partial<DiscountSettings>) {
  const next = { ...read(), ...patch }
  write(next)
  return next
}

export function resetDiscountSettings() {
  write(DEFAULT_DISCOUNT_SETTINGS)
}

export function useDiscountSettings(): DiscountSettings {
  return useSyncExternalStore(
    subscribe,
    () => read(),
    () => DEFAULT_DISCOUNT_SETTINGS,
  )
}
