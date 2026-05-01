"use client"

import { useMemo } from "react"
import {
  Banknote,
  CalendarClock,
  Car as CarIcon,
  CheckCircle2,
  ClipboardList,
  Hourglass,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCars } from "@/lib/cars-store"
import { useAllBookings } from "@/lib/bookings-store"
import { CITIES } from "@/lib/cars-data"
import { logoutAdmin, useAdminAuth } from "@/lib/admin-auth"
import { sumBookingQuantity, getCarTotalQuantity } from "@/lib/availability"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type AdminTabKey = "overview" | "cars" | "bookings" | "discounts"

export function AdminDashboardHeader({
  onTab,
  activeTab,
}: {
  onTab: (t: AdminTabKey) => void
  activeTab: string
}) {
  const router = useRouter()
  const { session } = useAdminAuth()

  const handleLogout = () => {
    logoutAdmin()
    toast.success("Signed out", { description: "Admin session ended." })
    router.replace("/admin/login")
  }

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Console
            {session && (
              <span className="ml-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-primary">
                {session.email}
              </span>
            )}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">
            Operations <span className="text-gold-gradient">Command</span>
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Central control for the entire DriveX platform. All changes propagate instantly
            to user dashboards and live availability across every city.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="self-start gap-1.5 border-border/60 bg-transparent md:self-end"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </Button>
      </div>

      <nav
        role="tablist"
        className="inline-flex gap-1 self-start rounded-full border border-border/60 bg-card/60 p-1 backdrop-blur"
      >
        {[
          { key: "overview", label: "Overview" },
          { key: "cars", label: "Fleet" },
          { key: "bookings", label: "Bookings" },
          { key: "discounts", label: "Discounts" },
        ].map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            onClick={() => onTab(t.key as AdminTabKey)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
              activeTab === t.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export function AdminOverview() {
  const cars = useCars()
  const { bookings } = useAllBookings()

  const stats = useMemo(() => {
    const total = bookings.length
    const pending = bookings.filter((b) => b.status === "pending").length
    const confirmed = bookings.filter((b) => b.status === "confirmed").length
    const completed = bookings.filter((b) => b.status === "completed").length
    const cancelled = bookings.filter((b) => b.status === "cancelled").length
    const revenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((s, b) => s + b.total, 0)
    const uniqueUsers = new Set(bookings.map((b) => b.userId)).size
    return { total, pending, confirmed, completed, cancelled, revenue, uniqueUsers }
  }, [bookings])

  // ---- Fleet quantity rollup (total / booked / available across all cars × all cities) ----
  const fleetStats = useMemo(() => {
    const cityCount = CITIES.length
    let totalUnits = 0
    cars.forEach((c) => {
      totalUnits += getCarTotalQuantity(c) * cityCount
    })
    const activeBookings = bookings.filter((b) => b.status !== "cancelled")
    const bookedUnits = sumBookingQuantity(activeBookings)
    const availableUnits = Math.max(0, totalUnits - bookedUnits)
    return { totalUnits, bookedUnits, availableUnits }
  }, [cars, bookings])

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    cars.forEach((c) => map.set(c.category, (map.get(c.category) || 0) + 1))
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [cars])

  return (
    <div className="space-y-6">
      {/* Top stat grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total fleet"
          value={cars.length}
          hint={`${cars.length === 83 ? "Spec target met" : "Target: 83 cars"}`}
          icon={<CarIcon className="h-4 w-4" />}
        />
        <StatCard
          label="Total cities"
          value={CITIES.length}
          hint="Inventory mirrored everywhere"
          icon={<MapPin className="h-4 w-4" />}
        />
        <StatCard
          label="Total bookings"
          value={stats.total}
          hint={`${stats.uniqueUsers} unique customers`}
          icon={<ClipboardList className="h-4 w-4" />}
        />
        <StatCard
          label="Total revenue"
          value={`PKR ${Math.round(stats.revenue).toLocaleString()}`}
          hint="Excludes cancelled orders"
          icon={<Banknote className="h-4 w-4" />}
          gold
        />
      </div>

      {/* Order status grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusStat
          label="Pending approval"
          value={stats.pending}
          icon={<Hourglass className="h-4 w-4" />}
          tone="amber"
        />
        <StatusStat
          label="Confirmed (active)"
          value={stats.confirmed}
          icon={<CheckCircle2 className="h-4 w-4" />}
          tone="emerald"
        />
        <StatusStat
          label="Completed"
          value={stats.completed}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="sky"
        />
        <StatusStat
          label="Cancelled"
          value={stats.cancelled}
          icon={<XCircle className="h-4 w-4" />}
          tone="rose"
        />
      </div>

      {/* Live inventory rollup */}
      <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/5 via-card/60 to-card/60 p-5 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Live fleet inventory</h3>
            <p className="text-[11px] text-muted-foreground">
              Total units across {CITIES.length} cities · auto-updates with every booking
            </p>
          </div>
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <InventoryStat
            label="Total units"
            value={fleetStats.totalUnits.toLocaleString()}
            tone="neutral"
          />
          <InventoryStat
            label="Booked"
            value={fleetStats.bookedUnits.toLocaleString()}
            tone="amber"
          />
          <InventoryStat
            label="Available"
            value={fleetStats.availableUnits.toLocaleString()}
            tone="emerald"
          />
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-400"
            style={{
              width: `${
                fleetStats.totalUnits > 0
                  ? Math.round((fleetStats.availableUnits / fleetStats.totalUnits) * 100)
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Two column lower grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Category breakdown */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Fleet by category</h3>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Spec model
            </span>
          </div>
          <div className="space-y-3">
            {categoryBreakdown.map(([cat, count]) => {
              const target = targetForCategory(cat)
              const pct = Math.min(100, Math.round((count / Math.max(1, target)) * 100))
              return (
                <div key={cat}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium uppercase tracking-wider text-foreground/90">
                      {cat}
                    </span>
                    <span className="text-muted-foreground">
                      <span className="text-foreground">{count}</span> / {target} target
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent activity preview */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Latest activity</h3>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </div>
          {bookings.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
              No bookings yet — when customers book, orders will land here.
            </p>
          ) : (
            <ul className="space-y-3">
              {[...bookings]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                )
                .slice(0, 5)
                .map((b) => (
                  <li key={b.id} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">
                          #{b.orderNumber}
                        </span>
                        <span className="truncate font-medium">{b.carName}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {b.userName} · {b.cityName} ·{" "}
                        {new Date(b.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </div>
                    <span className="text-xs font-semibold capitalize text-muted-foreground">
                      {b.status}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Customer pulse */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold">Customer pulse</h3>
            <p className="text-xs text-muted-foreground">
              Snapshot of active marketplace usage.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Pulse label="Avg. order value" value={
            stats.total
              ? `PKR ${Math.round(stats.revenue / Math.max(1, stats.total - stats.cancelled)).toLocaleString()}`
              : "—"
          } />
          <Pulse
            label="Cancellation rate"
            value={
              stats.total
                ? `${Math.round((stats.cancelled / stats.total) * 100)}%`
                : "0%"
            }
          />
          <Pulse
            label="Pending share"
            value={
              stats.total
                ? `${Math.round((stats.pending / stats.total) * 100)}%`
                : "0%"
            }
          />
        </div>
      </div>
    </div>
  )
}

function targetForCategory(cat: string): number {
  switch (cat) {
    case "Economy":
      return 25
    case "Sedan":
    case "SUV":
    case "Luxury":
      return 7 // ~20 across the three combined
    case "Exotic":
      return 5
    default:
      return 5
  }
}

function InventoryStat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "neutral" | "amber" | "emerald"
}) {
  const toneClass = {
    neutral: "border-border/60 bg-card",
    amber: "border-amber-500/30 bg-amber-500/5",
    emerald: "border-emerald-500/30 bg-emerald-500/5",
  }[tone]
  const valueClass = {
    neutral: "text-foreground",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
  }[tone]
  return (
    <div className={cn("rounded-xl border px-4 py-3", toneClass)}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-1 font-display text-2xl font-bold leading-none", valueClass)}>
        {value}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon,
  gold,
}: {
  label: string
  value: number | string
  hint?: string
  icon: React.ReactNode
  gold?: boolean
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 backdrop-blur",
        gold
          ? "border-primary/40 bg-primary/5"
          : "border-border/60 bg-card/60",
      )}
    >
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div
        className={cn(
          "mt-2 font-display text-3xl font-bold leading-none",
          gold && "text-gold-shimmer",
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
      {gold && (
        <span className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />
      )}
    </div>
  )
}

function StatusStat({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ReactNode
  tone: "amber" | "emerald" | "sky" | "rose"
}) {
  const toneClass = {
    amber: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
    sky: "border-sky-500/30 bg-sky-500/5 text-sky-400",
    rose: "border-destructive/30 bg-destructive/5 text-destructive",
  }[tone]
  return (
    <div className={cn("rounded-2xl border p-5 backdrop-blur", toneClass)}>
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em]">
        {icon}
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-bold leading-none">{value}</div>
    </div>
  )
}

function Pulse({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-xl font-bold">{value}</div>
    </div>
  )
}
