"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Car, Crown, LogOut, MapPin, Menu, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth, logoutUser } from "@/lib/auth-store"
import { useSelectedCity } from "@/lib/city-store"
import { CityPicker } from "@/components/city-picker"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const { city } = useSelectedCity()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = () => {
    logoutUser()
    toast.success("Signed out")
    router.push("/")
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2"
            aria-label="DriveX Pakistan home"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
              <Car
                className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-[-4deg]"
                strokeWidth={2.2}
              />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-bold tracking-tight text-foreground">
                DriveX <span className="text-primary">Pakistan</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Luxury rentals
              </span>
            </div>
          </Link>

          {/* Center nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px] shadow-primary" />
                  )}
                </Link>
              )
            })}

            {/* GOLDEN PREMIUM TAB — last item with glow */}
            <Link
              href="/pricing#premium"
              className="group relative ml-2 inline-flex items-center gap-1.5 rounded-full border border-primary/60 bg-gradient-to-r from-primary/15 via-primary/25 to-primary/15 px-4 py-1.5 text-sm font-semibold text-primary-foreground/95 transition-all hover:scale-[1.03] animate-gold-pulse"
            >
              <Crown className="h-3.5 w-3.5 text-primary drop-shadow-[0_0_6px_currentColor]" />
              <span className="text-gold-shimmer font-semibold tracking-wide">
                Premium
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 35%, transparent), transparent 70%)",
                }}
              />
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden items-center gap-2 md:flex">
            {/* City pill */}
            <button
              type="button"
              onClick={() => setCityOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:border-primary/40 hover:text-foreground"
              aria-label="Change city"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {city ? city.name : "Select city"}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10"
                >
                  <User className="h-3.5 w-3.5 text-primary" />
                  {user.name.split(" ")[0]}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-9 text-foreground/80 hover:text-foreground"
                >
                  <LogOut className="mr-1 h-4 w-4" /> Sign out
                </Button>
              </div>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-foreground/80 hover:text-foreground"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-md border border-border/60 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col p-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setCityOpen(true)
                }}
                className="mb-2 flex items-center justify-between rounded-md border border-border/60 bg-secondary/30 px-3 py-3 text-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {city ? city.name : "Select your city"}
                </span>
                <span className="text-xs text-muted-foreground">Change</span>
              </button>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-sm font-medium text-foreground/90 hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile premium link */}
              <Link
                href="/pricing#premium"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-3 text-sm font-semibold animate-gold-pulse"
              >
                <Crown className="h-4 w-4 text-primary" />
                <span className="text-gold-shimmer">Premium tier</span>
              </Link>

              <div className="mt-3 flex gap-2 border-t border-border/60 pt-3">
                {isAuthenticated && user ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout()
                      setOpen(false)
                    }}
                    className="flex-1 bg-transparent"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign out ({user.name.split(" ")[0]})
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="flex-1 bg-primary text-primary-foreground"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <CityPicker
        open={cityOpen}
        onOpenChange={setCityOpen}
        title="Select your city"
      />
    </>
  )
}
