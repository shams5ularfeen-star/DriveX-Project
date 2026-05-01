"use client"

import { useMemo, useState } from "react"
import {
  Pencil,
  Plus,
  Power,
  PowerOff,
  Search,
  Ticket,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import {
  addPromo,
  deletePromo,
  togglePromoActive,
  updatePromo,
  usePromos,
  type PromoCode,
  type PromoType,
} from "@/lib/promos-store"
import { CATEGORIES } from "@/lib/cars-data"

interface DraftPromo {
  id?: string
  code: string
  type: PromoType
  value: number
  minOrder?: number
  usageLimit?: number
  expiry?: string
  applicableCategory?: string
  newUsersOnly?: boolean
  active: boolean
  description?: string
}

const EMPTY: DraftPromo = {
  code: "",
  type: "percentage",
  value: 10,
  minOrder: 0,
  usageLimit: undefined,
  expiry: undefined,
  applicableCategory: undefined,
  newUsersOnly: false,
  active: true,
  description: "",
}

const ANY_CATEGORY = "__any__"

export function AdminPromos() {
  const promos = usePromos()
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DraftPromo>(EMPTY)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return promos
    return promos.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    )
  }, [promos, search])

  const openNew = () => {
    setDraft({ ...EMPTY })
    setOpen(true)
  }

  const openEdit = (p: PromoCode) => {
    setDraft({
      id: p.id,
      code: p.code,
      type: p.type,
      value: p.value,
      minOrder: p.minOrder ?? 0,
      usageLimit: p.usageLimit,
      expiry: p.expiry,
      applicableCategory: p.applicableCategory,
      newUsersOnly: p.newUsersOnly,
      active: p.active,
      description: p.description,
    })
    setOpen(true)
  }

  const handleSave = () => {
    const code = draft.code.trim().toUpperCase()
    if (!code) return toast.error("Code is required")
    if (draft.value <= 0) return toast.error("Discount value must be positive")
    if (draft.type === "percentage" && draft.value > 90)
      return toast.error("Percent cannot exceed 90%")

    const payload = {
      code,
      type: draft.type,
      value: draft.value,
      minOrder: draft.minOrder && draft.minOrder > 0 ? draft.minOrder : undefined,
      usageLimit:
        draft.usageLimit && draft.usageLimit > 0 ? draft.usageLimit : undefined,
      expiry: draft.expiry || undefined,
      applicableCategory: draft.applicableCategory || undefined,
      newUsersOnly: draft.newUsersOnly,
      active: draft.active,
      description: draft.description,
    }

    if (draft.id) {
      updatePromo(draft.id, payload)
      toast.success("Promo updated", { description: code })
    } else {
      addPromo(payload)
      toast.success("Promo created", { description: code })
    }
    setOpen(false)
  }

  const handleDelete = (p: PromoCode) => {
    if (!confirm(`Delete promo ${p.code}? This cannot be undone.`)) return
    deletePromo(p.id)
    toast.success(`Promo ${p.code} deleted`)
  }

  const handleToggleActive = (p: PromoCode) => {
    togglePromoActive(p.id)
    toast.success(`${p.code} ${!p.active ? "activated" : "deactivated"}`)
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Ticket className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-base font-semibold">
              Promo codes
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Create, edit, and track every redemption.
            </p>
          </div>
        </div>
        <div className="flex flex-1 gap-2 md:max-w-md">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search codes..."
              className="pl-9"
            />
          </div>
          <Button
            onClick={openNew}
            size="sm"
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </Button>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-border/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">
                  Scope
                </th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">
                  Constraints
                </th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">
                  Expires
                </th>
                <th className="px-4 py-3 font-medium">Usage</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    No promo codes yet. Create one to get started.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const today = new Date().toISOString().slice(0, 10)
                  const expired = p.expiry ? p.expiry < today : false
                  const limitHit =
                    p.usageLimit !== undefined && p.usageCount >= p.usageLimit
                  const live = p.active && !expired && !limitHit
                  return (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-secondary/20"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-bold tracking-wider text-primary">
                          {p.code}
                        </span>
                        {p.description && (
                          <div className="mt-0.5 max-w-[18rem] truncate text-[10px] text-muted-foreground">
                            {p.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {p.type === "percentage"
                          ? `${p.value}%`
                          : `PKR ${p.value.toLocaleString()}`}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                        {p.applicableCategory
                          ? `${p.applicableCategory} only`
                          : "All categories"}
                        {p.newUsersOnly && (
                          <span className="ml-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                            New
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                        {(p.minOrder ?? 0) > 0 && (
                          <div>Min PKR {p.minOrder?.toLocaleString()}</div>
                        )}
                        {p.usageLimit && <div>Limit {p.usageLimit}</div>}
                        {!p.minOrder && !p.usageLimit && "—"}
                      </td>
                      <td className="px-4 py-3 text-xs hidden lg:table-cell">
                        {p.expiry ? (
                          <span
                            className={
                              expired
                                ? "text-rose-400"
                                : "text-muted-foreground"
                            }
                          >
                            {p.expiry}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-mono">
                          {p.usageCount}
                          {p.usageLimit ? ` / ${p.usageLimit}` : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill
                          live={live}
                          active={p.active}
                          expired={expired}
                          limitHit={limitHit}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(p)}
                            title={p.active ? "Deactivate" : "Activate"}
                            className="h-8 w-8 p-0"
                          >
                            {p.active ? (
                              <PowerOff className="h-4 w-4 text-amber-400" />
                            ) : (
                              <Power className="h-4 w-4 text-emerald-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(p)}
                            title="Edit"
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(p)}
                            title="Delete"
                            className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {draft.id ? "Edit promo code" : "New promo code"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Code
              </Label>
              <Input
                value={draft.code}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    code: e.target.value
                      .toUpperCase()
                      .replace(/\s+/g, "")
                      .slice(0, 24),
                  })
                }
                placeholder="WELCOME20"
                className="mt-1.5 font-mono uppercase tracking-wider"
              />
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Type
              </Label>
              <Select
                value={draft.type}
                onValueChange={(v) =>
                  setDraft({ ...draft, type: v as PromoType })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed (PKR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Value{" "}
                <span className="text-foreground">
                  ({draft.type === "percentage" ? "%" : "PKR"})
                </span>
              </Label>
              <Input
                type="number"
                min={0}
                value={draft.value}
                onChange={(e) =>
                  setDraft({ ...draft, value: Number(e.target.value) || 0 })
                }
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Applies to
              </Label>
              <Select
                value={draft.applicableCategory ?? ANY_CATEGORY}
                onValueChange={(v) =>
                  setDraft({
                    ...draft,
                    applicableCategory: v === ANY_CATEGORY ? undefined : v,
                  })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY_CATEGORY}>All categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Minimum order (PKR)
              </Label>
              <Input
                type="number"
                min={0}
                value={draft.minOrder ?? 0}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    minOrder: Number(e.target.value) || 0,
                  })
                }
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Usage limit (blank = unlimited)
              </Label>
              <Input
                type="number"
                min={0}
                value={draft.usageLimit ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    usageLimit: e.target.value
                      ? Number(e.target.value) || 0
                      : undefined,
                  })
                }
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Expiry date (blank = never)
              </Label>
              <Input
                type="date"
                value={draft.expiry ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    expiry: e.target.value || undefined,
                  })
                }
                className="mt-1.5"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Description (internal)
              </Label>
              <Input
                value={draft.description ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
                placeholder="Eid weekend special — Karachi launch"
                className="mt-1.5"
              />
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 px-4 py-3">
              <Switch
                checked={!!draft.newUsersOnly}
                onCheckedChange={(v) =>
                  setDraft({ ...draft, newUsersOnly: v })
                }
              />
              <div>
                <div className="text-sm font-semibold leading-tight">
                  New users only
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Reject if customer has prior bookings.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 px-4 py-3">
              <Switch
                checked={draft.active}
                onCheckedChange={(v) => setDraft({ ...draft, active: v })}
              />
              <div>
                <div className="text-sm font-semibold leading-tight">
                  Active
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Inactive codes can&apos;t be redeemed.
                </div>
              </div>
            </label>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border/60 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {draft.id ? "Update promo" : "Create promo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function StatusPill({
  live,
  active,
  expired,
  limitHit,
}: {
  live: boolean
  active: boolean
  expired: boolean
  limitHit: boolean
}) {
  let tone: "emerald" | "amber" | "rose" = "emerald"
  let label = "Live"
  if (!active) {
    tone = "amber"
    label = "Inactive"
  } else if (expired) {
    tone = "rose"
    label = "Expired"
  } else if (limitHit) {
    tone = "rose"
    label = "Used up"
  } else if (!live) {
    tone = "rose"
    label = "Off"
  }
  const toneClass = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  }[tone]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        toneClass,
      )}
    >
      {label}
    </span>
  )
}
