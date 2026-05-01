import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CarsExplorer } from "@/components/cars-explorer"
import { Spinner } from "@/components/ui/spinner"

export const metadata = {
  title: "All Cars — DriveX Pakistan",
  description:
    "Browse our full luxury fleet across Pakistan. Filter by city, category, fuel and price.",
}

export default function CarsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <section className="border-b border-border/60 px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            Our fleet
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Drive <span className="text-gold-gradient">anything</span>,
            anywhere.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Every car you see uses its own verified images — no swaps, no
            placeholders. Hover any card to peek at the rear or interior view.
          </p>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Spinner className="h-6 w-6 text-primary" />
          </div>
        }
      >
        <CarsExplorer />
      </Suspense>
      <Footer />
    </main>
  )
}
