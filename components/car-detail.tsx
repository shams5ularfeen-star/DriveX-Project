"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCar } from "@/lib/cars-store"
import { useAuth } from "@/lib/auth-store"
import { useSelectedCity } from "@/lib/city-store"
import {
  ArrowLeft,
  Armchair,
  CheckCircle2,
  Fuel,
  MapPin,
  Settings2,
  Shield,
  Snowflake,
  Star,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { getSecondaryLabel } from "@/lib/cars-data"
import { CarImage } from "@/components/car-image"
import { CityPicker } from "@/components/city-picker"
import { AvailabilityCard } from "@/components/availability-card"
import { getCarTotalQuantity } from "@/lib/availability"
import { useBookings } from "@/lib/bookings-store"
import { Boxes, PackageCheck, PackageMinus } from "lucide-react"

type View = "front" | "secondary"

export function CarDetail({ carId }: { carId: string }) {
  const router = useRouter()
  const car = useCar(carId)
  const [view, setView] = useState<View>("front")
  const [cityOpen, setCityOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const { city, cityId } = useSelectedCity()
  const allBookings = useBookings()

  if (!car) {
    return (
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Car not found</EmptyTitle>
              <EmptyDescription>
                The vehicle you&apos;re looking for is no longer available.
              </EmptyDescription>
            </EmptyHeader>
            <Button asChild>
              <Link href="/cars">Browse all cars</Link>
            </Button>
          </Empty>
        </div>
      </section>
    )
  }

  const secondaryLabel = getSecondaryLabel(car)
  const secondaryImage = car.backImage ?? car.interiorImage ?? car.sideImage
  const showImage = view === "front" ? car.frontImage : secondaryImage ?? car.frontImage

  // ---- Live inventory snapshot (only meaningful once a city is selected) ----
  const totalQuantity = getCarTotalQuantity(car)
  const bookedQuantity = cityId
    ? allBookings
        .filter(
          (b) =>
            b.status !== "cancelled" &&
            b.carId === car.id &&
            b.cityId === cityId,
        )
        .reduce((s, b) => s + (b.quantity ?? 1), 0)
    : 0
  const availableQuantity = Math.max(0, totalQuantity - bookedQuantity)

  const handleBook = () => {
    // City required first
    if (!cityId) {
      setCityOpen(true)
      return
    }
    if (!isAuthenticated) {
      const redirect = `/checkout/${car.id}`
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`)
      return
    }
    router.push(`/checkout/${car.id}`)
  }

  return (
    <section className="px-4 py-10 md:px-6 lg:px-8 lg:py-14">
      <CityPicker open={cityOpen} onOpenChange={setCityOpen} />

      <div className="mx-auto max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 h-9 gap-1 px-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* IMAGE STAGE */}
          <div>
            <div className="glass gold-glow relative aspect-[4/3] overflow-hidden rounded-3xl">
              <div
                aria-hidden
                className="absolute inset-x-10 bottom-0 h-32 rounded-[50%] bg-primary/30 blur-3xl"
              />
              <div className="absolute inset-0">
                <CarImage
                  src={showImage}
                  viewKey={view}
                  alt={`${car.name} ${view === "front" ? "front" : secondaryLabel?.toLowerCase()} view`}
                  className="transition-opacity duration-500"
                />
              </div>
              <span className="absolute left-4 top-4 rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary backdrop-blur">
                {car.category}
              </span>
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-sm font-medium backdrop-blur">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                {car.rating.toFixed(1)}
                <Users className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{car.reviews}</span>
              </span>
            </div>

            {secondaryLabel && (
              <div className="mt-4 flex justify-center">
                <div
                  role="tablist"
                  aria-label="Car view"
                  className="inline-flex rounded-full border border-border/60 bg-secondary/40 p-1 backdrop-blur"
                >
                  <ViewBtn active={view === "front"} onClick={() => setView("front")}>
                    Front
                  </ViewBtn>
                  <ViewBtn
                    active={view === "secondary"}
                    onClick={() => setView("secondary")}
                  >
                    {secondaryLabel === "Back" ? "Rear" : secondaryLabel}
                  </ViewBtn>
                </div>
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-primary">
                  {car.category} · {city?.name ?? "Select city"}
                </span>
                <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">
                  {car.name}
                </h1>
                <p className="text-sm text-muted-foreground">{car.model}</p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Per day
                </div>
                <div className="font-display text-2xl font-bold text-primary leading-none">
                  PKR {car.pricePerDay.toLocaleString()}
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              {car.description}
            </p>

            {/* Features */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Feature icon={<Fuel className="h-4 w-4" />} label="Fuel" value={car.fuel} />
              <Feature
                icon={<Settings2 className="h-4 w-4" />}
                label="Transmission"
                value={car.transmission}
              />
              <Feature
                icon={<Armchair className="h-4 w-4" />}
                label="Seats"
                value={`${car.seats}`}
              />
              <Feature
                icon={<Snowflake className="h-4 w-4" />}
                label="A/C"
                value={car.ac ? "Yes" : "No"}
              />
              <Feature
                icon={<Shield className="h-4 w-4" />}
                label="Insurance"
                value={car.insurance ? "Included" : "Optional"}
              />
              <Feature
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Verified"
                value="Yes"
              />
            </div>

            {/* Inventory snapshot */}
            <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl border border-border/60 bg-secondary/20 p-3">
              <InventoryStat
                icon={<Boxes className="h-3.5 w-3.5" />}
                label="Total fleet"
                value={totalQuantity}
                tone="neutral"
              />
              <InventoryStat
                icon={<PackageMinus className="h-3.5 w-3.5" />}
                label="Booked"
                value={cityId ? bookedQuantity : "—"}
                tone="amber"
              />
              <InventoryStat
                icon={<PackageCheck className="h-3.5 w-3.5" />}
                label="Available"
                value={cityId ? availableQuantity : "—"}
                tone="emerald"
              />
            </div>

            {/* City selector strip */}
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Pickup city:</span>
                <span className="font-semibold">
                  {city ? `${city.name} · ${city.hub}` : "Not selected"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCityOpen(true)}
                className="ml-auto h-7 border-border/60 bg-transparent text-xs"
              >
                {city ? "Change city" : "Select city"}
              </Button>
            </div>

            {/* 3-Day live availability */}
            {cityId && (
              <div className="mt-4">
                <AvailabilityCard
                  carId={car.id}
                  category={car.category}
                  cityId={cityId}
                  totalQuantity={totalQuantity}
                />
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={handleBook}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue to checkout — PKR {car.pricePerDay.toLocaleString()}/day
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-border/60 bg-transparent"
              >
                <Link href="/cars">Back to fleet</Link>
              </Button>
            </div>

            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
              <span className="font-semibold text-primary">Loyalty engine:</span>{" "}
              {car.category === "Economy"
                ? "Earn 5–20% discount tiers as you book Economy rides."
                : car.category === "Sedan" ||
                    car.category === "SUV" ||
                    car.category === "Luxury"
                  ? "Premium tier unlocks 10–15% discount after 10/20 bookings."
                  : car.category === "Exotic"
                    ? "Exotic concierge promo: 8% off limited-time offers."
                    : "Specialty fleet promo: 5% off."}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
        {icon}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
    </div>
  )
}

function InventoryStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  tone: "neutral" | "amber" | "emerald"
}) {
  const toneClass = {
    neutral: "border-border/60 bg-card text-foreground",
    amber: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
  }[tone]
  return (
    <div className={cn("rounded-lg border px-3 py-2", toneClass)}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="text-current">{icon}</span>
        {label}
      </div>
      <div className="mt-1 font-display text-xl font-bold leading-none">
        {value}
      </div>
    </div>
  )
}

function ViewBtn({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-5 py-1.5 text-xs font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground shadow"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
