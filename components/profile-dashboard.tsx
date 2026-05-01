"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Car as CarIcon,
  CreditCard,
  Hash,
  IdCard,
  LogOut,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
  Mail,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useAuth, updateUserProfile, logoutUser } from "@/lib/auth-store"
import { useBookings, cancelBooking, type Booking } from "@/lib/bookings-store"
import { computeMembership } from "@/lib/membership"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function ProfileDashboard() {
  const router = useRouter()
  const { user, hydrated, isAuthenticated } = useAuth()
  const bookings = useBookings(user?.id)

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login?redirect=/profile")
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated || !user) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-6 w-6 text-primary" />
      </section>
    )
  }

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const membership = computeMembership(bookings)

  return (
    <section className="px-4 py-10 md:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-primary">
              My DriveX
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">
              Welcome back, <span className="text-gold-gradient">{user.name.split(" ")[0]}</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your profile, review orders, and track your loyalty tier.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              logoutUser()
              toast.success("Signed out")
              router.push("/")
            }}
            className="self-start gap-2 border-border/60 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>

        {/* Activity panel */}
        <div className="grid gap-4 md:grid-cols-4">
          <ActivityCard
            label="Total bookings"
            value={membership.totalBookings.toString()}
            icon={<CarIcon className="h-4 w-4" />}
          />
          <ActivityCard
            label="Total spent"
            value={`PKR ${Math.round(membership.totalSpent).toLocaleString()}`}
            icon={<Wallet className="h-4 w-4" />}
          />
          <ActivityCard
            label="Best discount unlocked"
            value={`${membership.bestDiscountPct}%`}
            icon={<Sparkles className="h-4 w-4" />}
          />
          <div className="glass relative overflow-hidden rounded-2xl border border-primary/30 p-5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Membership tier
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-gold-shimmer">
                {membership.tier}
              </span>
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            {membership.nextTier && membership.nextTierIn !== null && membership.nextTierIn > 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {membership.nextTierIn} more booking
                {membership.nextTierIn === 1 ? "" : "s"} to {membership.nextTier}
              </p>
            ) : (
              <p className="mt-2 text-xs text-primary">Top tier reached</p>
            )}
            <span className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Profile sidebar */}
          <ProfileSidebar />

          {/* Order history */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Order history</h2>
              <Button asChild variant="outline" className="border-border/60 bg-transparent">
                <Link href="/cars" className="gap-1">
                  Book another car <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {sortedBookings.length === 0 ? (
              <EmptyOrders />
            ) : (
              <div className="space-y-3">
                {sortedBookings.map((b) => (
                  <OrderCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---- Profile sidebar ---------------------------------------------------

function ProfileSidebar() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    cnic: user?.cnic || "",
  })

  // Re-sync the form whenever user changes
  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name,
      phone: user.phone || "",
      cnic: user.cnic || "",
    })
  }, [user])

  if (!user) return null

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name cannot be empty")
      return
    }
    if (form.cnic && !/^\d{5}-?\d{7}-?\d{1}$/.test(form.cnic.replace(/\s/g, ""))) {
      toast.error("CNIC must be in format 12345-1234567-1")
      return
    }
    const result = updateUserProfile(user.id, {
      name: form.name,
      phone: form.phone,
      cnic: form.cnic,
    })
    if (result.ok) {
      toast.success("Profile updated")
      setEditing(false)
    } else {
      toast.error(result.error)
    }
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="glass gold-glow rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 ring-1 ring-primary/30 font-display text-lg font-bold text-primary">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">{user.name}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
          {!editing ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditing(true)}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        {!editing ? (
          <div className="mt-5 space-y-3 text-sm">
            <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={user.email} />
            <InfoRow
              icon={<Phone className="h-3.5 w-3.5" />}
              label="Phone"
              value={user.phone || "Not added"}
              muted={!user.phone}
            />
            <InfoRow
              icon={<IdCard className="h-3.5 w-3.5" />}
              label="CNIC"
              value={user.cnic || "Not added"}
              muted={!user.cnic}
            />
            <InfoRow
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="Default city"
              value={user.city || "Not set"}
              muted={!user.city}
            />
            <InfoRow
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              label="Member since"
              value={new Date(user.createdAt).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pf-name">Full name</Label>
              <Input
                id="pf-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-phone">Phone</Label>
              <Input
                id="pf-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+92 300 0000000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-cnic">CNIC</Label>
              <Input
                id="pf-cnic"
                value={form.cnic}
                onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                placeholder="12345-1234567-1"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleSave}
                className="flex-1 gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-4 w-4" /> Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                className="border-border/60 bg-transparent"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

function InfoRow({
  icon,
  label,
  value,
  muted,
}: {
  icon: React.ReactNode
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>{icon}</span>
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <span
        className={cn(
          "max-w-[55%] truncate text-right text-sm font-medium",
          muted && "text-muted-foreground/70 italic",
        )}
      >
        {value}
      </span>
    </div>
  )
}

// ---- Activity card ------------------------------------------------------

function ActivityCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="mt-2 font-display text-2xl font-bold leading-none">{value}</div>
    </div>
  )
}

