"use client"

import { useSyncExternalStore } from "react"

export type PromoType = "percentage" | "fixed"

export interface PromoCode {
  id: string
  code: string // uppercase
  type: PromoType
  /** percentage (0–100) for type=percentage, or PKR for type=fixed */
  value: number
  /** ISO YYYY-MM-DD; missing = no expiry */
  expiry?: string
  /** total max usage across all users; missing = unlimited */
  usageLimit?: number
  usageCount: number
  /** restrict to a specific car category — undefined = any */
  applicableCategory?: string
  /** PKR, must be >= this subtotal */
  minOrder?: number
  active: boolean
  description?: string
  /** if true, only users with 0 prior bookings can redeem */
  newUsersOnly?: boolean
}

const KEY = "drivex.promos.v1"

export const DEFAULT_PROMOS: PromoCode[] = [
  {
    id: "p1",
    code: "DRIVEX10",
    type: "percentage",
    value: 10,
    usageCount: 0,
    active: true,
    description: "10% off any rental — site-wide promo",
  },
  {
    id: "p2",
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    usageCount: 0,
    active: true,
    newUsersOnly: true,
    description: "20% off your first booking",
  },
  {
    id: "p3",
    code: "WEEKEND15",
    type: "percentage",
    value: 15,
    usageCount: 0,
    active: true,
    description: "Weekend special — 15% off (Fri–Sun pickups)",
  },
  {
    id: "p4",
    code: "LUXURY25",
    type: "percentage",
    value: 25,
    usageCount: 0,
    active: true,
    applicableCategory: "Luxury",
    minOrder: 25000,
    description: "25% off Luxury fleet (min order PKR 25,000)",
  },
  {
    id: "p5",
    code: "FREE5K",
    type: "fixed",
    value: 5000,
    usageCount: 0,
    active: true,
    minOrder: 30000,
    description: "Flat PKR 5,000 off orders above PKR 30,000",
    usageLimit: 200,
  },
  {
    id: "p6",
    code: "EID15",
    type: "percentage",
    value: 15,
    usageCount: 0,
    active: false,
    description: "Eid Festival 15% off (admin can activate)",
  },
]

const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
const notify = () => listeners.forEach((l) => l())

/**
 * Snapshot cache for `useSyncExternalStore`. Returning a fresh `JSON.parse`d
 * array on every render would make React see "new" state on every commit and
 * fall into an infinite render loop ("Maximum update depth exceeded").
 */
let cachedRaw: string | null = null
let cachedValue: PromoCode[] = DEFAULT_PROMOS
let cacheInitialized = false

function parseRaw(raw: string | null): PromoCode[] {
  if (!raw) return DEFAULT_PROMOS
  try {
    return JSON.parse(raw) as PromoCode[]
  } catch {
    return DEFAULT_PROMOS
  }
}

function read(): PromoCode[] {
  if (typeof window === "undefined") return DEFAULT_PROMOS
  const raw = window.localStorage.getItem(KEY)
  if (cacheInitialized && raw === cachedRaw) return cachedValue
  cachedRaw = raw
  cachedValue = parseRaw(raw)
  cacheInitialized = true
  return cachedValue
}

function write(promos: PromoCode[]) {
  if (typeof window === "undefined") return
  try {
    const serialized = JSON.stringify(promos)
    window.localStorage.setItem(KEY, serialized)
    cachedRaw = serialized
    cachedValue = promos
    cacheInitialized = true
    notify()
  } catch {}
}

function genId() {
  return `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export function getPromos(): PromoCode[] {
  return read()
}

export function findPromo(code: string): PromoCode | undefined {
  const c = code.trim().toUpperCase()
  return read().find((p) => p.code === c)
}

export function addPromo(input: Omit<PromoCode, "id" | "usageCount">): PromoCode {
  const next: PromoCode = {
    ...input,
    code: input.code.trim().toUpperCase(),
    id: genId(),
    usageCount: 0,
  }
  write([...read(), next])
  return next
}

export function updatePromo(id: string, patch: Partial<Omit<PromoCode, "id">>) {
  const all = read()
  const idx = all.findIndex((p) => p.id === id)
  if (idx === -1) return null
  const updated: PromoCode = {
    ...all[idx],
    ...patch,
    code: (patch.code ?? all[idx].code).trim().toUpperCase(),
  }
  all[idx] = updated
  write(all)
  return updated
}

export function deletePromo(id: string) {
  write(read().filter((p) => p.id !== id))
}

export function togglePromoActive(id: string) {
  const all = read()
  const idx = all.findIndex((p) => p.id === id)
  if (idx === -1) return
  all[idx] = { ...all[idx], active: !all[idx].active }
  write(all)
}

export function incrementPromoUsage(code: string) {
  const all = read()
  const idx = all.findIndex((p) => p.code === code.trim().toUpperCase())
  if (idx === -1) return
  all[idx] = { ...all[idx], usageCount: all[idx].usageCount + 1 }
  write(all)
}

export function resetPromos() {
  write(DEFAULT_PROMOS)
}

export type PromoValidationResult =
  | { ok: true; promo: PromoCode; discountAmount: number; pct: number }
  | { ok: false; error: string }

/**
 * Validate a promo code against the current cart context.
 * Returns either a usable result with the computed discount amount,
 * or an error message describing why the code can't be applied.
 */
export function validatePromo(args: {
  code: string
  subtotal: number
  category: string
  pickupDateISO: string
  userPriorBookingCount: number
}): PromoValidationResult {
  const codeUpper = args.code.trim().toUpperCase()
  if (!codeUpper) return { ok: false, error: "Enter a promo code" }
  const promo = findPromo(codeUpper)
  if (!promo) return { ok: false, error: "Promo code not found" }
  if (!promo.active) return { ok: false, error: "This promo is not active" }
  if (promo.expiry) {
    const today = args.pickupDateISO
    if (today > promo.expiry) return { ok: false, error: "Promo has expired" }
  }
  if (typeof promo.usageLimit === "number" && promo.usageCount >= promo.usageLimit) {
    return { ok: false, error: "Promo usage limit reached" }
  }
  if (promo.applicableCategory && promo.applicableCategory !== args.category) {
    return {
      ok: false,
      error: `Valid only for ${promo.applicableCategory} category`,
    }
  }
  if (typeof promo.minOrder === "number" && args.subtotal < promo.minOrder) {
    return {
      ok: false,
      error: `Minimum order PKR ${promo.minOrder.toLocaleString()}`,
    }
  }
  if (promo.newUsersOnly && args.userPriorBookingCount > 0) {
    return { ok: false, error: "Promo for new users only" }
  }

  const discountAmount =
    promo.type === "percentage"
      ? Math.round((args.subtotal * promo.value) / 100)
      : Math.min(promo.value, args.subtotal)
  const pct =
    args.subtotal > 0 ? Math.round((discountAmount / args.subtotal) * 100) : 0

  return { ok: true, promo, discountAmount, pct }
}

export function usePromos(): PromoCode[] {
  return useSyncExternalStore(
    subscribe,
    () => read(),
    () => DEFAULT_PROMOS,
  )
}
