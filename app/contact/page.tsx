import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import {
  Clock,
  Mail,
  MapPin,
  MessagesSquare,
  Phone,
  Sparkles,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Contact — DriveX Pakistan",
  description:
    "Get in touch with the DriveX Pakistan team. 24/7 concierge desk, head office in Islamabad and operations across 10 cities.",
}

const OFFICES = [
  {
    city: "Islamabad — HQ",
    address: "F-7 Markaz, Block 14, Islamabad",
    phone: "+92 51 111 374 893",
    hours: "24/7 concierge",
  },
  {
    city: "Lahore",
    address: "Gulberg III, MM Alam Road, Lahore",
    phone: "+92 42 111 374 893",
    hours: "8 AM – 11 PM",
  },
  {
    city: "Karachi",
    address: "DHA Phase 6, Bukhari Commercial, Karachi",
    phone: "+92 21 111 374 893",
    hours: "8 AM – 11 PM",
  },
]

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-border/60 px-4 pb-10 pt-16 md:px-6 lg:px-8 lg:pb-14 lg:pt-24">
        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            We&apos;d love to hear from you
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-balance md:text-5xl lg:text-6xl">
            Get in <span className="text-gold-gradient">touch</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
            Booking enquiries, partnerships, press, or feedback — our team is
            standing by across three offices and 10 cities.
          </p>
        </div>
      </section>

      {/* Form + map */}
      <section className="px-4 py-14 md:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* Quick contact */}
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Reach us directly
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prefer to talk? Pick the closest channel — we typically respond
              in under 5 minutes during business hours.
            </p>

            <ul className="mt-6 space-y-3">
              <Channel
                icon={Phone}
                label="Phone (24/7)"
                value="+92 51 111 374 893"
                href="tel:+92511113748930"
              />
              <Channel
                icon={Mail}
                label="Email"
                value="hello@drivex.pk"
                href="mailto:hello@drivex.pk"
              />
              <Channel
                icon={MessagesSquare}
                label="WhatsApp"
                value="+92 333 374 8930"
                href="https://wa.me/923333748930"
              />
            </ul>

            <div className="mt-8">
              <h3 className="font-display text-base font-semibold">
                Our offices
              </h3>
              <div className="mt-3 grid gap-3">
                {OFFICES.map((o) => (
                  <div
                    key={o.city}
                    className="rounded-2xl border border-border/60 bg-card p-4"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-[0.18em]">
                        {o.city}
                      </span>
                    </div>
                    <div className="mt-1 text-sm">{o.address}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {o.phone}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {o.hours}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-primary/20 bg-card p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold">Send a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;ll reply within one business day.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="border-t border-border/60 px-4 pb-16 md:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Find us on the map
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Head office, Islamabad — F-7 Markaz.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/60">
            <iframe
              title="DriveX Pakistan office on Google Maps"
              src="https://www.google.com/maps?q=F-7+Markaz+Islamabad+Pakistan&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full grayscale-[60%] contrast-110"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Channel({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  href: string
}) {
  return (
    <li>
      <a
        href={href}
        className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40"
      >
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="font-medium">{value}</div>
        </div>
      </a>
    </li>
  )
}