// ---- Order history -----------------------------------------------------

function EmptyOrders() {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-10 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary/40 text-muted-foreground">
        <CarIcon className="h-5 w-5" />
      </span>
      <h3 className="mt-3 font-display text-xl font-semibold">No bookings yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Reserve your first ride and start unlocking loyalty discounts.
      </p>
      <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href="/cars">Browse the fleet</Link>
      </Button>
    </div>
  )
}

function OrderCard({ booking }: { booking: Booking }) {
  const [expanded, setExpanded] = useState(false)
  const canCancel = booking.status === "pending" || booking.status === "confirmed"

  const handleCancel = () => {
    if (!confirm(`Cancel order #${booking.orderNumber}? Availability will be restored.`)) return
    cancelBooking(booking.id, "Cancelled by user")
    toast.success(`Order #${booking.orderNumber} cancelled`)
  }

  const created = new Date(booking.createdAt)
  const pickup = new Date(booking.pickupDate + "T00:00:00")
  const ret = new Date(booking.returnDate + "T00:00:00")

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-primary/40">
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Hash className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-wider text-primary">
                #{booking.orderNumber}
              </span>
              <StatusPill status={booking.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="truncate font-display text-base font-semibold">
                {booking.carName}
              </span>
              {(booking.quantity ?? 1) > 1 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  × {booking.quantity}
                </span>
              )}
            </div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {booking.category} · {booking.cityName} · {booking.days} day
              {booking.days === 1 ? "" : "s"}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-display text-xl font-bold text-primary">
            PKR {booking.total.toLocaleString()}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {created.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded((v) => !v)}
          className="border-border/60 bg-transparent"
        >
          {expanded ? "Hide" : "Details"}
        </Button>
      </div>

      {expanded && (
        <div className="border-t border-border/60 p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Trip + price */}
            <div className="space-y-3">
              <DetailRow
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Pickup city"
                value={booking.cityName}
              />
              <DetailRow
                icon={<CalendarDays className="h-3.5 w-3.5" />}
                label="Pickup → Return"
                value={`${formatDate(pickup)} → ${formatDate(ret)}`}
              />
              <DetailRow
                icon={<CarIcon className="h-3.5 w-3.5" />}
                label="Cars × daily rate"
                value={`${booking.quantity ?? 1} × PKR ${booking.pricePerDay.toLocaleString()}`}
              />
              <DetailRow
                icon={<Sparkles className="h-3.5 w-3.5" />}
                label="Discount"
                value={
                  booking.discountPct > 0
                    ? `${booking.discountPct}% (− PKR ${booking.discountAmount.toLocaleString()})`
                    : "—"
                }
              />
              <DetailRow
                icon={<CreditCard className="h-3.5 w-3.5" />}
                label="Payment"
                value={paymentLabel(booking.paymentMethod)}
              />
              {booking.driverName && (
                <DetailRow
                  icon={<BadgeCheck className="h-3.5 w-3.5" />}
                  label="Assigned driver"
                  value={booking.driverName}
                />
              )}
            </div>

            {/* Timeline */}
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <History className="h-3.5 w-3.5" />
                Order timeline
              </div>
              <ol className="relative space-y-4 border-l border-border/60 pl-5">
                {booking.history.map((h, i) => (
                  <li key={i} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full ring-2 ring-background",
                        statusDotClass(h.status),
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-background" />
                    </span>
                    <div className="text-sm font-medium capitalize">{h.status}</div>
                    {h.note && (
                      <div className="text-xs text-muted-foreground">{h.note}</div>
                    )}
                    <div className="text-[11px] text-muted-foreground/80">
                      {new Date(h.at).toLocaleString("en-PK", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {canCancel && (
            <div className="mt-5 flex justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-destructive/40 bg-transparent text-destructive hover:bg-destructive/10"
              >
                Cancel order
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function StatusPill({ status }: { status: Booking["status"] }) {
  const map: Record<Booking["status"], string> = {
    pending: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    confirmed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    completed: "border-sky-500/40 bg-sky-500/10 text-sky-400",
    cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
        map[status],
      )}
    >
      {status}
    </span>
  )
}

function statusDotClass(status: Booking["status"]) {
  switch (status) {
    case "pending":
      return "bg-amber-400"
    case "confirmed":
      return "bg-emerald-400"
    case "completed":
      return "bg-sky-400"
    case "cancelled":
      return "bg-destructive"
  }
}

function paymentLabel(p: Booking["paymentMethod"]) {
  switch (p) {
    case "card":
      return "Credit / Debit card"
    case "cash":
      return "Pay at pickup"
    case "jazzcash":
      return "JazzCash"
    case "easypaisa":
      return "EasyPaisa"
    case "wallet":
      return "Mobile wallet"
  }
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })
}
