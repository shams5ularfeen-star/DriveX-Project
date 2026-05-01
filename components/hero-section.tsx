"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DEFAULT_CARS } from "@/lib/cars-data"
import { HappyRenters } from "@/components/happy-renters"
import { CarImage } from "@/components/car-image"

// Strict image mapping: hero is BMW 7 Series ONLY.
const HERO_CAR = DEFAULT_CARS.find((c) => c.id === "bmw-7-series")!

type View = "front" | "back"

export function HeroSection() {
  const [view, setView] = useState<View>("front")

  const heroImage =
    view === "front" ? HERO_CAR.frontImage : HERO_CAR.backImage ?? HERO_CAR.frontImage

  return (
    <section className="relative isolate overflow-hidden">
      {/* Ambient background */}
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 md:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-8 lg:pb-24 lg:pt-16">
        {/* LEFT — copy, ratings, avatars */}
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Pakistan&apos;s #1 Luxury Car Rental Platform
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance md:text-5xl lg:text-6xl">
            Rent Your <span className="text-gold-gradient">Dream Car</span>
            <br className="hidden md:block" /> in Pakistan
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            From everyday reliable hatchbacks to limited-edition exotics — drive
            something extraordinary today. Fully insured, verified drivers, and
            instant booking across 10 cities.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground shadow-[0_10px_40px_-10px] shadow-primary/40 hover:bg-primary/90"
            >
              <Link href="/cars">
                Browse Cars
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border/60 bg-transparent hover:bg-secondary"
            >
              <Link href="/about">How it works</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <HappyRenters />
            <div className="h-10 w-px bg-border/60" />
            <div className="flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-lg font-bold">4.9/5</span>
                <span className="text-xs text-muted-foreground">
                  3,200+ verified reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — BMW 7 SERIES showcase with front/back toggle */}
        <div className="relative">
          {/* outer glow halo */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/25 via-primary/5 to-transparent blur-2xl"
          />

          <div className="glass gold-glow relative aspect-[5/4] overflow-hidden rounded-3xl">
            {/* golden under-glow */}
            <div
              aria-hidden
              className="absolute inset-x-10 bottom-0 h-32 rounded-[50%] bg-primary/30 blur-3xl"
            />
            {/* image */}
            <div className="absolute inset-0">
              <CarImage
                src={heroImage}
                viewKey={view}
                alt={`${HERO_CAR.name} ${view === "front" ? "front" : "rear"} view`}
                className="transition-opacity duration-500"
              />
            </div>
            {/* overlay gradient bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/90 to-transparent" />

            {/* Car info bar */}
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-primary">
                  {HERO_CAR.category}
                </div>
                <div className="font-display text-xl font-bold md:text-2xl">
                  {HERO_CAR.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {HERO_CAR.model}
                </div>
              </div>
              <div className="rounded-xl border border-primary/30 bg-background/70 px-3 py-2 text-right backdrop-blur">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  From
                </div>
                <div className="font-display text-base font-bold text-primary">
                  PKR {HERO_CAR.pricePerDay.toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground">/day</div>
              </div>
            </div>
          </div>

          {/* Front / Back toggle */}
          <div className="mt-4 flex justify-center">
            <div
              role="tablist"
              aria-label="Car view"
              className="inline-flex rounded-full border border-border/60 bg-secondary/40 p-1 backdrop-blur"
            >
              <button
                type="button"
                role="tab"
                aria-selected={view === "front"}
                onClick={() => setView("front")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                  view === "front"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Front view
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "back"}
                onClick={() => setView("back")}
                disabled={!HERO_CAR.backImage}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                  view === "back"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                  !HERO_CAR.backImage && "opacity-40",
                )}
              >
                Rear view
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
