"use client"

import { useState } from "react"
import { AdminDashboardHeader, AdminOverview } from "@/components/admin/admin-dashboard"
import { AdminBookings } from "@/components/admin/admin-bookings"
import { AdminFleet } from "@/components/admin/admin-fleet"
import { AdminDiscounts } from "@/components/admin/admin-discounts"

export type AdminTab = "overview" | "cars" | "bookings" | "discounts"

export function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>("overview")

  return (
    <div className="container mx-auto px-4 py-12">
      <AdminDashboardHeader activeTab={tab} onTab={setTab} />

      {tab === "overview" && <AdminOverview />}
      {tab === "cars" && <AdminFleet />}
      {tab === "bookings" && <AdminBookings />}
      {tab === "discounts" && <AdminDiscounts />}
    </div>
  )
}
