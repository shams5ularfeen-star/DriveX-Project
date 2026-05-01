"use client"

import { useMemo } from "react"
import Link from "next/link"
import {
  Armchair,
  Eye,
  Fuel,
  Settings2,
  Star,
  Users,
  Package,
} from "lucide-react"
import type { Car } from "@/lib/cars-data"
import { getSecondaryImage, getSecondaryLabel } from "@/lib/cars-data"
import { cn } from "@/lib/utils"
import { CarImage } from "@/components/car-image"
import { useSelectedCity } from "@/lib/city-store"
import { useBookings } from "@/lib/bookings-store"
import { getCarTotalQuantity } from "@/lib/availability"

interface CarCardProps {
  car: Car
  className?: string
}

/**
 * STRICT IMAGE RULES:
 *  - Default = front image only (no labels)
 *  - On hover/focus, the secondary image (back, or interior, or side, in that order)
 *    smoothly cross-fades in. No mixing — only the one assigned to THIS car.
 *  - A subtle "View More" / Eye icon appears on hover, never cluttering the default state.
 *  - Both views are NEVER shown side-by-side at the same time.
 */
export function CarCard({ car, className }: CarCardProps) {
  const secondary = getSecondaryImage(car)
  const secondaryLabel = getSecondaryLabel(car)
  const { cityId } = useSelectedCity()
  const allBookings = useBookings()

  // ---- Live stock for the currently selected city (or aggregate if none) ----
  const stock = useMemo(() => {
    const total = getCarTotalQuantity(car)
    const booked = allBookings
      .filter(
        (b) =>
          b.status !== "cancelled" &&
          b.carId === car.id &&
          (cityId ? b.cityId === cityId : true),
      )
      .reduce((s, b) => s + (b.quantity ?? 1), 0)
    const available = Math.max(0, total - booked)
    const tone =
      available === 0 ? "rose" : available <= Math.max(2, total * 0.2) ? "amber" : "emerald"
    return { total, booked, available, tone }
  }, [car, allBookings, cityId])

  return (
    <Link
      href={`/cars/${car.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-15px] hover:shadow-primary/30",
        className,
      )}
    >
      {/* Image stage */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary/40">
        {/* Front image — default visible */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500",
            secondary
              ? "group-hover:scale-105 group-hover:opacity-0"
              : "group-hover:scale-105",
          )}
        >
          <CarImage src={car.frontImage} alt={`${car.name} front view`} />
        </div>

        {/* Secondary image — only this car's assigned image, only revealed on hover */}
        {secondary && (
          <div className="absolute inset-0 scale-105 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
            <CarImage
              src={secondary}
              alt={`${car.name} ${secondaryLabel?.toLowerCase()} view`}
            />
          </div>
        )}

        {/* Top-left category badge */}
        <span className="absolute left-3 top-3 z-10 rounded-full border border-primary/30 bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur">
          {car.category}
        </span>

        {/* Top-right rating */}
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-xs font-medium backdrop-blur">
          <Star className="h-3 w-3 fill-primary text-primary" strokeWidth={1.5} />
          {car.rating.toFixed(1)}
          <span className="text-muted-foreground">
            <Users className="ml-1 h-3 w-3" strokeWidth={2} />
          </span>
          <span className="text-[10px] text-muted-foreground">
            {car.reviews}
          </span>
        </span>

        {/* Live stock chip — bottom-left, complements the live availability engine */}
        <span
          className={cn(
            "absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur",
            stock.tone === "rose"
              ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
              : stock.tone === "amber"
                ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                : "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
          )}
        >
          <Package className="h-3 w-3" />
          {stock.available === 0
            ? "Fully booked"
            : stock.tone === "amber"
              ? `Only ${stock.available} left`
              : `${stock.available} available`}
        </span>

        {/* Subtle "View More" hint — only visible on hover, only if a 2nd image exists */}
        {secondary && (
          <span className="pointer-events-none absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-background/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            <Eye className="h-3 w-3" />
            {secondaryLabel === "Back" ? "Rear" : secondaryLabel}
          </span>
        )}

        {/* Gradient bottom for legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/80 to-transparent"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-foreground">
              {car.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {car.model} · {car.city}
            </p>
          </div>
          <div className="text-right">
            <div className="font-display text-lg font-bold text-primary leading-none">
              PKR {car.pricePerDay.toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground">/day</div>
          </div>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5 text-primary/80" />
            {car.fuel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Settings2 className="h-3.5 w-3.5 text-primary/80" />
            {car.transmission}
          </span>
          <span className="inline-flex items-center gap-1">
            <Armchair className="h-3.5 w-3.5 text-primary/80" />
            {car.seats} seats
          </span>
        </div>
      </div>
    </Link>
  )
}
