"use client"

import { useEffect, useState } from "react"

const BOOKINGS_KEY = "drivex_bookings_v2"
const ORDER_COUNTER_KEY = "drivex_order_counter_v1"
const ORDER_START = 100001

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"

export type Booking = {
  /** Internal unique id (random) */
  id: string
  /** Public-facing numeric order number, e.g. 100001, 100002 — strictly digits, never repeats */
  orderNumber: number
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  userCnic?: string
  carId: string
  carName: string
  category: string
  cityId: string
  cityName: string
  /** ISO date YYYY-MM-DD */
  pickupDate: string
  /** ISO date YYYY-MM-DD */
  returnDate: string
  days: number
  /** Number of cars reserved on this order (default 1) */
  quantity: number
  pricePerDay: number
  subtotal: number
  discountPct: number
  discountAmount: number
  /** Optional promo code redeemed for this order (uppercase) */
  promoCode?: string
  /** Per-layer breakdown — auto + promo. Empty array if no discount applied. */
  discountBreakdown?: {
    source: "loyalty" | "bulk" | "category" | "seasonal" | "promo"
    label: string
    pct: number
    amount: number
    reason: string
  }[]
  /** Total platform/service/uplift fees charged on top of (subtotal − discount) */
  feeAmount?: number
  /** Per-line fee breakdown: service, weekend, holiday */
  feeBreakdown?: {
    source: "service" | "weekend" | "holiday"
    label: string
    pct: number
    amount: number
    reason: string
    daysApplied?: number
  }[]
  total: number
  /**
   * Payment rail used for this booking.
   * - "card"      : credit / debit card
   * - "cash"      : pay-at-pickup
   * - "jazzcash"  : JazzCash mobile wallet
   * - "easypaisa" : EasyPaisa mobile wallet
   * Legacy "wallet" value kept for back-compat with older saved bookings.
   */
  paymentMethod: "card" | "cash" | "jazzcash" | "easypaisa" | "wallet"
  status: BookingStatus
  /** Optional driver assigned by admin */
  driverName?: string
  /** Optional admin notes */
  adminNote?: string
  createdAt: string
  /** ISO timestamps for status history */
  history: { status: BookingStatus; at: string; note?: string }[]
}

type Listener = () => void
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("drivex:bookings-changed"))
  }
}

function readBookings(): Booking[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(BOOKINGS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Booking[]
    // Back-compat: ensure every booking carries a quantity
    return parsed.map((b) => ({ ...b, quantity: b.quantity ?? 1 }))
  } catch {
    return []
  }
}

function writeBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
  notify()
}

/**
 * Atomically allocate the next numeric order number.
 *
 * Guarantees (even if localStorage is tampered with or the counter is wiped):
 *   - Always >= ORDER_START (100001)
 *   - Always > the highest orderNumber already present in storage
 *   - Always > previous counter value
 *
 * This makes order IDs **globally unique and continuously increasing** across
 * users, sessions, and devices on the same browser store.
 */
function nextOrderNumber(): number {
  if (typeof window === "undefined") return ORDER_START

  // Counter checkpoint
  const raw = window.localStorage.getItem(ORDER_COUNTER_KEY)
  const counter = raw ? Number.parseInt(raw, 10) : ORDER_START - 1
  const counterNext =
    (Number.isFinite(counter) && counter >= ORDER_START - 1
      ? counter
      : ORDER_START - 1) + 1

  // Floor at the highest existing orderNumber + 1 to absorb counter resets
  let highestExisting = ORDER_START - 1
  try {
    const bookings = readBookings()
    for (const b of bookings) {
      if (typeof b.orderNumber === "number" && b.orderNumber > highestExisting) {
        highestExisting = b.orderNumber
      }
    }
  } catch {
    // ignore — fall back to counter-only path
  }

  const safeNext = Math.max(counterNext, highestExisting + 1, ORDER_START)
  window.localStorage.setItem(ORDER_COUNTER_KEY, String(safeNext))
  return safeNext
}

export function getAllBookings(): Booking[] {
  return readBookings()
}

export function getBookingsForUser(userId: string): Booking[] {
  return readBookings().filter((b) => b.userId === userId)
}

export function getBookingByOrderNumber(orderNumber: number): Booking | undefined {
  return readBookings().find((b) => b.orderNumber === orderNumber)
}

export function addBooking(
  booking: Omit<Booking, "id" | "createdAt" | "status" | "history" | "orderNumber">,
): Booking {
  const now = new Date().toISOString()
  const full: Booking = {
    ...booking,
    id: `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    orderNumber: nextOrderNumber(),
    status: "pending",
    history: [{ status: "pending", at: now, note: "Order placed" }],
    createdAt: now,
  }
  const all = readBookings()
  all.push(full)
  writeBookings(all)
  return full
}

export function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  note?: string,
): Booking | undefined {
  const all = readBookings()
  const idx = all.findIndex((b) => b.id === bookingId)
  if (idx === -1) return undefined
  const prev = all[idx]
  if (prev.status === status) return prev
  const next: Booking = {
    ...prev,
    status,
    history: [
      ...prev.history,
      { status, at: new Date().toISOString(), note },
    ],
  }
  all[idx] = next
  writeBookings(all)
  return next
}

export function assignDriver(bookingId: string, driverName: string): Booking | undefined {
  const all = readBookings()
  const idx = all.findIndex((b) => b.id === bookingId)
  if (idx === -1) return undefined
  const next: Booking = { ...all[idx], driverName }
  all[idx] = next
  writeBookings(all)
  return next
}

/**
 * Cancel a booking — sets status to cancelled, which automatically restores
 * availability since the availability engine only counts `confirmed` bookings.
 */
export function cancelBooking(bookingId: string, note = "Cancelled"): Booking | undefined {
  return updateBookingStatus(bookingId, "cancelled", note)
}

export function useBookings(userId?: string | null) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const sync = () => {
      const all = readBookings()
      setBookings(userId ? all.filter((b) => b.userId === userId) : all)
    }
    sync()
    setHydrated(true)
    listeners.add(sync)
    window.addEventListener("storage", sync)
    window.addEventListener("drivex:bookings-changed", sync)
    return () => {
      listeners.delete(sync)
      window.removeEventListener("storage", sync)
      window.removeEventListener("drivex:bookings-changed", sync)
    }
  }, [userId])

  return Object.assign(bookings, { hydrated }) as Booking[] & { hydrated: boolean }
}

/** Hook returning every booking in the system (for admin) */
export function useAllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const sync = () => setBookings(readBookings())
    sync()
    setHydrated(true)
    listeners.add(sync)
    window.addEventListener("storage", sync)
    window.addEventListener("drivex:bookings-changed", sync)
    return () => {
      listeners.delete(sync)
      window.removeEventListener("storage", sync)
      window.removeEventListener("drivex:bookings-changed", sync)
    }
  }, [])

  return { bookings, hydrated }
}
