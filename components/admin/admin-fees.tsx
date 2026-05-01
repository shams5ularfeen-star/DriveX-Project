"use client"

import { useMemo, useState } from "react"
import {
  Building2,
  CalendarDays,
  Globe2,
  Info,
  Layers,
  Plus,
  Power,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import {
  type FeeAdjustment,
  type FeeSettings,
  type SpecialDate,
  DEFAULT_FEE_SETTINGS,
  resetFeeSettings,
  updateFeeSettings,
  useFeeSettings,
} from "@/lib/fees-store"
import { CATEGORIES } from "@/lib/cars-data"
import { CITIES as CITY_OBJECTS } from "@/lib/city-store"

/**
 * Admin control panel for service fees, weekend uplifts, holidays,
 * and city/category-specific additive offsets. All values persist to
 * localStorage and propagate live to checkout via useFeeSettings.
 */
export function AdminFees() {
  const live = useFeeSettings()
  const [draft, setDraft] = useState<FeeSettings>(live)

  // Order admin-friendly: sorted by date ascending so the next holiday is at top
  const sortedDates = useMemo(
    () => [...draft.specialDates].sort((a, b) => a.date.localeCompare(b.date)),
    [draft.specialDates],
  )

  const handleSave = () => {
    updateFeeSettings(draft)
    toast.success("Fee rules saved", {
      description: "Changes are live across all new checkouts.",
    })
  }

  const handleReset = () => {
    resetFeeSettings()
    setDraft(DEFAULT_FEE_SETTINGS)
    toast.success("Reset to default fees")
  }

  // ---- Special date helpers ----
  const addSpecialDate = () => {
    const today = new Date().toISOString().slice(0, 10)
    setDraft({
      ...draft,
      specialDates: [
        ...draft.specialDates,
        { date: today, label: "New Holiday" },
      ],
    })
  }
  const updateSpecialDate = (idx: number, patch: Partial<SpecialDate>) => {
    const next = [...draft.specialDates]
    next[idx] = { ...next[idx], ...patch }
    setDraft({ ...draft, specialDates: next })
  }
  const removeSpecialDate = (idx: number) => {
    setDraft({
      ...draft,
      specialDates: draft.specialDates.filter((_, i) => i !== idx),
    })
  }

  // ---- Adjustment helpers (category & city) ----
  const setAdjustment = (
    field: "categoryAdjustments" | "cityAdjustments",
    key: string,
    pct: number | null,
  ) => {
    const list = draft[field] as FeeAdjustment[]
    const filtered = list.filter(
      (a) => a.key.toLowerCase() !== key.toLowerCase(),
    )
    const next =
      pct === null || Number.isNaN(pct) || pct === 0
        ? filtered
        : [...filtered, { key, pct }]
    setDraft({ ...draft, [field]: next })
  }
  const lookupAdjustment = (
    field: "categoryAdjustments" | "cityAdjustments",
    key: string,
  ): number | "" => {
    const list = draft[field] as FeeAdjustment[]
    const found = list.find((a) => a.key.toLowerCase() === key.toLowerCase())
    return found ? found.pct : ""
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
            <Wallet className="h-3.5 w-3.5" /> Service Fees & Uplifts
          </span>
          <h3 className="mt-1 font-display text-xl font-bold md:text-2xl">
            Dynamic pricing & demand uplifts
          </h3>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Fees are layered on top of the base price (after discounts) and
            shown transparently in every checkout breakdown. Base price is
            never modified.
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
            <Save className="h-3.5 w-3.5" /> Save fees
          </Button>
        </div>
      </div>

      {/* Master kill-switch */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border p-4 transition-colors",
          draft.enabled
            ? "border-primary/30 bg-primary/5"
            : "border-rose-500/30 bg-rose-500/5",
        )}
      >
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-background/40 ring-1 ring-border/40">
          <Power
            className={cn(
              "h-4 w-4",
              draft.enabled ? "text-primary" : "text-rose-400",
            )}
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-semibold">
            Master fees switch
          </div>
          <p className="text-[11px] text-muted-foreground">
            Disable to bypass every fee on every booking — service, weekend &
            holiday all stop charging.
          </p>
        </div>
        <Switch
          checked={draft.enabled}
          onCheckedChange={(v) => setDraft({ ...draft, enabled: v })}
          aria-label="Toggle fees system"
        />
      </div>

      {/* ===== Service Fee ===== */}
      <SettingsCard
        icon={<ShieldCheck className="h-4 w-4" />}
        title="Service Fee"
        subtitle="Platform fee covering insurance, support and roadside assistance"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Service fee (%)
            </Label>
            <Input
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={draft.serviceFeePct}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  serviceFeePct: Math.max(0, Number(e.target.value) || 0),
                })
              }
              disabled={!draft.serviceFeeEnabled || !draft.enabled}
              className="h-9 max-w-[160px]"
            />
            <p className="text-[11px] text-muted-foreground">
              Applied to every booking on the discounted subtotal.
            </p>
          </div>
          <ToggleRow
            label="Enable service fee"
            checked={draft.serviceFeeEnabled}
            disabled={!draft.enabled}
            onChange={(v) => setDraft({ ...draft, serviceFeeEnabled: v })}
          />
        </div>
      </SettingsCard>

      {/* ===== Weekend Uplift ===== */}
      <SettingsCard
        icon={<TrendingUp className="h-4 w-4" />}
        title="Weekend Uplift"
        subtitle="Per-day surcharge for Saturday & Sunday rentals only"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Weekend uplift (%)
            </Label>
            <Input
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={draft.weekendPct}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  weekendPct: Math.max(0, Number(e.target.value) || 0),
                })
              }
              disabled={!draft.weekendEnabled || !draft.enabled}
              className="h-9 max-w-[160px]"
            />
            <p className="text-[11px] text-muted-foreground">
              Only the weekend days within the rental window are charged —
              not the full booking.
            </p>
          </div>
          <ToggleRow
            label="Enable weekend uplift"
            checked={draft.weekendEnabled}
            disabled={!draft.enabled}
            onChange={(v) => setDraft({ ...draft, weekendEnabled: v })}
          />
        </div>
      </SettingsCard>

      {/* ===== Holiday Uplift ===== */}
      <SettingsCard
        icon={<Sparkles className="h-4 w-4" />}
        title="Holiday & Event Uplifts"
        subtitle="Special dates (Eid, national holidays, peak seasons)"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Default holiday uplift (%)
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={draft.holidayPct}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    holidayPct: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                disabled={!draft.holidayEnabled || !draft.enabled}
                className="h-9 max-w-[160px]"
              />
              <p className="text-[11px] text-muted-foreground">
                Used when a date below has no custom percentage.
              </p>
            </div>
            <ToggleRow
              label="Enable holiday uplift"
              checked={draft.holidayEnabled}
              disabled={!draft.enabled}
              onChange={(v) => setDraft({ ...draft, holidayEnabled: v })}
            />
          </div>

          <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Holiday calendar ({draft.specialDates.length})
              </h4>
              <Button
                size="sm"
                variant="outline"
                onClick={addSpecialDate}
                disabled={!draft.holidayEnabled || !draft.enabled}
                className="h-7 gap-1 border-primary/30 bg-primary/10 text-xs text-primary hover:bg-primary/20"
              >
                <Plus className="h-3 w-3" /> Add holiday
              </Button>
            </div>
            {sortedDates.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No holidays configured yet. Click &ldquo;Add holiday&rdquo; to
                create one.
              </p>
            ) : (
              <div className="space-y-2">
                {sortedDates.map((h) => {
                  const idx = draft.specialDates.indexOf(h)
                  return (
                    <div
                      key={`${h.date}-${idx}`}
                      className="grid grid-cols-[140px_1fr_110px_auto] items-center gap-2"
                    >
                      <Input
                        type="date"
                        value={h.date}
                        onChange={(e) =>
                          updateSpecialDate(idx, { date: e.target.value })
                        }
                        className="h-8"
                      />
                      <Input
                        value={h.label}
                        onChange={(e) =>
                          updateSpecialDate(idx, { label: e.target.value })
                        }
                        placeholder="e.g. Eid ul-Fitr"
                        className="h-8"
                      />
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={0.5}
                          value={h.pct ?? ""}
                          onChange={(e) =>
                            updateSpecialDate(idx, {
                              pct:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value) || 0,
                            })
                          }
                          placeholder={`${draft.holidayPct}`}
                          className="h-8 pr-7"
                        />
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                          %
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecialDate(idx)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </SettingsCard>

      {/* ===== Category-specific offsets ===== */}
      <SettingsCard
        icon={<Layers className="h-4 w-4" />}
        title="Category-specific Offsets"
        subtitle="Add extra % points to weekend & holiday uplift for premium tiers"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="rounded-xl border border-border/60 bg-secondary/30 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
                  <Building2 className="h-3 w-3 text-primary" />
                  {cat}
                </span>
                {lookupAdjustment("categoryAdjustments", cat) !== "" && (
                  <button
                    type="button"
                    onClick={() => setAdjustment("categoryAdjustments", cat, null)}
                    className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-rose-400"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={lookupAdjustment("categoryAdjustments", cat)}
                  onChange={(e) =>
                    setAdjustment(
                      "categoryAdjustments",
                      cat,
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  placeholder="0"
                  disabled={!draft.enabled}
                  className="h-8 pr-7"
                />
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                  +%
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 inline-flex items-start gap-1.5 text-[11px] text-muted-foreground">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          Offsets are <span className="mx-1 font-semibold">additive</span> —
          a +3% on Luxury makes weekend go from 5% to 8%. Leave blank or 0 to
          skip.
        </p>
      </SettingsCard>

      {/* ===== City-specific offsets ===== */}
      <SettingsCard
        icon={<Globe2 className="h-4 w-4" />}
        title="City-specific Offsets"
        subtitle="Add extra % points for high-demand cities"
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CITY_OBJECTS.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-secondary/30 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{c.name}</div>
                <div className="truncate text-[10px] text-muted-foreground">
                  {c.hub}
                </div>
              </div>
              <div className="relative w-24 shrink-0">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={lookupAdjustment("cityAdjustments", c.name)}
                  onChange={(e) =>
                    setAdjustment(
                      "cityAdjustments",
                      c.name,
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  placeholder="0"
                  disabled={!draft.enabled}
                  className="h-8 pr-7"
                />
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                  +%
                </span>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  )
}

// ---------- subcomponents ----------

function SettingsCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          {icon}
        </span>
        <div>
          <h3 className="font-display text-base font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
        checked && !disabled
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border/60 bg-secondary/30 text-muted-foreground",
        disabled && "opacity-50",
      )}
    >
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
      <span className="text-xs font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}
