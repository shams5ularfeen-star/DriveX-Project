"use client"

import { useEffect, useState } from "react"
import { Activity, MapPin } from "lucide-react"
import { useBookings } from "@/lib/bookings-store"
import {
  dayLabel,
  get3DayForecast,
  type AvailabilityCell,
} from "@/lib/availability"
import { getCityById } from "@/lib/city-store"
import { cn } from "@/lib/utils"

type Props = {
  carId: string
  category: string
  cityId: string
  totalQuantity: number
}

export function AvailabilityCard({ carId, category, cityId, totalQuantity }: Props) {
  const allBookings = useBookings()
  const [forecast, setForecast] = useState<AvailabilityCell[]>([])

  useEffect(() => {
    setForecast(
      get3DayForecast({
        carId,
        cityId,
        category,
        totalQuantity,
        bookings: allBookings,
      }),
    )
  }, [carId, cityId, category, totalQuantity, allBookings])

  const city = getCityById(cityId)

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Activity className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold">3-Day Live Availability</div>
            <div className="text-[11px] text-muted-foreground">
              Updated in real time · Capacity {totalQuantity} per day
            </div>
          </div>
        </div>
        {city && (
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <MapPin className="h-3 w-3" />
            {city.name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {forecast.map((cell, idx) => {
          const status =
            cell.pct >= 70 ? "high" : cell.pct >= 35 ? "medium" : "low"
          return (
            <div
              key={cell.date}
              className={cn(
                "rounded-xl border p-3 transition-colors",
                status === "high" && "border-primary/30 bg-primary/5",
                status === "medium" && "border-amber-500/30 bg-amber-500/5",
                status === "low" && "border-destructive/30 bg-destructive/5",
              )}
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {dayLabel(cell.date, idx)}
              </div>
              <div className="mt-1 font-display text-2xl font-bold leading-none">
                {cell.available}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / {cell.capacity}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    status === "high" && "bg-primary",
                    status === "medium" && "bg-amber-500",
                    status === "low" && "bg-destructive",
                  )}
                  style={{ width: `${cell.pct}%` }}
                />
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                {status === "high"
                  ? "High availability"
                  : status === "medium"
                    ? "Filling up fast"
                    : "Limited stock"}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
