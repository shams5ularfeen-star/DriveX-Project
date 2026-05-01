"use client"

import { useMemo, useState } from "react"
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Hash,
  Search,
  UserCog,
  XCircle,
  Hourglass,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  useAllBookings,
  updateBookingStatus,
  assignDriver,
  cancelBooking,
  type Booking,
  type BookingStatus,
} from "@/lib/bookings-store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const STATUS_OPTIONS: { key: BookingStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
]

export function AdminBookings() {
  const { bookings } = useAllBookings()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [driverDialog, setDriverDialog] = useState<Booking | null>(null)
  const [driverInput, setDriverInput] = useState("")

  const filtered = useMemo(() => {
    return [...bookings]
      .filter((b) => (statusFilter === "all" ? true : b.status === statusFilter))
      .filter((b) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          String(b.orderNumber).includes(q) ||
          b.carName.toLowerCase().includes(q) ||
          b.userName.toLowerCase().includes(q) ||
          b.userEmail.toLowerCase().includes(q) ||
          b.cityName.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [bookings, search, statusFilter])

  const handleStatus = (b: Booking, status: BookingStatus) => {
    if (status === b.status) return
    if (status === "cancelled") {
      if (!confirm(`Cancel order #${b.orderNumber}? Availability will be restored.`)) return
      cancelBooking(b.id, "Cancelled by admin")
      toast.success(`Order #${b.orderNumber} cancelled`)
      return
    }
    updateBookingStatus(b.id, status, `Status updated by admin`)
    toast.success(`Order #${b.orderNumber} → ${status}`)
  }

  const handleAssignDriver = () => {
    if (!driverDialog) return
    if (!driverInput.trim()) {
      toast.error("Driver name cannot be empty")
      return
    }
    assignDriver(driverDialog.id, driverInput.trim())
    toast.success(`Driver assigned to order #${driverDialog.orderNumber}`)
    setDriverDialog(null)
    setDriverInput("")
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, car, user, or city..."
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as BookingStatus | "all")}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.key} value={s.key}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Booking list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {bookings.length === 0
              ? "No customer orders yet — when users book a car, the order will appear here."
              : "No orders match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingRow
              key={b.id}
              booking={b}
              expanded={expanded === b.id}
              onToggle={() => setExpanded(expanded === b.id ? null : b.id)}
              onStatus={(s) => handleStatus(b, s)}
              onAssignDriver={() => {
                setDriverDialog(b)
                setDriverInput(b.driverName || "")
              }}
            />
          ))}
        </div>
      )}

      {/* Driver dialog */}
      <Dialog open={!!driverDialog} onOpenChange={(o) => !o && setDriverDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Assign driver
            </DialogTitle>
            <DialogDescription>
              Assigning a driver will be visible on the customer&apos;s profile order details.
            </DialogDescription>
          </DialogHeader>
          {driverDialog && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs">
                <div>
                  Order:{" "}
                  <span className="font-mono font-bold text-primary">
                    #{driverDialog.orderNumber}
                  </span>
                </div>
                <div>Car: {driverDialog.carName}</div>
                <div>City: {driverDialog.cityName}</div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="drv">Driver name</Label>
                <Input
                  id="drv"
                  value={driverInput}
                  onChange={(e) => setDriverInput(e.target.value)}
                  placeholder="e.g. Asad Khan"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDriverDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleAssignDriver} className="bg-primary text-primary-foreground">
              Save driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BookingRow({
  booking,
  expanded,
  onToggle,
  onStatus,
  onAssignDriver,
}: {
  booking: Booking
  expanded: boolean
  onToggle: () => void
  onStatus: (s: BookingStatus) => void
  onAssignDriver: () => void
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:p-5">
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Hash className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold tracking-wider text-primary">
                #{booking.orderNumber}
              </span>
              <StatusPill status={booking.status} />
            </div>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
              <span className="truncate text-sm font-semibold">
                {booking.carName}
              </span>
              <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                Qty × {booking.quantity ?? 1}
              </span>
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {booking.userName} · {booking.userEmail} · {booking.cityName}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
          <span className="font-display text-lg font-bold text-primary">
            PKR {booking.total.toLocaleString()}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {new Date(booking.createdAt).toLocaleString("en-PK", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton
            tone="emerald"
            disabled={booking.status === "confirmed" || booking.status === "completed"}
            onClick={() => onStatus("confirmed")}
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            label="Approve"
          />
          <ActionButton
            tone="sky"
            disabled={booking.status === "completed" || booking.status === "cancelled"}
            onClick={() => onStatus("completed")}
            icon={<TrendingUp className="h-3.5 w-3.5" />}
            label="Complete"
          />
          <ActionButton
            tone="amber"
            disabled={booking.status === "pending"}
            onClick={() => onStatus("pending")}
            icon={<Hourglass className="h-3.5 w-3.5" />}
            label="Mark pending"
          />
          <ActionButton
            tone="rose"
            disabled={booking.status === "cancelled"}
            onClick={() => onStatus("cancelled")}
            icon={<XCircle className="h-3.5 w-3.5" />}
            label="Reject"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={onAssignDriver}
            className="h-8 gap-1 border-border/60 bg-transparent text-xs"
          >
            <UserCog className="h-3.5 w-3.5" />
            {booking.driverName ? "Reassign" : "Driver"}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggle}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border/60 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <DetailGroup title="Customer">
              <DetailRow label="Name" value={booking.userName} />
              <DetailRow label="Email" value={booking.userEmail} />
              <DetailRow label="Phone" value={booking.userPhone || "—"} />
              <DetailRow label="CNIC" value={booking.userCnic || "—"} />
            </DetailGroup>
            <DetailGroup title="Trip">
              <DetailRow label="Car" value={booking.carName} />
              <DetailRow label="Cars booked" value={`${booking.quantity ?? 1}`} />
              <DetailRow label="Category" value={booking.category} />
              <DetailRow label="City" value={booking.cityName} />
              <DetailRow
                label="Pickup → Return"
                value={`${booking.pickupDate} → ${booking.returnDate}`}
              />
              <DetailRow label="Duration" value={`${booking.days} day${booking.days === 1 ? "" : "s"}`} />
            </DetailGroup>
            <DetailGroup title="Payment">
              <DetailRow label="Method" value={paymentLabel(booking.paymentMethod)} />
              <DetailRow
                label="Daily rate"
                value={`PKR ${booking.pricePerDay.toLocaleString()}`}
              />
              <DetailRow
                label="Subtotal"
                value={`PKR ${booking.subtotal.toLocaleString()}`}
              />
              <DetailRow
                label="Discount"
                value={
                  booking.discountPct > 0
                    ? `${booking.discountPct}% (− PKR ${booking.discountAmount.toLocaleString()})`
                    : "—"
                }
              />
              <DetailRow
                label="Total"
                value={`PKR ${booking.total.toLocaleString()}`}
                strong
              />
              <DetailRow label="Driver" value={booking.driverName || "Unassigned"} />
            </DetailGroup>
          </div>
          <div className="mt-5">
            <h4 className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Status history
            </h4>
            <ol className="space-y-2 text-sm">
              {booking.history.map((h, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2"
                >
                  <StatusPill status={h.status} compact />
                  <span className="flex-1 text-xs text-muted-foreground">
                    {h.note || "—"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(h.at).toLocaleString("en-PK", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionButton({
  tone,
  disabled,
  onClick,
  icon,
  label,
}: {
  tone: "emerald" | "sky" | "rose" | "amber"
  disabled?: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  const toneClasses = {
    emerald:
      "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60",
    sky: "border-sky-500/40 text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/60",
    rose: "border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60",
    amber: "border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/60",
  }[tone]
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md border bg-transparent px-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        toneClasses,
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function StatusPill({ status, compact }: { status: BookingStatus; compact?: boolean }) {
  const map: Record<BookingStatus, string> = {
    pending: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    confirmed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    completed: "border-sky-500/40 bg-sky-500/10 text-sky-400",
    cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-[0.16em]",
        map[status],
        compact ? "px-2 py-0 text-[9px]" : "px-2.5 py-0.5 text-[10px]",
      )}
    >
      {status}
    </span>
  )
}

function DetailGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-right font-medium", strong && "text-primary")}>
        {value}
      </span>
    </div>
  )
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
