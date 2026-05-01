"use client"

import { useMemo, useState } from "react"
import {
  BadgeCheck,
  CalendarDays,
  Layers,
  Package,
  Percent,
  RotateCcw,
  Save,
  Sparkles,
  Tag,
  Ticket,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import {
  type BulkTier,
  type Campaign,
  type DiscountSettings,
  type LoyaltyTier,
  DEFAULT_DISCOUNT_SETTINGS,
  resetDiscountSettings,
  updateDiscountSettings,
  useDiscountSettings,
} from "@/lib/discount-settings"
import { usePromos } from "@/lib/promos-store"
import { CATEGORIES } from "@/lib/cars-data"
import { AdminPromos } from "@/components/admin/admin-promos"
import { AdminFees } from "@/components/admin/admin-fees"

export function AdminDiscounts() {
  const live = useDiscountSettings()
  const promos = usePromos()
  const [draft, setDraft] = useState<DiscountSettings>(live)

  // ---- Promo analytics ----
  const promoStats = useMemo(() => {
    const total = promos.length
    const today = new Date().toISOString().slice(0, 10)
    const active = promos.filter(
      (p) =>
        p.active &&
        (!p.expiry || p.expiry >= today) &&
        (!p.usageLimit || p.usageCount < p.usageLimit),
    ).length
    const expired = promos.filter((p) => p.expiry && p.expiry < today).length
    const totalUsage = promos.reduce((s, p) => s + p.usageCount, 0)
    return { total, active, expired, totalUsage }
  }, [promos])

  const handleSave = () => {
    updateDiscountSettings(draft)
    toast.success("Discount rules saved", {
      description: "Changes are live across the platform.",
    })
  }

  const handleReset = () => {
    resetDiscountSettings()
    setDraft(DEFAULT_DISCOUNT_SETTINGS)
    toast.success("Reset to defaults")
  }

  // ---- Tier helpers (arrays) ----
  const setLoyaltyPct = (idx: number, pct: number) => {
    const next = [...draft.loyaltyTiers]
    next[idx] = { ...next[idx], pct }
    setDraft({ ...draft, loyaltyTiers: next })
  }
  const setBulkPct = (idx: number, pct: number) => {
    const next = [...draft.bulkTiers]
    next[idx] = { ...next[idx], pct }
    setDraft({ ...draft, bulkTiers: next })
  }
  const setCategoryCap = (key: string, value: number) =>
    setDraft({
      ...draft,
      categoryCaps: { ...draft.categoryCaps, [key]: value },
    })
  const setCampaign = (idx: number, patch: Partial<Campaign>) => {
    const next = [...draft.campaigns]
    next[idx] = { ...next[idx], ...patch }
    setDraft({ ...draft, campaigns: next })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Discount Engine
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">
            Smart pricing controls
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Tune the multi-layer discount engine and manage promo codes.
            Changes propagate live to every checkout instantly.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 border-border/60 bg-transparent"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-3.5 w-3.5" /> Save changes
          </Button>
        </div>
      </div>

      {/* Promo analytics strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PromoStat
          icon={<Ticket className="h-4 w-4" />}
          label="Total promo codes"
          value={promoStats.total}
        />
        <PromoStat
          icon={<BadgeCheck className="h-4 w-4" />}
          label="Active"
          value={promoStats.active}
          tone="emerald"
        />
        <PromoStat
          icon={<CalendarDays className="h-4 w-4" />}
          label="Expired"
          value={promoStats.expired}
          tone="rose"
        />
        <PromoStat
          icon={<TrendingUp className="h-4 w-4" />}
          label="Total redemptions"
          value={promoStats.totalUsage}
          tone="amber"
        />
      </div>

      {/* Master toggles */}
      <Card title="Master switches" icon={<Layers className="h-4 w-4" />}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ToggleRow
            label="Loyalty discount"
            hint="Auto rewards based on prior bookings"
            checked={draft.loyaltyEnabled}
            onChange={(v) => setDraft({ ...draft, loyaltyEnabled: v })}
          />
          <ToggleRow
            label="Bulk-quantity discount"
            hint="More cars on a single order = bigger savings"
            checked={draft.bulkEnabled}
            onChange={(v) => setDraft({ ...draft, bulkEnabled: v })}
          />
          <ToggleRow
            label="Category bonus"
            hint="Different rules per car class"
            checked={draft.categoryEnabled}
            onChange={(v) => setDraft({ ...draft, categoryEnabled: v })}
          />
          <ToggleRow
            label="Seasonal campaigns"
            hint="Weekend, Eid, night-booking offers"
            checked={draft.seasonalEnabled}
            onChange={(v) => setDraft({ ...draft, seasonalEnabled: v })}
          />
        </div>
      </Card>

      {/* Loyalty tiers */}
      <Card
        title="Loyalty discount tiers"
        icon={<BadgeCheck className="h-4 w-4" />}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {draft.loyaltyTiers.map((t: LoyaltyTier, idx) => (
            <PercentField
              key={idx}
              label={`${t.minBookings}+ bookings`}
              value={t.pct}
              onChange={(v) => setLoyaltyPct(idx, v)}
            />
          ))}
        </div>
      </Card>

      {/* Bulk tiers */}
      <Card title="Bulk-quantity tiers" icon={<Package className="h-4 w-4" />}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {draft.bulkTiers.map((t: BulkTier, idx) => (
            <PercentField
              key={idx}
              label={`${t.minQty}+ cars`}
              value={t.pct}
              onChange={(v) => setBulkPct(idx, v)}
            />
          ))}
        </div>
      </Card>

      {/* Category caps */}
      <Card title="Category caps" icon={<Tag className="h-4 w-4" />}>
        <p className="mb-3 text-[11px] text-muted-foreground">
          Maximum discount allowance for each car class. Higher caps =
          more flexibility for that category.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <PercentField
              key={cat}
              label={cat}
              value={draft.categoryCaps[cat] ?? 0}
              onChange={(v) => setCategoryCap(cat, v)}
            />
          ))}
        </div>
      </Card>

      {/* Campaigns */}
      <Card title="Seasonal campaigns" icon={<Sparkles className="h-4 w-4" />}>
        <div className="space-y-3">
          {draft.campaigns.map((c, idx) => (
            <div
              key={c.id}
              className="grid items-center gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3 sm:grid-cols-[auto_1fr_140px_140px]"
            >
              <Switch
                checked={c.enabled}
                onCheckedChange={(v) => setCampaign(idx, { enabled: v })}
              />
              <div>
                <Input
                  value={c.label}
                  onChange={(e) =>
                    setCampaign(idx, { label: e.target.value })
                  }
                  className="h-9 font-semibold"
                />
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Trigger:{" "}
                  <span className="text-primary">{c.trigger}</span>
                </p>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={c.pct}
                  onChange={(e) =>
                    setCampaign(idx, {
                      pct: Math.max(
                        0,
                        Math.min(50, Number(e.target.value) || 0),
                      ),
                    })
                  }
                  className="h-9 pr-8"
                />
                <Percent className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-center text-[10px] font-bold uppercase tracking-wider",
                  c.enabled
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-border/60 bg-secondary/40 text-muted-foreground",
                )}
              >
                {c.enabled ? "Live" : "Paused"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Stacking cap */}
      <Card title="Stacking rules" icon={<Layers className="h-4 w-4" />}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Max automatic layers (excl. promo)
            </Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={draft.maxAutoLayers}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  maxAutoLayers: Math.max(
                    1,
                    Math.min(5, Number(e.target.value) || 1),
                  ),
                })
              }
              className="mt-1.5"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              The engine always picks the {draft.maxAutoLayers} best automatic
              discounts and skips the rest to prevent abuse.
            </p>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Max total discount cap
            </Label>
            <div className="relative mt-1.5">
              <Input
                type="number"
                min={0}
                max={90}
                value={draft.maxTotalPct}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    maxTotalPct: Math.max(
                      0,
                      Math.min(90, Number(e.target.value) || 0),
                    ),
                  })
                }
                className="pr-8"
              />
              <Percent className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Combined auto + promo discount can never exceed this percentage.
            </p>
          </div>
        </div>
      </Card>

      {/* Promo CRUD inline */}
      <AdminPromos />

      {/* Service fees & demand-based uplifts */}
      <AdminFees />
    </div>
  )
}

/* ============================== UI helpers ============================== */

function Card({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
      <header className="mb-4 flex items-center gap-2 text-sm">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          {icon}
        </span>
        <h3 className="font-display text-base font-semibold">{title}</h3>
      </header>
      {children}
    </section>
  )
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 transition-colors hover:border-primary/30">
      <div>
        <div className="text-sm font-semibold leading-tight">{label}</div>
        {hint && (
          <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

function PercentField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="relative mt-1.5">
        <Input
          type="number"
          min={0}
          max={90}
          value={value}
          onChange={(e) =>
            onChange(Math.max(0, Math.min(90, Number(e.target.value) || 0)))
          }
          className="pr-8"
        />
        <Percent className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {hint && <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

function PromoStat({
  icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone?: "neutral" | "emerald" | "rose" | "amber"
}) {
  const toneClass = {
    neutral: "border-border/60 bg-card text-foreground",
    emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
    rose: "border-rose-500/30 bg-rose-500/5 text-rose-300",
    amber: "border-amber-500/30 bg-amber-500/5 text-amber-300",
  }[tone]
  return (
    <div className={cn("rounded-2xl border p-4", toneClass)}>
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-bold leading-none">
        {value}
      </div>
    </div>
  )
}
