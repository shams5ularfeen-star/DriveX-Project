"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CarCard } from "@/components/car-card"
import { useCars } from "@/lib/cars-store"

export function FeaturedCars() {
  const cars = useCars()
  const featured = cars.filter((c) => c.featured).slice(0, 8)

  return (
    <section className="px-4 py-16 md:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-primary">
              Hand-picked
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Featured <span className="text-gold-gradient">Luxury Cars</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Curated selection from our premium fleet — each car is verified,
              insured, and ready to roll.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-border/60 bg-transparent"
          >
            <Link href="/cars">
              View all cars
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  )
}
