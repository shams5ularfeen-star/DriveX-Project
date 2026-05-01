import type { Booking } from "@/lib/bookings-store"

export type MembershipTier = "Member" | "Silver" | "Gold" | "Platinum" | "Concierge"

export type MembershipInfo = {
  tier: MembershipTier
  totalBookings: number
  totalSpent: number
  /** Highest discount currently unlocked across all tiers */
  bestDiscountPct: number
  /** Bookings remaining until next tier */
  nextTierIn: number | null
  /** Label of the next tier */
  nextTier: MembershipTier | null
}

const TIER_THRESHOLDS: { tier: MembershipTier; min: number }[] = [
  { tier: "Member", min: 0 },
  { tier: "Silver", min: 3 },
  { tier: "Gold", min: 8 },
  { tier: "Platinum", min: 15 },
  { tier: "Concierge", min: 25 },
]

export function computeMembership(userBookings: Booking[]): MembershipInfo {
  const active = userBookings.filter(
    (b) => b.status === "confirmed" || b.status === "completed",
  )
  const totalBookings = active.length
  const totalSpent = active.reduce((sum, b) => sum + b.total, 0)

  let tier: MembershipTier = "Member"
  let nextTier: MembershipTier | null = "Silver"
  let nextTierIn: number | null = TIER_THRESHOLDS[1].min - totalBookings

  for (let i = 0; i < TIER_THRESHOLDS.length; i++) {
    const t = TIER_THRESHOLDS[i]
    if (totalBookings >= t.min) {
      tier = t.tier
      const next = TIER_THRESHOLDS[i + 1]
      nextTier = next ? next.tier : null
      nextTierIn = next ? Math.max(0, next.min - totalBookings) : null
    }
  }

  // Best discount calculation across categories
  const bestDiscountPct = active.reduce(
    (max, b) => (b.discountPct > max ? b.discountPct : max),
    0,
  )

  return { tier, totalBookings, totalSpent, bestDiscountPct, nextTierIn, nextTier }
}

export function tierColor(tier: MembershipTier): string {
  switch (tier) {
    case "Member":
      return "text-muted-foreground"
    case "Silver":
      return "text-zinc-300"
    case "Gold":
      return "text-primary"
    case "Platinum":
      return "text-cyan-300"
    case "Concierge":
      return "text-gold-shimmer"
  }
}
