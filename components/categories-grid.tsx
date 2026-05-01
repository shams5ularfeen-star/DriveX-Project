"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Crown,
  Heart,
  Mountain,
  Rocket,
  Sparkles,
  TramFront,
  Truck,
  Users,
  CarFront,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { CarCategory } from "@/lib/cars-data"
import { useCars } from "@/lib/cars-store"
import { cn } from "@/lib/utils"
import { CarImage } from "@/components/car-image"

// 5 main premium categories shown prominently as luxury cards.
const PRIMARY: {
  key: CarCategory
  icon: React.ComponentType<{ className?: string }>
  tag: string
  blurb: string
}[] = [
  { key: "Luxury", icon: Crown, tag: "Top tier", blurb: "Flagship sedans & limousines" },
  { key: "Exotic", icon: Rocket, tag: "Limited", blurb: "Supercars & hypercars" },
  { key: "SUV", icon: Mountain, tag: "Adventure", blurb: "Off-road & city SUVs" },
  { key: "Sedan", icon: TramFront, tag: "Daily luxe", blurb: "Comfort & elegance" },
  { key: "Wedding", icon: Heart, tag: "Special day", blurb: "Decorated, chauffeured" },
]

// Secondary chips shown in a horizontal auto-scrolling carousel.
const SECONDARY: {
  key: CarCategory
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { key: "Economy", icon: CarFront },
  { key: "Vans", icon: Truck },
  { key: "Family", icon: Users },
  { key: "City", icon: Sparkles },
]

export function CategoriesGrid() {
  const cars = useCars()

  // Auto-rotating "spotlight" featured car per primary category card.
  // Strictly uses the FIRST car of each category — no cross-mixing.
  const spotlight = useMemo(() => {
    const m: Record<string, ReturnType<typeof Object> | undefined> = {}
    for (const p of PRIMARY) {
      const list = cars.filter((c) => c.category === p.key)
      m[p.key] = list[0]
    }
    return m as Record<string, (typeof cars)[number] | undefined>
  }, [cars])

  return (
    <section className="relative border-t border-border/60 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.24em] text-primary">
              Find your personality
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Choose a <span className="text-gold-gradient">lane</span>
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              From everyday city hatchbacks to rare exotics — we&apos;ve curated
              every category Pakistan demands.
            </p>
          </div>
          <Link
            href="/cars"
            className="hidden items-center gap-1 text-xs uppercase tracking-wider text-primary hover:underline md:inline-flex"
          >
            See all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Primary 5 luxury cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {PRIMARY.map((p) => {
            const car = spotlight[p.key]
            const count = cars.filter((c) => c.category === p.key).length
            const Icon = p.icon
            return (
              <Link
                key={p.key}
                href={`/cars?category=${p.key}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_25px_70px_-20px] hover:shadow-primary/40"
              >
                {/* image */}
                <div className="relative aspect-[5/4] overflow-hidden bg-secondary/40">
                  {car ? (
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                      <CarImage src={car.frontImage} alt={`${p.key} category`} />
                    </div>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                      <Icon className="h-10 w-10" />
                    </div>
                  )}
                  {/* dark vignette + golden glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 100%, rgba(212,175,55,0.25), transparent 60%)",
                    }}
                  />

                  {/* tag */}
                  <span className="absolute left-3 top-3 rounded-full border border-primary/30 bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur">
                    {p.tag}
                  </span>

                  {/* count */}
                  <span className="absolute right-3 top-3 rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
                    {count} cars
                  </span>
                </div>

                {/* footer */}
                <div className="flex items-center justify-between gap-2 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="font-display text-base font-semibold">
                        {p.key}
                      </h3>
                    </div>
                    <p className="mt-1 truncate text-[11px] text-muted-foreground">
                      {p.blurb}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Secondary auto-sliding category strip */}
        <SecondaryCarousel cars={cars} />
      </div>
    </section>
  )
}

function SecondaryCarousel({
  cars,
}: {
  cars: ReturnType<typeof useCars>
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SECONDARY.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  const next = () => setIndex((i) => (i + 1) % SECONDARY.length)
  const prev = () =>
    setIndex((i) => (i - 1 + SECONDARY.length) % SECONDARY.length)

  return (
    <div className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur md:p-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
            More lanes
          </span>
          <h3 className="font-display text-base font-semibold">
            Explore additional categories
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Previous"
            className="grid h-8 w-8 place-items-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="grid h-8 w-8 place-items-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SECONDARY.map((s) => {
            const Icon = s.icon
            const car = cars.find((c) => c.category === s.key)
            const count = cars.filter((c) => c.category === s.key).length
            return (
              <Link
                key={s.key}
                href={`/cars?category=${s.key}`}
                className="group flex w-full shrink-0 items-center gap-4 rounded-xl border border-border/60 bg-background/60 p-4 transition-colors hover:border-primary/40"
              >
                <div className="relative h-20 w-32 overflow-hidden rounded-lg bg-secondary/40">
                  {car ? (
                    <CarImage src={car.frontImage} alt={s.key} />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h4 className="font-display text-base font-semibold">
                      {s.key}
                    </h4>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {count} cars in this category
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* dots */}
      <div className="mt-3 flex justify-center gap-1.5">
        {SECONDARY.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-6 bg-primary" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>
    </div>
  )
}
