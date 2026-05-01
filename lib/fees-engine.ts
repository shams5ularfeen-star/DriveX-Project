import type { FeeSettings } from "@/lib/fees-store"

export type FeeSource = "service" | "weekend" | "holiday"

export interface FeeLine {
  source: FeeSource
  /** UI label, e.g. "Service Fee (5%)" or "Weekend Uplift (5% × 2 days)" */
  label: string
  /** % applied (final, after offsets) */
  pct: number
  /** PKR amount actually added */
  amount: number
  /** Short reason shown in tooltip */
  reason: string
  /** Number of days this line applies to (1 for service fee, N for weekend/holiday) */
  daysApplied?: number
}

export interface FeeEngineInput {
  /** Already-discounted subtotal (price × days × qty − discounts) */
  subtotal: number
  pricePerDay: number
  quantity: number
  /** ISO YYYY-MM-DD */
  pickupDateISO: string
  /** ISO YYYY-MM-DD */
  returnDateISO: string
  city: string
  category: string
  settings: FeeSettings
}

export interface FeeEngineResult {
  lines: FeeLine[]
  totalFeeAmount: number
  /** Combined uplift % vs the discounted subtotal — useful for analytics */
  totalFeePct: number
  /** Detected weekend day count within rental period */
  weekendDays: number
  /** Detected holiday day count within rental period */
  holidayDays: number
  /** Days the engine considered (inclusive of pickup, exclusive of return) */
  totalDays: number
}

/* ---------- Helpers ---------- */

function parseISO(iso: string): Date {
  // Build a UTC-stable date so DST never shifts the day-of-week
  return new Date(iso + "T00:00:00")
}

function diffDays(fromISO: string, toISO: string): number {
  const a = parseISO(fromISO).getTime()
  const b = parseISO(toISO).getTime()
  return Math.max(1, Math.round((b - a) / (1000 * 60 * 60 * 24)))
}

function isWeekend(d: Date): boolean {
  const dow = d.getDay()
  return dow === 0 || dow === 6 // Sunday or Saturday
}

