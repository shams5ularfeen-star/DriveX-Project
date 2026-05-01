import { Star } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Ahmed Raza",
    city: "Lahore",
    rating: 5,
    text: "Booked the BMW 7 Series for a wedding event — flawless service, gorgeous condition. DriveX is the real deal.",
    avatar:
      "https://api.dicebear.com/7.x/personas/svg?seed=AhmedRaza&backgroundColor=ffd5dc",
  },
  {
    name: "Hina Tariq",
    city: "Islamabad",
    rating: 5,
    text: "Daily commute solved with the Honda Civic. Clean car, easy app, transparent pricing — exactly what I needed.",
    avatar:
      "https://api.dicebear.com/7.x/personas/svg?seed=HinaTariq&backgroundColor=b6e3f4",
  },
  {
    name: "Zubair Khan",
    city: "Karachi",
    rating: 5,
    text: "Took the Toyota Fortuner up to Skardu. Insurance, paperwork, and pickup — all handled in minutes. Highly recommended.",
    avatar:
      "https://api.dicebear.com/7.x/personas/svg?seed=ZubairKhan&backgroundColor=c0aede",
  },
]

export function Testimonials() {
  return (
    <section className="border-t border-border/60 px-4 py-16 md:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            Real reviews
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Loved by <span className="text-gold-gradient">3,200+ drivers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-3 border-t border-border/60 pt-4">
                <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-secondary ring-1 ring-primary/30">
                  <img
                    src={t.avatar || "/placeholder.svg"}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">{t.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {t.city}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
