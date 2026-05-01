"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Minus,
  Package,
  PartyPopper,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  Ticket,
  Wallet,
  X,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { CarImage } from "@/components/car-image"
import { CityPicker } from "@/components/city-picker"
import { AvailabilityCard } from "@/components/availability-card"
import { useCar } from "@/lib/cars-store"
import { useAuth } from "@/lib/auth-store"
import { useSelectedCity } from "@/lib/city-store"
import {
  addBooking,
  useBookings,
  type Booking,
} from "@/lib/bookings-store"
import {
  computeAvailability,
  daysBetween,
  getCarTotalQuantity,
  toISODate,
} from "@/lib/availability"
import { runDiscountEngine, type DiscountLayer } from "@/lib/discount-engine"
import { useDiscountSettings } from "@/lib/discount-settings"
import { incrementPromoUsage, usePromos } from "@/lib/promos-store"
import { runFeeEngine, type FeeLine } from "@/lib/fees-engine"
import { useFeeSettings } from "@/lib/fees-store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Info, TrendingUp } from "lucide-react"

type PaymentMethod = "card" | "cash" | "jazzcash" | "easypaisa"

/** Multi-stage processing label for the simulated payment delay */
type PaymentStage = "idle" | "validating" | "authorizing" | "saving" | "done"

