"use client"

import { useEffect, useState } from "react"
import { MapPin, Check, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CITIES, useSelectedCity } from "@/lib/city-store"
import { cn } from "@/lib/utils"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Allow dismissing without selecting (false on first-visit gates) */
  dismissible?: boolean
  title?: string
  description?: string
}

export function CityPicker({
  open,
  onOpenChange,
  dismissible = true,
  title = "Choose your city",
  description = "Inventory of all 83 cars is available in every city — availability and pricing reflect that city's live fleet.",
}: Props) {
  const { cityId, setCity } = useSelectedCity()
  const [pending, setPending] = useState<string | null>(cityId)

  useEffect(() => {
    if (open) setPending(cityId)
  }, [open, cityId])

  if (!open) return null

  const handleConfirm = () => {
    if (!pending) return
    setCity(pending)
    onOpenChange(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-picker-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close city picker"
        onClick={() => dismissible && onOpenChange(false)}
        className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-md",
          !dismissible && "cursor-default",
        )}
      />

      {/* Panel */}
      <div className="glass gold-glow relative w-full max-w-2xl rounded-2xl p-6 md:p-8">
        {dismissible && (
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="mb-6 flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
            <MapPin className="h-6 w-6 text-primary" />
          </span>
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3 w-3" />
              Live fleet selector
            </div>
            <h2
              id="city-picker-title"
              className="font-display text-2xl font-bold leading-tight md:text-3xl"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* City grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {CITIES.map((c) => {
            const active = pending === c.id
            return (
              <button
                key={c.id}
                onClick={() => setPending(c.id)}
                className={cn(
                  "group relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all",
                  active
                    ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                    : "border-border/60 bg-card/50 hover:border-primary/40 hover:bg-secondary/40",
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {c.name}
                  </span>
                  {active && (
                    <Check className="h-4 w-4 text-primary" aria-hidden />
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {c.region} · {c.hub}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {dismissible && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border/60 bg-transparent"
            >
              Cancel
            </Button>
          )}
          <Button
            disabled={!pending}
            onClick={handleConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
