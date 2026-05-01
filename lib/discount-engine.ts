import type { DiscountSettings } from "@/lib/discount-settings"
import { validatePromo, type PromoCode } from "@/lib/promos-store"

export type DiscountSource = "loyalty" | "bulk" | "category" | "seasonal" | "promo"

export interface DiscountLayer {
  source: DiscountSource
  label: string
  /** Percentage applied (or 0 for fixed promo); used for ordering */
  pct: number
  /** PKR amount actually applied */
  amount: number
  reason: string
  /** Internal — for sorting before stacking cap */
  rawAmount: number
}

export interface DiscountEngineInput {
  subtotal: number
  category: string
  quantity: number
  pickupDateISO: string
  /** total prior confirmed/completed bookings of the user (for loyalty + new-user check) */
  userPriorBookingCount: number
  promoCode?: string
  settings: DiscountSettings
  promos: PromoCode[]
}

export interface DiscountEngineResult {
  baseSubtotal: number
  /** All layers that passed and were applied (after stacking cap) */
  applied: DiscountLayer[]
  /** Layers that were eligible but skipped due to stacking limits */
  rejected: { layer: DiscountLayer; reason: string }[]
  totalDiscountAmount: number
  totalDiscountPct: number
  finalTotal: number
  promoError?: string
  /** "Best deal" headline to highlight in the UI */
  bestDealLabel?: string
}

// ---- Helpers ----
function pickHighest<T>(items: T[], key: (t: T) => number): T | undefined {
  if (items.length === 0) return undefined
  return items.reduce((best, cur) => (key(cur) > key(best) ? cur : best), items[0])
}

/** Friday + Saturday + Sunday = weekend (PKR rental usage pattern) */
function isWeekend(iso: string): boolean {
  const d = new Date(iso + "T00:00:00")
  const dow = d.getDay() // 0=Sun .. 6=Sat
  return dow === 0 || dow === 5 || dow === 6
}

/** Treat 22:00–06:00 pickup as "night" — but checkout works in dates only,
 * so we approximate "night" as today's date booking made past 18:00 client-time. */
function isNightNow(): boolean {
  const h = new Date().getHours()
  return h >= 22 || h < 6
}

/** Demo Eid windows for 2026 (admin can override via campaign edit) */
const EID_WINDOWS: Array<{ from: string; to: string }> = [
  { from: "2026-03-20", to: "2026-03-23" }, // Eid al-Fitr
  { from: "2026-05-27", to: "2026-05-30" }, // Eid al-Adha
]
function isEid(iso: string): boolean {
  return EID_WINDOWS.some((w) => iso >= w.from && iso <= w.to)
}

/** Pick the highest matching loyalty/bulk tier */
function loyaltyPctFor(count: number, tiers: { minBookings: number; pct: number }[]): number {
  let best = 0
  for (const t of tiers) if (count >= t.minBookings) best = Math.max(best, t.pct)
  return best
}
function bulkPctFor(qty: number, tiers: { minQty: number; pct: number }[]): number {
  let best = 0
  for (const t of tiers) if (qty >= t.minQty) best = Math.max(best, t.pct)
  return best
}

/**
 * Run all discount layers, then enforce stacking rules:
 *  - keep the top `maxAutoLayers` automatic layers (default 2)
 *  - promo always stacks on top (1 promo per booking)
 *  - cap total discount at `maxTotalPct` (default 40%)
 */
