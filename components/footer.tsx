import Link from "next/link"
import { Car, Facebook, Instagram, ShieldCheck, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
              <Car className="h-5 w-5 text-primary" />
            </span>
            <span className="font-display text-lg font-bold">
              DriveX <span className="text-primary">Pakistan</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Pakistan&apos;s premier luxury car rental marketplace. Drive
            anything, anytime, anywhere — fully insured and verified.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-foreground" href="/cars">
                Browse cars
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/pricing">
                Pricing
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-foreground" href="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground md:flex-row md:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} DriveX Pakistan. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <span>Drive luxury · Live extraordinary</span>
            <Link
              href="/admin/login"
              aria-label="Admin console access"
              title="Admin access · Ctrl + Shift + A"
              className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-card/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70 opacity-70 transition-all hover:border-primary/40 hover:text-primary hover:opacity-100"
            >
              <ShieldCheck className="h-3 w-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
