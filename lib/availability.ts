import type { Booking } from "@/lib/bookings-store"
import type { Car } from "@/lib/cars-data"

/**
 * Per-car fleet capacity by category — the system-wide default if a car has
 * no explicit `totalQuantity` set.
 *  - Economy: 25 unit fleet
 *  - Sedan / SUV / Luxury (combined tier): 20 unit fleet
 *  - Exotic / Ultra-Premium: 5 + 5 = 10 unit fleet
 *  - Vans / Family / Wedding (specialty): 8 unit fleet
 */
export function getFleetCapacity(category: string): number {
  switch (category) {
    case "Economy":
      return 25
    case "Sedan":
    case "SUV":
    case "Luxury":
      return 20
    case "Exotic":
      return 10
    case "Vans":
    case "Family":
    case "Wedding":
      return 8
    default:
      return 15
  }
}

/**
 * Resolved total quantity for a car.
 * Honors an admin-set `car.totalQuantity` and falls back to the category
 * default. This is the strict "Total" inventory used everywhere.
 */
export function getCarTotalQuantity(car: Pick<Car, "category" | "totalQuantity">): number {
  if (typeof car.totalQuantity === "number" && car.totalQuantity >= 0) {
    return car.totalQuantity
  }
  return getFleetCapacity(car.category)
}

/**
 * Sum of `quantity` across an arbitrary booking list.
 * Used by the admin dashboard for total-cars-booked KPIs.
 */
export function sumBookingQuantity(bookings: Booking[]): number {
  return bookings.reduce((s, b) => s + (b.quantity ?? 1), 0)
}

/** Tier label for the discount engine + UI */
export function getCategoryTier(
  category: string,
): "economy" | "premium" | "exotic" | "specialty" {
  if (category === "Economy") return "economy"
  if (category === "Sedan" || category === "SUV" || category === "Luxury") return "premium"
  if (category === "Exotic") return "exotic"
  return "specialty"
}

/** Deterministic FNV-1a-style hash → 0..1 */
function seededRandom(seed: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return (h % 100000) / 100000
}

/** Format date as YYYY-MM-DD using local time */
export function toISODate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

/** Get next N days starting today, as ISO date strings */
export function getNextDays(n: number): string[] {
  const out: string[] = []
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  for (let i = 0; i < n; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    out.push(toISODate(d))
  }
  return out
}

/** Friendly day label */
export function dayLabel(dateISO: string, idx: number): string {
  if (idx === 0) return "Today"
  if (idx === 1) return "Tomorrow"
  const d = new Date(dateISO + "T00:00:00")
  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
}

export type AvailabilityCell = {
  date: string
  available: number
  capacity: number
  pct: number
}

/**
 * Compute available units of a given car in a given city on a given date.
 * Capacity = `car.totalQuantity` (admin-controlled) with category fallback.
 * Booked = sum of `quantity` across all non-cancelled overlapping bookings.
 * A small deterministic "baseline reserve" simulates fleet logistics across
 * cities so each city starts at a slightly different — but stable — state.
 */
export function computeAvailability(args: {
  carId: string
  cityId: string
  category: string
  dateISO: string
  totalQuantity: number
  bookings: Booking[]
}): AvailabilityCell {
  const capacity = args.totalQuantity
  const seed = `${args.cityId}|${args.carId}|${args.dateISO}`
  const r = seededRandom(seed)
  // Baseline: 65% – 100% of capacity available before user activity
  const baseline = Math.round(capacity * (0.65 + r * 0.35))
  const booked = args.bookings
    .filter(
      (b) =>
        // Pending, confirmed and completed bookings hold inventory.
        // Cancelled bookings automatically release availability.
        b.status !== "cancelled" &&
        b.carId === args.carId &&
        b.cityId === args.cityId &&
        args.dateISO >= b.pickupDate &&
        args.dateISO < b.returnDate,
    )
    .reduce((s, b) => s + (b.quantity ?? 1), 0)
  const available = Math.max(0, baseline - booked)
  return {
    date: args.dateISO,
    available,
    capacity,
    pct: capacity > 0 ? Math.round((available / capacity) * 100) : 0,
  }
}

/** 3-day rolling forecast for a car in a city */
export function get3DayForecast(args: {
  carId: string
  cityId: string
  category: string
  totalQuantity: number
  bookings: Booking[]
}): AvailabilityCell[] {
  return getNextDays(3).map((dateISO) =>
    computeAvailability({ ...args, dateISO }),
  )
}

// ---- Discount engine ----------------------------------------------------

export type DiscountResult = {
  pct: number
  reason: string
}

/**
 * Tier-based discount based on the user's previous confirmed booking count
 * within the same tier.
 *  - Economy:   5/10/15/20 bookings → 5/10/15/20%
 *  - Premium (Sedan/SUV/Luxury): 10 → 10%, 20 → 15%
 *  - Exotic:    flat 8% promo (limited offers)
 *  - Specialty: 5%
 */
export function computeDiscount(args: {
  category: string
  userBookingCountSameTier: number
}): DiscountResult {
  const tier = getCategoryTier(args.category)
  const n = args.userBookingCountSameTier

  if (tier === "economy") {
    if (n >= 20) return { pct: 20, reason: "Economy loyalty: 20+ bookings" }
    if (n >= 15) return { pct: 15, reason: "Economy loyalty: 15+ bookings" }
    if (n >= 10) return { pct: 10, reason: "Economy loyalty: 10+ bookings" }
    if (n >= 5) return { pct: 5, reason: "Economy loyalty: 5+ bookings" }
    return { pct: 0, reason: "No discount yet — book 5 economy rides to unlock 5%" }
  }
  if (tier === "premium") {
    if (n >= 20) return { pct: 15, reason: "Premium loyalty: 20+ bookings" }
    if (n >= 10) return { pct: 10, reason: "Premium loyalty: 10+ bookings" }
    return { pct: 0, reason: "Book 10 premium rides to unlock 10%" }
  }
  if (tier === "exotic") {
    return { pct: 8, reason: "Exotic limited-time concierge promo" }
  }
  return { pct: 5, reason: "Specialty fleet promo" }
}

/** Count user bookings that share the same tier as the given category */
export function countUserBookingsInTier(
  bookings: Booking[],
  userId: string,
  category: string,
): number {
  const targetTier = getCategoryTier(category)
  return bookings.filter(
    (b) =>
      b.userId === userId &&
      (b.status === "confirmed" || b.status === "completed") &&
      getCategoryTier(b.category) === targetTier,
  ).length
}

/** Inclusive day-count between two ISO dates (min 1) */
export function daysBetween(pickupISO: string, returnISO: string): number {
  const p = new Date(pickupISO + "T00:00:00").getTime()
  const r = new Date(returnISO + "T00:00:00").getTime()
  const diff = Math.round((r - p) / 86400000)
  return Math.max(1, diff)
}