export function CheckoutFlow({ carId }: { carId: string }) {
  const router = useRouter()
  const car = useCar(carId)
  const { user, hydrated: authHydrated, isAuthenticated } = useAuth()
  const { city, cityId, hydrated: cityHydrated } = useSelectedCity()
  const allBookings = useBookings()

  // ---- gate: redirect to login if not authenticated ----
  useEffect(() => {
    if (!authHydrated) return
    if (!isAuthenticated) {
      const redirect = `/checkout/${carId}`
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`)
    }
  }, [authHydrated, isAuthenticated, carId, router])

  // ---- city gate ----
  const [cityPickerOpen, setCityPickerOpen] = useState(false)
  useEffect(() => {
    if (cityHydrated && !cityId) setCityPickerOpen(true)
  }, [cityHydrated, cityId])

  // ---- booking dates ----
  const today = useMemo(() => toISODate(new Date()), [])
  const tomorrow = useMemo(() => {
    const t = new Date()
    t.setDate(t.getDate() + 1)
    return toISODate(t)
  }, [])
  const [pickupDate, setPickupDate] = useState(today)
  const [returnDate, setReturnDate] = useState(tomorrow)
  const [quantity, setQuantity] = useState(1)
  const days = useMemo(() => daysBetween(pickupDate, returnDate), [pickupDate, returnDate])

  // ---- live inventory for the selected pickup date ----
  const totalQuantity = useMemo(
    () => (car ? getCarTotalQuantity(car) : 0),
    [car],
  )
  const pickupAvailability = useMemo(() => {
    if (!car || !cityId) return null
    return computeAvailability({
      carId: car.id,
      cityId,
      category: car.category,
      dateISO: pickupDate,
      totalQuantity,
      bookings: allBookings,
    })
  }, [car, cityId, pickupDate, totalQuantity, allBookings])
  const maxQty = pickupAvailability?.available ?? totalQuantity

  // Clamp quantity if availability shrinks beneath the selection
  useEffect(() => {
    if (quantity > maxQty && maxQty >= 1) setQuantity(maxQty)
  }, [maxQty, quantity])

  // ---- payment ----
  const [payment, setPayment] = useState<PaymentMethod>("card")
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [walletPhone, setWalletPhone] = useState("")
  const [walletPin, setWalletPin] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [stage, setStage] = useState<PaymentStage>("idle")
  const [confirmed, setConfirmed] = useState<Booking | null>(null)

  // ---- discount engine inputs ----
  const settings = useDiscountSettings()
  const promos = usePromos()
  const feesSettings = useFeeSettings()

  /** Total prior confirmed/completed bookings — drives loyalty + new-user check */
  const userPriorBookingCount = useMemo(() => {
    if (!user) return 0
    return allBookings.filter(
      (b) =>
        b.userId === user.id &&
        (b.status === "confirmed" || b.status === "completed"),
    ).length
  }, [allBookings, user])

  // ---- promo input state ----
  const [promoInput, setPromoInput] = useState("")
  const [appliedPromo, setAppliedPromo] = useState("")
  const [promoBanner, setPromoBanner] = useState<
    | { kind: "ok"; message: string }
    | { kind: "error"; message: string }
    | null
  >(null)

  if (!authHydrated || !car) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <Spinner className="h-6 w-6 text-primary" />
      </section>
    )
  }

  if (!isAuthenticated) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <Spinner className="h-6 w-6 text-primary" />
      </section>
    )
  }

  const subtotal = car.pricePerDay * days * quantity
  const engine = runDiscountEngine({
    subtotal,
    category: car.category,
    quantity,
    pickupDateISO: pickupDate,
    userPriorBookingCount,
    promoCode: appliedPromo,
    settings,
    promos,
  })
  const discountAmount = engine.totalDiscountAmount

  // ---- service & uplift fees (run AFTER discounts on the discounted base) ----
  const taxableBase = Math.max(0, subtotal - discountAmount)
  const fees = runFeeEngine({
    subtotal: taxableBase,
    pricePerDay: car.pricePerDay,
    quantity,
    pickupDateISO: pickupDate,
    returnDateISO: returnDate,
    city: city?.name ?? "",
    category: car.category,
    settings: feesSettings,
  })
  const feeAmount = fees.totalFeeAmount
  const total = engine.finalTotal + feeAmount

  // Build a single human-readable reason summary for the transparency notice
  const feeSummaryReason = fees.lines.map((l) => l.reason).join(" · ")

  /**
   * Apply a promo. We deliberately collapse every failure path
   * (unknown code, expired, deactivated, max-usage hit, category mismatch,
   * minimum-order not met, etc.) into a single opaque message so the UI
   * never reveals which valid codes exist or why they failed — only users
   * who already know a working code can redeem one.
   */
  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    const GENERIC_ERROR = "Invalid or expired promo code"
    if (!code) {
      setPromoBanner({ kind: "error", message: GENERIC_ERROR })
      return
    }
    // Re-run the engine with this code to validate in-context (subtotal/category/etc.)
    const probe = runDiscountEngine({
      subtotal,
      category: car?.category ?? "",
      quantity,
      pickupDateISO: pickupDate,
      userPriorBookingCount,
      promoCode: code,
      settings,
      promos,
    })
    const promoLayer = probe.applied.find((l) => l.source === "promo")
    if (probe.promoError || !promoLayer) {
      setAppliedPromo("")
      setPromoBanner({ kind: "error", message: GENERIC_ERROR })
      return
    }
    setAppliedPromo(code)
    setPromoBanner({
      kind: "ok",
      message: `Code applied — saved PKR ${promoLayer.amount.toLocaleString()}`,
    })
    toast.success("Promo code applied", {
      description: `You saved PKR ${promoLayer.amount.toLocaleString()}`,
    })
  }

  const handleClearPromo = () => {
    setAppliedPromo("")
    setPromoInput("")
    setPromoBanner(null)
  }

  /**
   * Stage-by-stage payment confirmation. Wraps the entire pipeline in
   * try/catch so a storage quota error or runtime exception never leaves
   * the user stuck on a stale spinner. Each stage updates the button label.
   */
  const handleConfirm = async () => {
    if (submitting) return // hard guard against double-submit (button is also disabled)
    if (!user || !car) return

    // ---------- STAGE 1: validate booking inputs ----------
    if (!cityId || !city) {
      toast.error("Please select a city first")
      setCityPickerOpen(true)
      return
    }
    if (!pickupDate || !returnDate) {
      toast.error("Please choose pickup and return dates")
      return
    }
    if (returnDate <= pickupDate) {
      toast.error("Return date must be after pickup date")
      return
    }
    if (quantity < 1) {
      toast.error("Please select at least 1 car")
      return
    }
    if (pickupAvailability && quantity > pickupAvailability.available) {
      toast.error(
        `Only ${pickupAvailability.available} car${pickupAvailability.available === 1 ? "" : "s"} available on pickup date`,
      )
      return
    }

    // ---------- STAGE 2: validate payment-specific fields ----------
    if (payment === "card") {
      const cleanNum = cardNumber.replace(/\s/g, "")
      if (!cardName.trim()) {
        toast.error("Cardholder name is required")
        return
      }
      if (cleanNum.length < 13 || cleanNum.length > 19) {
        toast.error("Please enter a valid card number (13–19 digits)")
        return
      }
      // Expiry must look like MM/YY and not be in the past
      const expMatch = /^(\d{2})\/(\d{2})$/.exec(cardExpiry)
      if (!expMatch) {
        toast.error("Expiry must be in MM/YY format")
        return
      }
      const expMonth = Number(expMatch[1])
      const expYear = 2000 + Number(expMatch[2])
      if (expMonth < 1 || expMonth > 12) {
        toast.error("Invalid expiry month")
        return
      }
      const now = new Date()
      const expEnd = new Date(expYear, expMonth, 0, 23, 59, 59)
      if (expEnd < now) {
        toast.error("Card has expired")
        return
      }
      if (cardCvc.length < 3 || cardCvc.length > 4) {
        toast.error("CVC must be 3 or 4 digits")
        return
      }
    } else if (payment === "jazzcash" || payment === "easypaisa") {
      const cleanPhone = walletPhone.replace(/\D/g, "")
      // Pakistani mobile numbers: 11 digits starting with 03
      if (cleanPhone.length !== 11 || !cleanPhone.startsWith("03")) {
        toast.error(
          `Enter a valid ${payment === "jazzcash" ? "JazzCash" : "EasyPaisa"} mobile number (03XX-XXXXXXX)`,
        )
        return
      }
      if (walletPin.length < 4 || walletPin.length > 6) {
        toast.error("Enter your 4–6 digit wallet PIN")
        return
      }
    }
    // "cash" needs no extra fields — pay-at-pickup

    // ---------- STAGE 3: simulated processing pipeline ----------
    setSubmitting(true)
    try {
      // Stage A — validating
      setStage("validating")
      await new Promise((r) => setTimeout(r, 350))

      // Stage B — authorizing payment (skipped for cash)
      if (payment !== "cash") {
        setStage("authorizing")
        await new Promise((r) => setTimeout(r, 850))
      }

      // Stage C — persist booking to localStorage
      setStage("saving")
      const booking = addBooking({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        userCnic: user.cnic,
        carId: car.id,
        carName: car.name,
        category: car.category,
        cityId,
        cityName: city.name,
        pickupDate,
        returnDate,
        days,
        quantity,
        pricePerDay: car.pricePerDay,
        subtotal,
        discountPct: engine.totalDiscountPct,
        discountAmount,
        promoCode: appliedPromo || undefined,
        discountBreakdown: engine.applied.map((l) => ({
          source: l.source,
          label: l.label,
          pct: l.pct,
          amount: l.amount,
          reason: l.reason,
        })),
        feeAmount,
        feeBreakdown: fees.lines.map((l) => ({
          source: l.source,
          label: l.label,
          pct: l.pct,
          amount: l.amount,
          reason: l.reason,
          daysApplied: l.daysApplied,
        })),
        total,
        paymentMethod: payment,
      })

      // Increment promo usage counter for analytics (admin sees this live)
      if (appliedPromo) {
        try {
          incrementPromoUsage(appliedPromo)
        } catch (promoErr) {
          // Non-fatal — booking is already saved, just log for debug
          console.log("[v0] promo usage increment failed:", promoErr)
        }
      }

      setStage("done")
      setConfirmed(booking)
      toast.success(`Order #${booking.orderNumber} placed`, {
        description: `${car.name} reserved in ${city.name}. Awaiting admin approval.`,
      })
    } catch (err) {
      console.log("[v0] Checkout failed:", err)
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while saving your booking. Please try again."
      toast.error("Payment could not be completed", { description: message })
    } finally {
      // Always release the lock — even on success — so retry works after errors
      setSubmitting(false)
      setStage("idle")
    }
  }

  if (confirmed) {
    return <ConfirmedView booking={confirmed} />
  }

  return (
    <section className="px-4 py-10 md:px-6 lg:px-8 lg:py-14">
      <CityPicker
        open={cityPickerOpen}
        onOpenChange={setCityPickerOpen}
        dismissible={!!cityId}
        title="Select your pickup city"
        description="All 83 cars are available in every city — your selected city determines live availability and pickup hub."
      />

      <div className="mx-auto max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 h-9 gap-1 px-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to car
        </Button>

        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            Secure Checkout
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">
            Confirm your booking
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review your trip, apply your loyalty discount, and pay securely.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* LEFT — sections */}
          <div className="space-y-6">
            {/* Trip details */}
            <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
              <SectionHeader
                icon={<Calendar className="h-4 w-4" />}
                title="Trip details"
                step={1}
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="pickup">Pickup date</Label>
                  <Input
                    id="pickup"
                    type="date"
                    min={today}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="return">Return date</Label>
                  <Input
                    id="return"
                    type="date"
                    min={pickupDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Pickup city:</span>
                  <span className="font-semibold">
                    {city ? `${city.name} · ${city.hub}` : "Not selected"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCityPickerOpen(true)}
                  className="ml-auto h-7 border-border/60 bg-transparent text-xs"
                >
                  Change
                </Button>
              </div>

              {/* Quantity selector */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/25">
                    <Package className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">Cars to reserve</div>
                    <div className="text-[11px] text-muted-foreground">
                      {cityId
                        ? `${maxQty} available on ${pickupDate}`
                        : "Select a city to see live stock"}
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background p-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="grid h-7 w-7 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-8 text-center font-display text-base font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity((q) => Math.min(maxQty || 1, q + 1))
                    }
                    disabled={!cityId || quantity >= maxQty}
                    className="grid h-7 w-7 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3-day live availability */}
            {cityId && (
              <AvailabilityCard
                carId={car.id}
                category={car.category}
                cityId={cityId}
                totalQuantity={totalQuantity}
              />
            )}

            {/* Customer */}
            <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
              <SectionHeader
                icon={<BadgeCheck className="h-4 w-4" />}
                title="Customer details"
                step={2}
              />
              {user ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Field label="Full name" value={user.name} />
                  <Field label="Email" value={user.email} />
                  <Field label="Phone" value={user.phone || "—"} />
                  <Field
                    label="Loyalty bookings"
                    value={`${userPriorBookingCount} confirmed`}
                  />
                </div>
              ) : null}
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
              <SectionHeader
                icon={<CreditCard className="h-4 w-4" />}
                title="Payment method"
                step={3}
              />

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <PaymentOption
                  active={payment === "card"}
                  onClick={() => setPayment("card")}
                  icon={<CreditCard className="h-4 w-4" />}
                  label="Card"
                  hint="Visa / MasterCard"
                  disabled={submitting}
                />
                <PaymentOption
                  active={payment === "jazzcash"}
                  onClick={() => setPayment("jazzcash")}
                  icon={<Wallet className="h-4 w-4" />}
                  label="JazzCash"
                  hint="Mobile wallet"
                  disabled={submitting}
                />
                <PaymentOption
                  active={payment === "easypaisa"}
                  onClick={() => setPayment("easypaisa")}
                  icon={<Wallet className="h-4 w-4" />}
                  label="EasyPaisa"
                  hint="Mobile wallet"
                  disabled={submitting}
                />
                <PaymentOption
                  active={payment === "cash"}
                  onClick={() => setPayment("cash")}
                  icon={<BadgeCheck className="h-4 w-4" />}
                  label="Pay at pickup"
                  hint="Cash / on-site"
                  disabled={submitting}
                />
              </div>

              {payment === "card" && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="cn">Cardholder name</Label>
                    <Input
                      id="cn"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="As printed on card"
                      disabled={submitting}
                      autoComplete="cc-name"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="cnum">Card number</Label>
                    <Input
                      id="cnum"
                      inputMode="numeric"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value
                            .replace(/\D/g, "")
                            .replace(/(\d{4})(?=\d)/g, "$1 "),
                        )
                      }
                      placeholder="0000 0000 0000 0000"
                      disabled={submitting}
                      autoComplete="cc-number"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cexp">Expiry</Label>
                    <Input
                      id="cexp"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 4)
                        setCardExpiry(
                          v.length >= 3 ? `${v.slice(0, 2)}/${v.slice(2)}` : v,
                        )
                      }}
                      placeholder="MM/YY"
                      disabled={submitting}
                      autoComplete="cc-exp"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      inputMode="numeric"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) =>
                        setCardCvc(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="123"
                      disabled={submitting}
                      autoComplete="cc-csc"
                    />
                  </div>
                </div>
              )}

              {(payment === "jazzcash" || payment === "easypaisa") && (
                <div className="mt-4 space-y-3">
                  <div
                    className={cn(
                      "rounded-xl border p-3 text-[11px] leading-relaxed",
                      payment === "jazzcash"
                        ? "border-rose-500/30 bg-rose-500/5 text-rose-300"
                        : "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
                    )}
                  >
                    <span className="font-semibold">
                      {payment === "jazzcash" ? "JazzCash" : "EasyPaisa"} simulated
                      checkout —
                    </span>{" "}
                    enter your registered mobile number and PIN. We&apos;ll send
                    a confirmation prompt to your wallet on submit.
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="wphone">Mobile number</Label>
                      <Input
                        id="wphone"
                        inputMode="numeric"
                        maxLength={12}
                        value={walletPhone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 11)
                          setWalletPhone(
                            v.length > 4 ? `${v.slice(0, 4)}-${v.slice(4)}` : v,
                          )
                        }}
                        placeholder="0300-1234567"
                        disabled={submitting}
                        autoComplete="tel-national"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="wpin">Wallet PIN</Label>
                      <Input
                        id="wpin"
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={walletPin}
                        onChange={(e) =>
                          setWalletPin(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="••••"
                        disabled={submitting}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              )}

              {payment === "cash" && (
                <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-[11px] leading-relaxed text-amber-300">
                  <span className="font-semibold">Pay at pickup —</span> bring
                  exact cash or a card to the pickup location. Booking will be
                  held as <span className="font-semibold">Pending</span> until
                  confirmed by our team.
                </div>
              )}

              <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Lock className="h-3 w-3" /> This is a demo checkout — no real
                card data is stored.
              </p>
            </div>
          </div>

          {/* RIGHT — Summary */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="glass gold-glow overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10]">
                <CarImage src={car.frontImage} alt={car.name} />
                <span className="absolute left-3 top-3 rounded-full border border-primary/30 bg-background/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary backdrop-blur">
                  {car.category}
                </span>
              </div>
              <div className="p-5">
                <div className="font-display text-lg font-bold leading-tight">
                  {car.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {car.model} · {car.transmission} · {car.fuel}
                </div>

                <div className="mt-5 space-y-2 text-sm">
                  {/* Base price line — always shows the unmodified daily rate */}
                  <Row
                    label={
                      <span>
                        <span className="text-foreground">Base price</span>
                        <span className="ml-1.5 text-[10px] text-muted-foreground">
                          PKR {car.pricePerDay.toLocaleString()} × {days} day
                          {days > 1 ? "s" : ""}
                          {quantity > 1 ? ` × ${quantity} cars` : ""}
                        </span>
                      </span>
                    }
                    value={`PKR ${subtotal.toLocaleString()}`}
                  />

                  {/* Per-layer discount breakdown — renders smoothly in order */}
                  {engine.applied.map((layer) => (
                    <DiscountLine key={layer.source + layer.label} layer={layer} />
                  ))}

                  {/* Subtotal divider — only when both discounts and fees exist for clarity */}
                  {discountAmount > 0 && fees.lines.length > 0 && (
                    <div className="flex items-center justify-between border-t border-border/40 pt-2 text-xs text-muted-foreground">
                      <span>Subtotal after discount</span>
                      <span className="tabular-nums">
                        PKR {taxableBase.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Per-layer fee breakdown — gold accent, dynamic */}
                  {fees.lines.map((fee) => (
                    <FeeRow key={fee.source + fee.label} fee={fee} />
                  ))}

                  {/* Total + savings highlight */}
                  <div className="flex items-end justify-between border-t border-border/60 pt-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Total</span>
                      {(discountAmount > 0 || feeAmount > 0) && (
                        <span className="text-[10px] text-muted-foreground">
                          {discountAmount > 0 && (
                            <span className="text-emerald-300">
                              −PKR {discountAmount.toLocaleString()}
                            </span>
                          )}
                          {discountAmount > 0 && feeAmount > 0 && (
                            <span className="mx-1">·</span>
                          )}
                          {feeAmount > 0 && (
                            <span className="text-primary">
                              +PKR {feeAmount.toLocaleString()} fees
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <span
                      key={total /* re-mounts on change to retrigger animation */}
                      className="font-display text-2xl font-bold leading-none text-primary animate-in fade-in zoom-in-95 duration-300"
                    >
                      PKR {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Fee transparency notice — surfaces only when fees are applied */}
                {feeAmount > 0 && (
                  <div
                    key={feeAmount}
                    className="mt-3 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-primary animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <div className="leading-tight">
                      <div className="text-[11px] font-semibold uppercase tracking-wider">
                        +PKR {feeAmount.toLocaleString()} additional charges
                      </div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        {feeSummaryReason}
                      </div>
                    </div>
                  </div>
                )}

                {/* Savings celebration */}
                {discountAmount > 0 && (
                  <div
                    key={discountAmount}
                    className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-emerald-300 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <PartyPopper className="h-4 w-4 shrink-0" />
                    <div className="leading-tight">
                      <div className="text-sm font-semibold">
                        You saved PKR {discountAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider opacity-80">
                        {engine.bestDealLabel ?? "Best deal applied automatically"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Promo code input */}
                <div className="mt-3 rounded-xl border border-border/60 bg-secondary/30 p-3">
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <Ticket className="h-3.5 w-3.5 text-primary" />
                    Have a promo code?
                  </div>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <span className="font-mono text-sm font-bold text-primary">
                          {appliedPromo}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Applied
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove promo"
                        onClick={handleClearPromo}
                        className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-rose-500/15 hover:text-rose-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-stretch gap-2">
                      <Input
                        value={promoInput}
                        onChange={(e) =>
                          setPromoInput(
                            e.target.value.toUpperCase().replace(/\s/g, ""),
                          )
                        }
                        placeholder="Enter Promo Code"
                        aria-label="Promo code"
                        className="h-9 font-mono uppercase tracking-wider placeholder:font-sans placeholder:tracking-normal placeholder:normal-case placeholder:text-muted-foreground/70"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleApplyPromo()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleApplyPromo}
                        className="group h-9 shrink-0 border border-primary/50 bg-primary/15 text-primary shadow-[0_0_0_0_rgba(212,175,55,0)] transition-all duration-300 hover:bg-primary/25 hover:shadow-[0_0_18px_-2px_rgba(212,175,55,0.55)] active:scale-[0.97]"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                  {promoBanner && (
                    <p
                      className={cn(
                        "mt-2 text-[11px] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200",
                        promoBanner.kind === "ok"
                          ? "text-emerald-300"
                          : "text-rose-400",
                      )}
                    >
                      {promoBanner.message}
                    </p>
                  )}
                </div>

                {/* Stacking-cap notice */}
                {engine.rejected.length > 0 && (
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    <Tag className="mr-1 inline h-3 w-3" />
                    Best {settings.maxAutoLayers} automatic discounts applied —{" "}
                    {engine.rejected.length} other offer
                    {engine.rejected.length === 1 ? "" : "s"} skipped to keep
                    pricing fair.
                  </p>
                )}

                <Button
                  size="lg"
                  onClick={handleConfirm}
                  disabled={submitting || !cityId}
                  aria-busy={submitting}
                  className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-100 disabled:cursor-progress"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      {stage === "validating" && "Validating details…"}
                      {stage === "authorizing" &&
                        (payment === "card"
                          ? "Authorizing card…"
                          : payment === "jazzcash"
                            ? "Sending JazzCash prompt…"
                            : payment === "easypaisa"
                              ? "Sending EasyPaisa prompt…"
                              : "Processing…")}
                      {stage === "saving" && "Saving booking…"}
                      {stage === "done" && "Confirmed"}
                      {stage === "idle" && "Processing…"}
                    </span>
                  ) : (
                    `Pay Now — PKR ${total.toLocaleString()}`
                  )}
                </Button>

                {!cityId && (
                  <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-amber-500">
                    <AlertTriangle className="h-3 w-3" />
                    Select a city to continue
                  </p>
                )}

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  256-bit SSL · Money-back guarantee
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

// ---- Subcomponents -----------------------------------------------------

function SectionHeader({
  icon,
  title,
  step,
}: {
  icon: React.ReactNode
  title: string
  step: number
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
        {icon}
      </span>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Step {step}
        </div>
        <div className="text-base font-semibold">{title}</div>
      </div>
    </div>
  )
}

function PaymentOption({
  active,
  onClick,
  icon,
  label,
  hint,
  disabled = false,
  }: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  hint: string
  disabled?: boolean
  }) {
  return (
  <button
  type="button"
  onClick={onClick}
  disabled={disabled}
  className={cn(
  "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all",
  active
  ? "border-primary bg-primary/10 ring-1 ring-primary/40"
  : "border-border/60 bg-card/40 hover:border-primary/30",
  disabled && "cursor-not-allowed opacity-50",
  )}
  >
      <div className="flex items-center gap-2 text-primary">{icon}</div>
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {hint}
      </div>
    </button>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/20 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}

function DiscountLine({ layer }: { layer: DiscountLayer }) {
  const sourceConfig: Record<
    DiscountLayer["source"],
    { icon: React.ReactNode; tone: string }
  > = {
    loyalty: {
      icon: <BadgeCheck className="h-3.5 w-3.5" />,
      tone: "text-amber-300",
    },
    bulk: {
      icon: <Package className="h-3.5 w-3.5" />,
      tone: "text-sky-300",
    },
    category: {
      icon: <Tag className="h-3.5 w-3.5" />,
      tone: "text-purple-300",
    },
    seasonal: {
      icon: <Sparkles className="h-3.5 w-3.5" />,
      tone: "text-rose-300",
    },
    promo: {
      icon: <Ticket className="h-3.5 w-3.5" />,
      tone: "text-emerald-300",
    },
  }
  const cfg = sourceConfig[layer.source]
  return (
    <div className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-right-2 duration-200">
      <span className={cn("inline-flex items-center gap-1.5", cfg.tone)}>
        {cfg.icon}
        {layer.label}
      </span>
      <span className={cn("font-semibold tabular-nums", cfg.tone)}>
        − PKR {layer.amount.toLocaleString()}
      </span>
    </div>
  )
}

function FeeRow({ fee }: { fee: FeeLine }) {
  const sourceConfig: Record<
    FeeLine["source"],
    { icon: React.ReactNode; tooltip: string }
  > = {
    service: {
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      tooltip: "Platform service fee — covers insurance, support and roadside assistance",
    },
    weekend: {
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      tooltip: "Additional charges applied due to high-demand period (weekend)",
    },
    holiday: {
      icon: <Sparkles className="h-3.5 w-3.5" />,
      tooltip: "Additional charges applied due to peak holiday season",
    },
  }
  const cfg = sourceConfig[fee.source]
  return (
    <div className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-right-2 duration-200">
      <span
        className="inline-flex items-center gap-1.5 text-primary"
        title={cfg.tooltip}
      >
        {cfg.icon}
        {fee.label}
        <Info
          className="h-3 w-3 text-muted-foreground/60"
          aria-label={cfg.tooltip}
        />
      </span>
      <span className="font-semibold tabular-nums text-primary">
        + PKR {fee.amount.toLocaleString()}
      </span>
    </div>
  )
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: React.ReactNode
  value: React.ReactNode
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={cn("text-muted-foreground", strong && "text-foreground")}>
        {label}
      </span>
      <span className={cn(strong && "font-semibold text-primary")}>
        {value}
      </span>
    </div>
  )
}

// ---- Confirmation view --------------------------------------------------

function ConfirmedView({ booking }: { booking: Booking }) {
  const methodLabel =
    booking.paymentMethod === "card"
      ? "Card"
      : booking.paymentMethod === "jazzcash"
        ? "JazzCash"
        : booking.paymentMethod === "easypaisa"
          ? "EasyPaisa"
          : booking.paymentMethod === "cash"
            ? "Pay at pickup"
            : "Mobile wallet"

  return (
    <section className="relative overflow-hidden px-4 py-16 md:px-6 lg:px-8 lg:py-24">
      {/* Decorative celebration sparkles — fixed positions, animated */}
      <ConfettiBurst />

      <div className="relative mx-auto max-w-2xl">
        <div className="glass gold-glow rounded-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-500">
          {/* Animated success ring */}
          <span className="relative mx-auto mb-4 grid h-16 w-16 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-primary/15 ring-1 ring-primary/40">
              <CheckCircle2 className="h-8 w-8 text-primary animate-in zoom-in-50 duration-500" />
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            {booking.status === "pending"
              ? "Pending admin approval"
              : booking.status === "confirmed"
                ? "Confirmed"
                : booking.status}
          </span>

          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            Payment successful!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Order Number</p>
          <p className="font-display text-4xl font-bold tracking-[0.05em] text-gold-shimmer animate-in fade-in slide-in-from-bottom-2 duration-700">
            #{booking.orderNumber}
          </p>

          <div className="mt-6 grid gap-3 text-left text-sm sm:grid-cols-2">
            <Field
              label="Car"
              value={`${booking.carName}${(booking.quantity ?? 1) > 1 ? ` × ${booking.quantity}` : ""}`}
            />
            <Field label="City" value={booking.cityName} />
            <Field label="Pickup" value={booking.pickupDate} />
            <Field label="Return" value={booking.returnDate} />
            <Field label="Days" value={`${booking.days}`} />
            <Field label="Payment" value={methodLabel} />
          </div>

          {/* Price breakdown — base + savings + fees + total */}
          <div className="mt-6 rounded-xl border border-border/60 bg-secondary/30 p-4 text-left text-sm">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Price breakdown
            </div>
            <div className="space-y-1.5">
              <Row
                label="Base price"
                value={`PKR ${booking.subtotal.toLocaleString()}`}
              />
              {booking.discountAmount > 0 && (
                <Row
                  label={`Discount${booking.promoCode ? ` (${booking.promoCode})` : ""}`}
                  value={`− PKR ${booking.discountAmount.toLocaleString()}`}
                />
              )}
              {(booking.feeAmount ?? 0) > 0 && (
                <Row
                  label="Service & uplift fees"
                  value={`+ PKR ${(booking.feeAmount ?? 0).toLocaleString()}`}
                />
              )}
              <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2">
                <span className="font-semibold">Total paid</span>
                <span className="font-display text-xl font-bold text-primary">
                  PKR {booking.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/profile">View my orders</Link>
            </Button>
            <Button asChild variant="outline" className="border-border/60 bg-transparent">
              <Link href="/cars">Browse more cars</Link>
            </Button>
          </div>

          <p className="mt-4 text-[11px] text-muted-foreground">
            A confirmation email has been queued. You can track this order from
            your profile at any time.
          </p>
        </div>
      </div>
    </section>
  )
}

/** Lightweight CSS-only confetti burst — 18 particles falling with random delays */
function ConfettiBurst() {
  const particles = Array.from({ length: 18 }, (_, i) => i)
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {particles.map((i) => {
        const left = (i * 53) % 100 // pseudo-random horizontal spread
        const delay = (i * 137) % 900 // ms
        const dur = 1400 + ((i * 71) % 800) // ms
        const colors = [
          "bg-primary",
          "bg-emerald-400",
          "bg-rose-400",
          "bg-sky-400",
          "bg-amber-300",
        ]
        const color = colors[i % colors.length]
        return (
          <span
            key={i}
            className={cn(
              "absolute top-0 h-2 w-2 rounded-sm opacity-90",
              color,
            )}
            style={{
              left: `${left}%`,
              animation: `confetti-fall ${dur}ms ease-in ${delay}ms 1 forwards`,
              transform: "translateY(-20px) rotate(0deg)",
            }}
          />
        )
      })}
      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