export function runDiscountEngine(input: DiscountEngineInput): DiscountEngineResult {
  const { subtotal, category, quantity, pickupDateISO, settings } = input
  const candidates: DiscountLayer[] = []

  // -- Loyalty --
  if (settings.loyaltyEnabled) {
    const pct = loyaltyPctFor(input.userPriorBookingCount, settings.loyaltyTiers)
    if (pct > 0) {
      const amount = Math.round((subtotal * pct) / 100)
      candidates.push({
        source: "loyalty",
        label: `Loyalty discount (${pct}%)`,
        pct,
        amount,
        rawAmount: amount,
        reason: `${input.userPriorBookingCount} bookings unlocked tier`,
      })
    }
  }

  // -- Bulk --
  if (settings.bulkEnabled && quantity > 1) {
    const pct = bulkPctFor(quantity, settings.bulkTiers)
    if (pct > 0) {
      const amount = Math.round((subtotal * pct) / 100)
      candidates.push({
        source: "bulk",
        label: `Bulk booking (${pct}%)`,
        pct,
        amount,
        rawAmount: amount,
        reason: `${quantity} cars booked together`,
      })
    }
  }

  // -- Category cap based discount: small "category bonus" up to 5% if cap allows --
  if (settings.categoryEnabled) {
    const cap = settings.categoryCaps[category] ?? 0
    // Give a soft bonus that scales with category cap (Economy → 5, Sedan → 4, Luxury → 1, Exotic → 0)
    const bonus =
      cap >= 30 ? 5 : cap >= 25 ? 4 : cap >= 20 ? 3 : cap >= 15 ? 2 : cap >= 10 ? 1 : 0
    if (bonus > 0) {
      const amount = Math.round((subtotal * bonus) / 100)
      candidates.push({
        source: "category",
        label: `${category} bonus (${bonus}%)`,
        pct: bonus,
        amount,
        rawAmount: amount,
        reason: `${category} class incentive`,
      })
    }
  }

  // -- Seasonal / time-based campaigns --
  if (settings.seasonalEnabled) {
    for (const c of settings.campaigns) {
      if (!c.enabled) continue
      let matches = false
      if (c.trigger === "always") matches = true
      else if (c.trigger === "weekend") matches = isWeekend(pickupDateISO)
      else if (c.trigger === "night") matches = isNightNow()
      else if (c.trigger === "eid") matches = isEid(pickupDateISO)
      if (!matches) continue
      const amount = Math.round((subtotal * c.pct) / 100)
      candidates.push({
        source: "seasonal",
        label: `${c.label} (${c.pct}%)`,
        pct: c.pct,
        amount,
        rawAmount: amount,
        reason: `Limited-time campaign · ${c.trigger}`,
      })
    }
  }

  // -- Stacking: keep top N highest-percentage automatic layers --
  // Group by source so we never pick two from the same family (e.g. two seasonal)
  const bestPerSource = new Map<DiscountSource, DiscountLayer>()
  for (const c of candidates) {
    const existing = bestPerSource.get(c.source)
    if (!existing || c.pct > existing.pct) bestPerSource.set(c.source, c)
  }
  const autos = Array.from(bestPerSource.values()).sort((a, b) => b.pct - a.pct)
  const keptAutos = autos.slice(0, Math.max(1, settings.maxAutoLayers))
  const droppedAutos = autos.slice(settings.maxAutoLayers).map((layer) => ({
    layer,
    reason: `Stacking limit (max ${settings.maxAutoLayers} auto layers)`,
  }))

  // -- Promo (validated separately) --
  let promoError: string | undefined
  let promoLayer: DiscountLayer | undefined
  const code = (input.promoCode ?? "").trim()
  if (code) {
    const v = validatePromo({
      code,
      subtotal,
      category,
      pickupDateISO,
      userPriorBookingCount: input.userPriorBookingCount,
    })
    if (v.ok) {
      promoLayer = {
        source: "promo",
        label:
          v.promo.type === "percentage"
            ? `Promo ${v.promo.code} (${v.promo.value}%)`
            : `Promo ${v.promo.code} (− PKR ${v.promo.value.toLocaleString()})`,
        pct: v.pct,
        amount: v.discountAmount,
        rawAmount: v.discountAmount,
        reason:
          v.promo.description ??
          (v.promo.type === "percentage"
            ? `${v.promo.value}% off`
            : `Flat PKR ${v.promo.value.toLocaleString()} off`),
      }
    } else {
      promoError = v.error
    }
  }

  // -- Combine, then cap at maxTotalPct --
  const applied: DiscountLayer[] = [...keptAutos]
  if (promoLayer) applied.push(promoLayer)

  let totalDiscountAmount = applied.reduce((s, l) => s + l.amount, 0)
  let totalDiscountPct =
    subtotal > 0 ? Math.round((totalDiscountAmount / subtotal) * 100) : 0

  if (totalDiscountPct > settings.maxTotalPct && subtotal > 0) {
    const cappedAmount = Math.round((subtotal * settings.maxTotalPct) / 100)
    const ratio = cappedAmount / totalDiscountAmount
    for (const layer of applied) {
      layer.amount = Math.round(layer.amount * ratio)
    }
    totalDiscountAmount = applied.reduce((s, l) => s + l.amount, 0)
    totalDiscountPct = settings.maxTotalPct
  }

  const finalTotal = Math.max(0, subtotal - totalDiscountAmount)

  // -- Best deal label (the highest-pct auto layer, used for headline) --
  const bestAuto = pickHighest(keptAutos, (l) => l.pct)
  const bestDealLabel =
    promoLayer && promoLayer.pct >= (bestAuto?.pct ?? 0)
      ? promoLayer.label
      : bestAuto?.label

  return {
    baseSubtotal: subtotal,
    applied,
    rejected: droppedAutos,
    totalDiscountAmount,
    totalDiscountPct,
    finalTotal,
    promoError,
    bestDealLabel,
  }
}
