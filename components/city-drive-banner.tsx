import Link from "next/link"
import { ArrowRight, Fuel, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Decorative homepage banner — uses a generic Suzuki Cultus stock visual that
 * was rejected from the strict per-car listing dataset. The image is treated
 * purely as ambient brand artwork (background, low-opacity, color-graded) and
 * never as a car-listing tile. Loads with `referrerPolicy="no-referrer"` so
 * external CDNs that block hotlinks degrade gracefully to the gold gradient.
 */
const HERO_BG =
  "https://imgcdn.zigwheels.pk/large/gallery/exterior/13/115/suzuki-cultus-front-angle-low-view.jpg"

export function CityDriveBanner() {
  return (
    <section
      className="relative isolate overflow-hidden border-y border-border/40 bg-secondary/20 py-20 md:py-24"
      aria-label="Everyday city drive promise"
    >
      {/* Reused stock image — strictly decorative, not a listing */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_BG || "/placeholder.svg"}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-25 mix-blend-luminosity"
        />
        {/* Premium dark gradient + gold wash for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/15 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Copy */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3 w-3" />
              City drives, made effortless
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl font-bold leading-tight md:text-4xl">
              From{" "}
              <span className="text-gold-gradient">school runs to weekend escapes</span>
              , the right car is always close.
            </h2>
            <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
              Hatchbacks, family sedans, premium SUVs and exotics — pre-inspected,
              cleaned, and delivered to your gate across 11 Pakistani cities.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
              <Stat
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Cities served"
                value="11"
              />
              <Stat
                icon={<Fuel className="h-3.5 w-3.5" />}
                label="Avg. fuel-ready"
                value="100%"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/cars?category=Economy">
                  Browse economy fleet
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-border/60 bg-transparent"
              >
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>
          </div>

          {/* Right-side stylized brand panel — solid art, never a car listing */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-secondary/40 to-card backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,193,77,0.12),transparent_60%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-7xl font-black leading-none text-gold-gradient">
                  82
                </span>
                <span className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Curated vehicles
                </span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-primary/80">
                  · live across every city ·
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>
            <div className="absolute -bottom-3 -right-3 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-1 font-display text-xl font-bold leading-none">
        {value}
      </div>
    </div>
  )
}