function toISO(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Walk every day in [pickup, return) and bucket each into weekend / holiday.
 * Holiday wins if a date is both weekend AND a special date — a holiday uplift
 * is generally more meaningful for the user to see.
 */
function bucketDays(
  pickupISO: string,
  returnISO: string,
  specialDates: { date: string }[],
) {
  const holidaySet = new Set(specialDates.map((s) => s.date))
  const start = parseISO(pickupISO)
  const total = diffDays(pickupISO, returnISO)
  let weekend = 0
  let holiday = 0
  for (let i = 0; i < total; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    const iso = toISO(day)
    if (holidaySet.has(iso)) {
      holiday++
    } else if (isWeekend(day)) {
      weekend++
    }
  }
  return { weekend, holiday, total }
}

/** Sum the additive offsets that apply to a given key in the adjustment list */
function offsetFor(
  adjustments: { key: string; pct: number }[],
  key: string,
): number {
  return adjustments
    .filter((a) => a.key.toLowerCase() === key.toLowerCase())
    .reduce((s, a) => s + a.pct, 0)
}

/* ---------- Engine ---------- */

export function runFeeEngine(input: FeeEngineInput): FeeEngineResult {
  const { settings, subtotal, pricePerDay, quantity, city, category } = input

  // Master kill-switch: returns a clean empty result so callers can spread freely
  if (!settings.enabled) {
    return {
      lines: [],
      totalFeeAmount: 0,
      totalFeePct: 0,
      weekendDays: 0,
      holidayDays: 0,
      totalDays: diffDays(input.pickupDateISO, input.returnDateISO),
    }
  }

  const { weekend, holiday, total } = bucketDays(
    input.pickupDateISO,
    input.returnDateISO,
    settings.specialDates,
  )

  const cityOffset = offsetFor(settings.cityAdjustments, city)
  const categoryOffset = offsetFor(settings.categoryAdjustments, category)
  const upliftOffset = cityOffset + categoryOffset

  const lines: FeeLine[] = []

  // 1) Service Fee — flat % of subtotal
  if (settings.serviceFeeEnabled && settings.serviceFeePct > 0 && subtotal > 0) {
    const pct = settings.serviceFeePct
    const amount = Math.round((subtotal * pct) / 100)
    lines.push({
      source: "service",
      label: `Service Fee (${pct}%)`,
      pct,
      amount,
      reason:
        "Platform service fee covers verification, support, and 24/7 roadside assistance.",
    })
  }

  // 2) Weekend Uplift — only on Sat/Sun days inside the rental period
  if (settings.weekendEnabled && weekend > 0 && pricePerDay > 0) {
    const pct = Math.max(0, settings.weekendPct + upliftOffset)
    const dailyBase = pricePerDay * quantity
    const amount = Math.round((dailyBase * weekend * pct) / 100)
    if (amount > 0) {
      lines.push({
        source: "weekend",
        label: `Weekend Uplift (${pct}% × ${weekend} day${weekend === 1 ? "" : "s"})`,
        pct,
        amount,
        daysApplied: weekend,
        reason: buildReason(
          "Saturday & Sunday demand uplift",
          cityOffset,
          categoryOffset,
          city,
          category,
        ),
      })
    }
  }

  // 3) Holiday Uplift — only on configured special dates inside the rental period
  if (settings.holidayEnabled && holiday > 0 && pricePerDay > 0) {
    // Collect each holiday date that's inside the rental period and compute weighted average %
    const periodHolidayDates = collectHolidayDatesInPeriod(
      input.pickupDateISO,
      input.returnDateISO,
      settings.specialDates,
    )
    let amount = 0
    let weightedPct = 0
    for (const sd of periodHolidayDates) {
      const dayPct = Math.max(0, (sd.pct ?? settings.holidayPct) + upliftOffset)
      const dayAmount = Math.round((pricePerDay * quantity * dayPct) / 100)
      amount += dayAmount
      weightedPct += dayPct
    }
    const avgPct = Math.round(weightedPct / Math.max(1, periodHolidayDates.length))
    if (amount > 0) {
      lines.push({
        source: "holiday",
        label: `Holiday Uplift (${avgPct}% × ${holiday} day${holiday === 1 ? "" : "s"})`,
        pct: avgPct,
        amount,
        daysApplied: holiday,
        reason: buildReason(
          `Special date${holiday === 1 ? "" : "s"}: ${periodHolidayDates
            .map((s) => s.label)
            .join(", ")}`,
          cityOffset,
          categoryOffset,
          city,
          category,
        ),
      })
    }
  }

  const totalFeeAmount = lines.reduce((s, l) => s + l.amount, 0)
  const totalFeePct =
    subtotal > 0 ? Math.round((totalFeeAmount / subtotal) * 100) : 0

  return {
    lines,
    totalFeeAmount,
    totalFeePct,
    weekendDays: weekend,
    holidayDays: holiday,
    totalDays: total,
  }
}

function buildReason(
  base: string,
  cityOffset: number,
  categoryOffset: number,
  city: string,
  category: string,
): string {
  const extras: string[] = []
  if (categoryOffset > 0) extras.push(`+${categoryOffset}% ${category}`)
  if (cityOffset > 0) extras.push(`+${cityOffset}% ${city}`)
  return extras.length === 0 ? base : `${base} · ${extras.join(", ")}`
}

function collectHolidayDatesInPeriod(
  pickupISO: string,
  returnISO: string,
  specialDates: { date: string; label: string; pct?: number }[],
) {
  const start = parseISO(pickupISO)
  const total = diffDays(pickupISO, returnISO)
  const isoSet = new Set<string>()
  for (let i = 0; i < total; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    isoSet.add(toISO(day))
  }
  return specialDates.filter((s) => isoSet.has(s.date))
}
