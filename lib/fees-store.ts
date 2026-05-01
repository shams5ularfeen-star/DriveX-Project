"use client"

import { useSyncExternalStore } from "react"

/**
 * Service fees and time-based pricing uplift settings.
 *
 * Architectural notes:
 *  - The base price of every car is *never* mutated; uplift is computed
 *    on top of (price × days × qty) as separate line items.
 *  - Weekend uplift only applies to the rental days that actually fall on a
 *    weekend (Sat/Sun) — proportional, not blanket.
 *  - Holiday uplift mirrors the same logic against the admin-defined date list.
 *  - Category & city overrides are *additive offsets* (in % points), not
 *    replacements: a +3 override on "Luxury" means weekend goes 5% → 8%.
 */
export type FeeAdjustment = {
  /** Free-text label, e.g. "Luxury", "Karachi" */
  key: string
  /** Additive % offset applied to weekend & holiday uplift for this scope */
  pct: number
}

export interface SpecialDate {
  /** ISO date YYYY-MM-DD */
  date: string
  label: string
  /** Override holiday uplift % just for this date (0 = use global). */
  pct?: number
}

export interface FeeSettings {
  /** Master enable flag for the entire fees system */
  enabled: boolean
  /** Flat platform service fee — % applied to subtotal */
  serviceFeeEnabled: boolean
  serviceFeePct: number
  /** Weekend uplift (Sat + Sun) — % applied to per-day base × weekend-day-count × qty */
  weekendEnabled: boolean
  weekendPct: number
  /** Holiday uplift — % applied to days listed in `specialDates` */
  holidayEnabled: boolean
  holidayPct: number
  specialDates: SpecialDate[]
  /** Per-category additive offsets (Luxury/Exotic typically +) */
  categoryAdjustments: FeeAdjustment[]
  /** Per-city additive offsets (peak cities) */
  cityAdjustments: FeeAdjustment[]
}

const KEY = "drivex.fee-settings.v1"

export const DEFAULT_FEE_SETTINGS: FeeSettings = {
  enabled: true,
  serviceFeeEnabled: true,
  serviceFeePct: 5,
  weekendEnabled: true,
  weekendPct: 5,
  holidayEnabled: true,
  holidayPct: 8,
  specialDates: [
    { date: "2026-03-20", label: "Eid al-Fitr (Day 1)", pct: 15 },
    { date: "2026-03-21", label: "Eid al-Fitr (Day 2)", pct: 12 },
    { date: "2026-05-27", label: "Eid al-Adha (Day 1)", pct: 15 },
    { date: "2026-05-28", label: "Eid al-Adha (Day 2)", pct: 12 },
    { date: "2026-08-14", label: "Independence Day" },
    { date: "2026-12-25", label: "Quaid-e-Azam Day" },
  ],
  categoryAdjustments: [
    { key: "Luxury", pct: 3 },
    { key: "Exotic", pct: 5 },
    { key: "Wedding", pct: 2 },
  ],
  cityAdjustments: [
    { key: "Islamabad", pct: 1 },
    { key: "Karachi", pct: 2 },
  ],
}

const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}
const notify = () => {
  listeners.forEach((l) => l())
}

/**
 * Snapshot cache. `useSyncExternalStore` calls the snapshot getter on every
 * render and uses `Object.is` to detect changes — if we returned a freshly
 * `JSON.parse`d object every time, React would see "new" state on every render
 * and trigger an infinite re-render loop ("Maximum update depth exceeded").
 * We cache by the raw localStorage string and only re-parse when it changes.
 */
let cachedRaw: string | null = null
let cachedValue: FeeSettings = DEFAULT_FEE_SETTINGS
let cacheInitialized = false

function parseRaw(raw: string | null): FeeSettings {
  if (!raw) return DEFAULT_FEE_SETTINGS
  try {
    const parsed = JSON.parse(raw) as Partial<FeeSettings>
    return {
      ...DEFAULT_FEE_SETTINGS,
      ...parsed,
      specialDates: parsed.specialDates ?? DEFAULT_FEE_SETTINGS.specialDates,
      categoryAdjustments:
        parsed.categoryAdjustments ?? DEFAULT_FEE_SETTINGS.categoryAdjustments,
      cityAdjustments:
        parsed.cityAdjustments ?? DEFAULT_FEE_SETTINGS.cityAdjustments,
    }
  } catch {
    return DEFAULT_FEE_SETTINGS
  }
}

function read(): FeeSettings {
  if (typeof window === "undefined") return DEFAULT_FEE_SETTINGS
  const raw = window.localStorage.getItem(KEY)
  if (cacheInitialized && raw === cachedRaw) return cachedValue
  cachedRaw = raw
  cachedValue = parseRaw(raw)
  cacheInitialized = true
  return cachedValue
}

function write(next: FeeSettings) {
  if (typeof window === "undefined") return
  try {
    const serialized = JSON.stringify(next)
    window.localStorage.setItem(KEY, serialized)
    // Pre-warm the cache so the very next `read()` returns this exact object reference
    cachedRaw = serialized
    cachedValue = next
    cacheInitialized = true
    notify()
  } catch {}
}

export function getFeeSettings(): FeeSettings {
  return read()
}

export function updateFeeSettings(patch: Partial<FeeSettings>) {
  const next = { ...read(), ...patch }
  write(next)
  return next
}

export function resetFeeSettings() {
  write(DEFAULT_FEE_SETTINGS)
}

export function useFeeSettings(): FeeSettings {
  return useSyncExternalStore(
    subscribe,
    () => read(),
    () => DEFAULT_FEE_SETTINGS,
  )
}
