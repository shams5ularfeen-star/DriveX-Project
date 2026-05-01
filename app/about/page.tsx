import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Award,
  Crown,
  Gauge,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react"

export const metadata: Metadata = {
  title: "About — DriveX Pakistan",
  description:
    "DriveX Pakistan is the country's premier luxury car rental marketplace. Learn about our mission, values and curated fleet.",
}

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Verified & insured",
    body: "Every car on the platform passes a 50-point inspection and ships with full insurance — no fine print.",
  },
  {
    icon: Crown,
    title: "Curated luxury",
    body: "From everyday hatchbacks to limited-edition exotics, our fleet is hand-picked for premium experiences.",
  },
  {
    icon: HeartHandshake,
    title: "Real human support",
    body: "24/7 concierge desk in Urdu and English. Real humans, real fast — never a bot maze.",
  },
  {
    icon: Zap,
    title: "Instant booking",
    body: "Book in under 60 seconds. Pickup or doorstep delivery in 10 major cities — no calls required.",
  },
]

const STATS = [
  { value: "10+", label: "Cities served" },
  { value: "80+", label: "Cars in fleet" },
  { value: "4.9", label: "Avg. rating" },
  { value: "12k+", label: "Happy renters" },
]

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/about-hero.jpg"
            alt="Luxury car showroom"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Pakistan&apos;s luxury car rental brand
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-balance md:text-5xl lg:text-6xl">
            Driving <span className="text-gold-gradient">Pakistan</span>{" "}
            forward, in style.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
            DriveX Pakistan was built for the new generation of Pakistanis who
            expect more than a car — they expect an experience. Whether
            it&apos;s a wedding entrance in Lahore, a Friday escape to Murree,
            or a corporate roadshow in Karachi, we make luxury accessible.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/cars">Browse the fleet</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent">
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-b border-border/60 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs uppercase tracking-[0.24em] text-primary">
              Our mission
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Make the <span className="text-gold-gradient">extraordinary</span>{" "}
              ordinary.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              We started DriveX after years of frustration with opaque rental
              counters, missing keys, mystery insurance fees and tired vehicles.
              So we rebuilt the entire experience from scratch — with a focus on
              transparency, trust and unmistakably premium cars.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Today, DriveX is the trusted choice for executives, travellers,
              families and grooms across Pakistan&apos;s biggest cities. Our
              fleet ranges from a humble Suzuki Mehran to a Bugatti Veyron — and
              every booking carries the same standard of care.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-primary/20 bg-card p-5"
              >
                <div className="font-display text-3xl font-bold text-primary md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-b border-border/60 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.24em] text-primary">
              What we stand for
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Four <span className="text-gold-gradient">non-negotiables</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IDENTITY */}
      <section className="border-b border-border/60 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <Gauge className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-xl font-semibold">
              Built for speed
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Booking in under a minute. Doorstep delivery in 90 minutes. We
              respect your time more than our margins.
            </p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-transparent p-6">
            <Award className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-xl font-semibold">
              Pakistan&apos;s most awarded
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Featured in TechJuice, ProPakistani, and Dawn — and rated #1 by
              over 12,000 verified renters across the country.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <Star className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-xl font-semibold">
              4.9★ obsessed
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We read every single review. Our drivers are paid bonuses for
              5-star feedback, not for kilometres.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
