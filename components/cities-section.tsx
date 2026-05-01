"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useCars } from "@/lib/cars-store"
import { CITIES, useSelectedCity, type City } from "@/lib/city-store"
import { CarImage } from "@/components/car-image"
import { ArrowRight, MapPin, Building2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const CITY_INFO: Record<string, string> = {
  Islamabad: "The capital — diplomatic district & luxury fleet",
  Lahore: "The cultural heart — weddings & city cars",
  Karachi: "The mega city — exotics, SUVs & airport pickups",
  Rawalpindi: "Twin city of Islamabad — daily commuters",
  Peshawar: "Gateway to the north — rugged SUVs",
  Multan: "South Punjab — sedans & family vans",
  Quetta: "High-altitude rentals — 4x4 specialists",
  Faisalabad: "Industrial hub — business sedans",
  Sialkot: "Sports city — premium pickups",
  Hyderabad: "Sindh corridor — economy & family",
}

/** Deterministic small "shuffle" so each city's preview shows a different
 *  ordering, while the fleet itself remains the full 83. */
function rotatedPreview<T>(arr: T[], cityIndex: number, count: number): T[] {
  if (arr.length === 0) return []
  const offset = (cityIndex * 7) % arr.length
  const rotated = [...arr.slice(offset), ...arr.slice(0, offset)]
  return rotated.slice(0, count)
}

export function CitiesSection() {
  const cars = useCars()
  const { city: globalCity, setCity } = useSelectedCity()
  const [active, setActive] = useState<City>(
    globalCity ?? CITIES[0],
  )

  const cityIndex = CITIES.findIndex((c) => c.id === active.id)
  const preview = useMemo(
    () => rotatedPreview(cars, cityIndex, 6),
    [cars, cityIndex],
  )

  const totalFleet = cars.length

  const handlePick = (c: City) => {
    setActive(c)
  }

  const handleConfirmCity = () => {
    setCity(active.id)
  }

  return (
    <section className="relative isolate overflow-hidden border-t border-border/60 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.07]"
        style={{ backgroundImage: "url(/pakistan-cities-bg.jpg)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/90 to-background"
      />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
              <MapPin className="h-3.5 w-3.5" />
              Available across {CITIES.length} cities · Same {totalFleet}-car fleet everywhere
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Drive in <span className="text-gold-gradient">your city</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              The full DriveX fleet — {totalFleet} vehicles — is available in
              every city. Only live availability and pickup hub change.
            </p>
          </div>
        </div>

        {/* City pills */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CITIES.map((c) => {
            const isActive = c.id === active.id
            const isSelected = globalCity?.id === c.id
            return (
              <button
                key={c.id}
                onClick={() => handlePick(c)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "border-primary bg-primary/15 text-primary shadow-[0_0_20px_-4px] shadow-primary/40"
                    : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>{c.name}</span>
                {isSelected && (
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                )}
              </button>
            )
          })}
        </div>

        {/* Active city panel */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="rounded-2xl border border-primary/20 bg-card p-5">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.18em]">
                Spotlight
              </span>
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold">
              {active.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {active.region} · Hub: {active.hub}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {CITY_INFO[active.name] ?? "Premium fleet available."}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border/60 bg-background/60 p-3">
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Fleet size
                </dt>
                <dd className="mt-1 font-display text-xl font-bold text-primary">
                  {totalFleet}
                </dd>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-3">
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Live availability
                </dt>
                <dd className="mt-1 font-display text-xl font-bold text-primary">
                  3-day
                </dd>
              </div>
            </dl>

            <Button3
              onClick={handleConfirmCity}
              isCurrent={globalCity?.id === active.id}
            />

            <Link
              href={`/cars`}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-transparent px-4 py-2.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Browse all {totalFleet} cars
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Car previews — same fleet, rotated for variety */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {preview.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-secondary/30 transition-all hover:border-primary/40"
              >
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                  <CarImage src={car.frontImage} alt={car.name} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                <div className="absolute inset-x-3 bottom-3">
                  <div className="text-[10px] uppercase tracking-wider text-primary">
                    {car.category}
                  </div>
                  <div className="truncate font-display text-sm font-semibold">
                    {car.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    PKR {car.pricePerDay.toLocaleString()} / day
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Button3({
  onClick,
  isCurrent,
}: {
  onClick: () => void
  isCurrent: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
        isCurrent
          ? "border border-primary/40 bg-primary/10 text-primary"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
      )}
    >
      {isCurrent ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Currently selected
        </>
      ) : (
        <>
          Set as my city
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  )
}
