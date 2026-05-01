import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Check,
  Crown,
  Gauge,
  Mountain,
  Rocket,
  Sparkles,
  TramFront,
  Heart,
  CarFront,
  Truck,
  Users,
  Tag,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Pricing — DriveX Pakistan",
  description:
    "Transparent daily rental pricing across all categories — Economy to Exotic. Discounts, weekly packages and corporate rates.",
}

interface Tier {
  category: string
  icon: React.ComponentType<{ className?: string }>
  blurb: string
  startsAt: number
  weeklyOff: number
  examples: string[]
  features: string[]
  highlight?: boolean
}

const TIERS: Tier[] = [
  {
    category: "Economy",
    icon: CarFront,
    blurb: "Reliable everyday city cars",
    startsAt: 4500,
    weeklyOff: 10,
    examples: ["Suzuki Mehran VX", "Suzuki Alto", "Wagon R", "Daihatsu Mira"],
    features: [
      "AC + insurance included",
      "Free 100 km / day",
      "Self-drive or with driver",
    ],
  },
  {
    category: "Sedan",
    icon: TramFront,
    blurb: "Comfortable & stylish daily luxe",
    startsAt: 9500,
    weeklyOff: 12,
    examples: ["Toyota Corolla", "Honda Civic", "Honda City", "Hyundai Elantra"],
    features: [
      "Premium leather interiors",
      "Free 150 km / day",
      "Airport pickup option",
    ],
    highlight: true,
  },
  {
    category: "SUV",
    icon: Mountain,
    blurb: "Family adventures & rugged terrain",
    startsAt: 18000,
    weeklyOff: 15,
    examples: ["KIA Sportage", "Hyundai Tucson", "Honda HR-V", "MG HS"],
    features: [
      "4×4 / AWD on request",
      "Free 200 km / day",
      "Roof carrier available",
    ],
  },
  {
    category: "Luxury",
    icon: Crown,
    blurb: "Flagship sedans & limousines",
    startsAt: 55000,
    weeklyOff: 18,
    examples: [
      "BMW 7 Series",
      "Mercedes S-Class",
      "Audi A8",
      "Mercedes E300",
    ],
    features: [
      "Chauffeur included on request",
      "Unlimited mileage in-city",
      "Champagne welcome (Wedding pkg)",
    ],
  },
  {
    category: "Exotic",
    icon: Rocket,
    blurb: "Supercars & hypercars",
    startsAt: 250000,
    weeklyOff: 0,
    examples: [
      "Lamborghini Huracán",
      "Ferrari Roma",
      "Porsche Cayenne",
      "Bugatti Veyron",
    ],
    features: [
      "Limited daily availability",
      "Pre-qualified drivers only",
      "Comprehensive cover included",
    ],
  },
  {
    category: "Wedding",
    icon: Heart,
    blurb: "Decorated, chauffeured, special",
    startsAt: 35000,
    weeklyOff: 0,
    examples: [
      "Rolls Royce",
      "Mercedes S-Class (decorated)",
      "Range Rover Vogue",
    ],
    features: [
      "Floral decor included",
      "Uniformed chauffeur",
      "5-hour event package",
    ],
  },
  {
    category: "Vans",
    icon: Truck,
    blurb: "Group travel & airport transfers",
    startsAt: 12000,
    weeklyOff: 14,
    examples: ["Toyota Hiace", "KIA Carnival", "Changan Karvaan"],
    features: [
      "10–15 seater options",
      "Free 250 km / day",
      "Driver included",
    ],
  },
  {
    category: "Family",
    icon: Users,
    blurb: "Spacious comfort for every trip",
    startsAt: 11000,
    weeklyOff: 12,
    examples: ["Honda BR-V", "DFSK Glory 580", "Changan Oshan X7"],
    features: [
      "7-seat configurations",
      "Child seats free",
      "Free 200 km / day",
    ],
  },
]

const DISCOUNTS = [
  { code: "DRIVEX10", desc: "10% off your first booking", min: "Any car" },
  { code: "WEEKEND15", desc: "15% off weekend bookings", min: "Fri–Sun" },
  { code: "WELCOME20", desc: "20% off if booked 7+ days ahead", min: "Any car" },
  { code: "LUXURY25", desc: "25% off luxury & exotic categories", min: "Mon–Thu" },
]

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-border/60 px-4 pb-12 pt-16 md:px-6 lg:px-8 lg:pb-16 lg:pt-24">
        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Transparent, all-inclusive pricing
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-balance md:text-5xl lg:text-6xl">
            One price.{" "}
            <span className="text-gold-gradient">Zero surprises.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
            Insurance, basic mileage and roadside support are included in every
            tier. Compare daily rates across categories and pick what fits your
            day.
          </p>
        </div>
      </section>

      {/* Pricing grid */}
      <section className="px-4 py-16 md:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((t) => {
              const Icon = t.icon
              return (
                <div
                  key={t.category}
                  className={cn(
                    "relative flex flex-col rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1",
                    t.highlight
                      ? "border-primary/40 bg-gradient-to-br from-primary/10 to-transparent shadow-[0_25px_70px_-25px] shadow-primary/30"
                      : "border-border/60 hover:border-primary/30",
                  )}
                >
                  {t.highlight && (
                    <span className="absolute -top-2 right-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                      Most popular
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">
                        {t.category}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {t.blurb}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Starts at
                    </div>
                    <div className="font-display text-3xl font-bold leading-none text-primary">
                      PKR {t.startsAt.toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      per day
                      {t.weeklyOff > 0 && (
                        <span className="ml-2 text-primary">
                          · {t.weeklyOff}% off weekly
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2">
                    {t.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 rounded-lg border border-border/60 bg-background/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Includes models like
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-foreground/90">
                      {t.examples.join(" · ")}
                    </div>
                  </div>

                  <Button
                    asChild
                    className={cn(
                      "mt-5 w-full",
                      t.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-foreground hover:bg-secondary/70",
                    )}
                  >
                    <Link href={`/cars?category=${t.category}`}>Browse {t.category}</Link>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Discounts */}
      <section className="border-t border-border/60 px-4 py-16 md:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.24em] text-primary">
              Discounts & promo codes
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Save more, drive <span className="text-gold-gradient">better</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Apply at checkout — only one promo code per booking.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {DISCOUNTS.map((d) => (
              <div
                key={d.code}
                className="group rounded-2xl border border-dashed border-primary/40 bg-card p-5 transition-all hover:border-primary"
              >
                <Tag className="h-5 w-5 text-primary" />
                <div className="mt-3 font-mono text-base font-bold tracking-wider text-primary">
                  {d.code}
                </div>
                <div className="mt-1 text-sm font-semibold">{d.desc}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {d.min}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions strip */}
      <section className="border-t border-border/60 bg-card/40 px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          <Inclusion
            icon={ShieldCheck}
            title="Insurance included"
            body="Comprehensive cover on every vehicle."
          />
          <Inclusion
            icon={Gauge}
            title="Free km / day"
            body="Generous daily mileage on every tier."
          />
          <Inclusion
            icon={Sparkles}
            title="Cleaned & sanitised"
            body="Every car detailed before handover."
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Inclusion({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}
