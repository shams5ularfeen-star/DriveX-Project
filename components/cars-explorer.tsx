"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CATEGORIES } from "@/lib/cars-data"
import { useCars } from "@/lib/cars-store"
import { useSelectedCity } from "@/lib/city-store"
import { CarCard } from "@/components/car-card"
import { CityPicker } from "@/components/city-picker"
import { Filter, MapPin, X, Sparkles } from "lucide-react"

type SortKey = "popular" | "price-asc" | "price-desc"

export function CarsExplorer() {
  const searchParams = useSearchParams()
  const cars = useCars()
  const { city, hydrated: cityHydrated } = useSelectedCity()
  const [cityOpen, setCityOpen] = useState(false)

  const [category, setCategory] = useState<string>(
    searchParams?.get("category") ?? "all",
  )
  const [fuel, setFuel] = useState<string>("all")
  const [transmission, setTransmission] = useState<string>("all")
  const [sort, setSort] = useState<SortKey>("popular")
  const [maxPrice, setMaxPrice] = useState<number>(900000)

  // First-visit gate: prompt city selection
  useEffect(() => {
    if (cityHydrated && !city) setCityOpen(true)
  }, [cityHydrated, city])

  const filtered = useMemo(() => {
    let list = cars.slice()
    if (category !== "all") list = list.filter((c) => c.category === category)
    if (fuel !== "all") list = list.filter((c) => c.fuel === fuel)
    if (transmission !== "all")
      list = list.filter((c) => c.transmission === transmission)
    list = list.filter((c) => c.pricePerDay <= maxPrice)

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.pricePerDay - b.pricePerDay)
        break
      case "price-desc":
        list.sort((a, b) => b.pricePerDay - a.pricePerDay)
        break
      default:
        list.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
    }
    return list
  }, [cars, category, fuel, transmission, sort, maxPrice])

  const reset = () => {
    setCategory("all")
    setFuel("all")
    setTransmission("all")
    setMaxPrice(900000)
  }

  return (
    <section className="px-4 py-10 md:px-6 lg:px-8">
      <CityPicker open={cityOpen} onOpenChange={setCityOpen} />

      <div className="mx-auto max-w-7xl">
        {/* CITY BANNER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-card/60 p-4 backdrop-blur md:p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">
                <Sparkles className="mr-1 inline h-3 w-3" />
                Same {cars.length} cars · All cities
              </div>
              <div className="font-display text-base font-semibold leading-tight">
                Showing fleet for{" "}
                <span className="text-primary">
                  {city ? city.name : "your city"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {city
                  ? `Pickup hub: ${city.hub} · ${city.region}`
                  : "Pick a city to see live availability"}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setCityOpen(true)}
            className="border-border/60 bg-transparent"
          >
            {city ? "Change city" : "Select city"}
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* FILTERS */}
          <aside className="h-fit rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold">
                <Filter className="h-4 w-4 text-primary" />
                Filters
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={reset}
                className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
                Reset
              </Button>
            </div>

            <div className="mt-5 flex flex-col gap-5">
              <div>
                <Label className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  Fuel
                </Label>
                <Select value={fuel} onValueChange={setFuel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  Transmission
                </Label>
                <Select value={transmission} onValueChange={setTransmission}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                    <SelectItem value="DCT">DCT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Max price / day
                  </Label>
                  <span className="font-display text-xs font-semibold text-primary">
                    PKR {maxPrice.toLocaleString()}
                  </span>
                </div>
                <Slider
                  min={5000}
                  max={900000}
                  step={5000}
                  value={[maxPrice]}
                  onValueChange={(v) => setMaxPrice(v[0])}
                />
              </div>
            </div>
          </aside>

          {/* RESULTS */}
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                of {cars.length} cars
              </div>
              <Select value={sort} onValueChange={(v: SortKey) => setSort(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filtered.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No cars match your filters</EmptyTitle>
                  <EmptyDescription>
                    Try widening your search or resetting all filters.
                  </EmptyDescription>
                </EmptyHeader>
                <Button onClick={reset} className="mt-2">
                  Reset filters
                </Button>
              </Empty>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
