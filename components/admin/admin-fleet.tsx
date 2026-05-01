"use client"

import { useMemo, useState } from "react"
import { useCars, saveCar, deleteCar, resetCars } from "@/lib/cars-store"
import {
  CATEGORIES,
  CITIES,
  type Car,
  type CarCategory,
  type FuelType,
  type Transmission,
} from "@/lib/cars-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pencil,
  Plus,
  Trash2,
  RotateCcw,
  ImageIcon,
  Search,
  Boxes,
  AlertTriangle,
  Package,
  Minus,
} from "lucide-react"
import { toast } from "sonner"
import { CarImage } from "@/components/car-image"
import { useAllBookings } from "@/lib/bookings-store"
import { getCarTotalQuantity, getFleetCapacity, sumBookingQuantity } from "@/lib/availability"
import { cn } from "@/lib/utils"

const FUEL_TYPES: FuelType[] = ["Petrol", "Diesel", "Hybrid", "Electric"]
const TRANSMISSIONS: Transmission[] = ["Manual", "Automatic", "CVT", "DCT"]

function emptyCar(): Car {
  return {
    id: `car-${Date.now()}`,
    name: "",
    model: "",
    category: "Sedan",
    pricePerDay: 0,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 4.8,
    reviews: 0,
    city: "Islamabad",
    description: "",
    frontImage: "",
    featured: false,
  }
}

export function AdminFleet() {
  const cars = useCars()
  const { bookings } = useAllBookings()
  const [editing, setEditing] = useState<Car | null>(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<CarCategory | "all">("all")
  const [isNew, setIsNew] = useState(false)
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all")

  /** Live "booked across all cities" tally per carId */
  const bookedByCar = useMemo(() => {
    const map = new Map<string, number>()
    bookings
      .filter((b) => b.status !== "cancelled")
      .forEach((b) => {
        map.set(b.carId, (map.get(b.carId) ?? 0) + (b.quantity ?? 1))
      })
    return map
  }, [bookings])

  const filtered = cars.filter((c) => {
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false
    if (stockFilter !== "all") {
      const total = getCarTotalQuantity(c) * CITIES.length
      const booked = bookedByCar.get(c.id) ?? 0
      const available = Math.max(0, total - booked)
      if (stockFilter === "out" && available !== 0) return false
      if (stockFilter === "low" && (available === 0 || available > total * 0.2)) return false
    }
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    )
  })

  /** Quick +/- delta on a single car's totalQuantity */
  const adjustQuantity = (car: Car, delta: number) => {
    const current = getCarTotalQuantity(car)
    const next = Math.max(0, current + delta)
    saveCar({ ...car, totalQuantity: next })
    toast.success(`${car.name} → ${next} per city`, {
      description: `Total inventory ${delta > 0 ? "increased" : "reduced"} by ${Math.abs(delta)}.`,
    })
  }

  const openEdit = (car: Car) => {
    setEditing({ ...car })
    setIsNew(false)
    setOpen(true)
  }

  const openNew = () => {
    setEditing(emptyCar())
    setIsNew(true)
    setOpen(true)
  }

  const handleSave = () => {
    if (!editing) return
    if (!editing.name.trim() || !editing.frontImage.trim()) {
      toast.error("Name and Front Image URL are required.")
      return
    }
    saveCar(editing)
    toast.success(isNew ? "Car added to fleet." : "Car updated successfully.")
    setOpen(false)
    setEditing(null)
  }

  const handleDelete = (car: Car) => {
    if (!confirm(`Delete "${car.name}"? This cannot be undone.`)) return
    deleteCar(car.id)
    toast.success(`${car.name} removed from fleet.`)
  }

  const handleReset = () => {
    if (!confirm("Reset all cars to defaults? Custom changes will be lost.")) return
    resetCars()
    toast.success("Fleet restored to defaults.")
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, model, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as CarCategory | "all")}
        >
          <SelectTrigger className="w-full md:w-48">
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
        <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button onClick={openNew} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Car
        </Button>
      </div>

      {/* Stock status filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Stock filter:
        </span>
        <StockPill
          active={stockFilter === "all"}
          onClick={() => setStockFilter("all")}
          tone="neutral"
          icon={<Boxes className="h-3.5 w-3.5" />}
          label="All"
        />
        <StockPill
          active={stockFilter === "low"}
          onClick={() => setStockFilter("low")}
          tone="amber"
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          label="Low stock"
        />
        <StockPill
          active={stockFilter === "out"}
          onClick={() => setStockFilter("out")}
          tone="rose"
          icon={<Package className="h-3.5 w-3.5" />}
          label="Fully booked"
        />
        <span className="ml-auto text-[11px] text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> /{" "}
          {cars.length} cars
        </span>
      </div>

      {/* Header notice */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs text-muted-foreground">
        <span className="font-semibold text-primary">Strict mapping:</span> car images stay
        bound to the car they were assigned to. Editing image URLs is permitted but they remain
        per-car only — never mixed with other models. Use the +/- controls in the
        <span className="font-semibold text-primary"> Stock</span> column to adjust inventory
        per car (per city).
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Car</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="px-4 py-3 font-medium">Price/Day</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Specs</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Images</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((car) => (
                <tr
                  key={car.id}
                  className="border-t border-border hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 rounded-md overflow-hidden bg-secondary/40 flex-shrink-0 border border-border/60">
                        {car.frontImage ? (
                          <CarImage src={car.frontImage} alt={car.name} />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{car.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {car.model} · {car.city}
                          {car.featured && <span className="ml-2 text-primary">★</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    <CategoryBadge category={car.category} />
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">
                    PKR {car.pricePerDay.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StockCell
                      car={car}
                      booked={bookedByCar.get(car.id) ?? 0}
                      onAdjust={(d) => adjustQuantity(car, d)}
                    />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                    {car.fuel} · {car.transmission} · {car.seats} seats
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-1.5 text-[10px] uppercase tracking-wider">
                      <ImgChip on={!!car.frontImage} label="F" />
                      <ImgChip on={!!car.backImage} label="B" />
                      <ImgChip on={!!car.interiorImage} label="I" />
                      <ImgChip on={!!car.sideImage} label="S" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(car)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(car)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    No cars match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {isNew ? "Add New Car" : "Edit Car"}
            </DialogTitle>
            <DialogDescription>
              All fields control how this car appears across the entire platform. Image URLs are
              strictly bound to this car only.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <Field label="Car Name *">
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. BMW 7 Series"
                />
              </Field>
              <Field label="Model">
                <Input
                  value={editing.model}
                  onChange={(e) => setEditing({ ...editing, model: e.target.value })}
                  placeholder="e.g. 740Li 2023"
                />
              </Field>
              <Field label="Category">
                <Select
                  value={editing.category}
                  onValueChange={(v) => setEditing({ ...editing, category: v as CarCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="City">
                <Select
                  value={editing.city}
                  onValueChange={(v) => setEditing({ ...editing, city: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Price per Day (PKR)">
                <Input
                  type="number"
                  value={editing.pricePerDay}
                  onChange={(e) =>
                    setEditing({ ...editing, pricePerDay: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <Field
                label={`Total Quantity (per city — default ${getFleetCapacity(editing.category)})`}
              >
                <Input
                  type="number"
                  min={0}
                  value={editing.totalQuantity ?? ""}
                  placeholder={`${getFleetCapacity(editing.category)}`}
                  onChange={(e) => {
                    const v = e.target.value
                    setEditing({
                      ...editing,
                      totalQuantity: v === "" ? undefined : Math.max(0, Number(v) || 0),
                    })
                  }}
                />
              </Field>
              <Field label="Seats">
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={editing.seats}
                  onChange={(e) =>
                    setEditing({ ...editing, seats: Number(e.target.value) || 1 })
                  }
                />
              </Field>
              <Field label="Fuel">
                <Select
                  value={editing.fuel}
                  onValueChange={(v) => setEditing({ ...editing, fuel: v as FuelType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FUEL_TYPES.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Transmission">
                <Select
                  value={editing.transmission}
                  onValueChange={(v) =>
                    setEditing({ ...editing, transmission: v as Transmission })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSMISSIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Rating (1-5)">
                <Input
                  type="number"
                  step="0.1"
                  min={1}
                  max={5}
                  value={editing.rating}
                  onChange={(e) =>
                    setEditing({ ...editing, rating: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <Field label="Reviews">
                <Input
                  type="number"
                  value={editing.reviews}
                  onChange={(e) =>
                    setEditing({ ...editing, reviews: Number(e.target.value) || 0 })
                  }
                />
              </Field>

              {/* Toggles */}
              <div className="md:col-span-2 grid grid-cols-3 gap-3 rounded-lg border border-border bg-secondary/20 p-4">
                <ToggleField
                  label="A/C"
                  value={editing.ac}
                  onChange={(v) => setEditing({ ...editing, ac: v })}
                />
                <ToggleField
                  label="Insurance"
                  value={editing.insurance}
                  onChange={(v) => setEditing({ ...editing, insurance: v })}
                />
                <ToggleField
                  label="Featured"
                  value={!!editing.featured}
                  onChange={(v) => setEditing({ ...editing, featured: v })}
                />
              </div>

              <div className="md:col-span-2">
                <Field label="Description">
                  <Textarea
                    rows={3}
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Brief description shown on the detail page"
                  />
                </Field>
              </div>

              <div className="md:col-span-2 pt-2">
                <h3 className="font-display text-sm uppercase tracking-[0.2em] text-primary mb-1">
                  Image URLs · Strict Mapping
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  These images are bound to this car only. Front is the default view, the others
                  appear on hover or in dedicated tabs.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <Field label="Front Image URL * (default view)">
                    <Input
                      value={editing.frontImage}
                      onChange={(e) => setEditing({ ...editing, frontImage: e.target.value })}
                      placeholder="https://..."
                    />
                  </Field>
                  <Field label="Back Image URL (shown on hover)">
                    <Input
                      value={editing.backImage || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, backImage: e.target.value || undefined })
                      }
                      placeholder="https://..."
                    />
                  </Field>
                  <Field label="Interior Image URL (separate tab if no back)">
                    <Input
                      value={editing.interiorImage || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, interiorImage: e.target.value || undefined })
                      }
                      placeholder="https://..."
                    />
                  </Field>
                  <Field label="Side Image URL (separate tab fallback)">
                    <Input
                      value={editing.sideImage || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, sideImage: e.target.value || undefined })
                      }
                      placeholder="https://..."
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
        {label}
      </Label>
      {children}
    </div>
  )
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer">
      <span className="text-sm">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </label>
  )
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/60 bg-secondary/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]">
      {category}
    </span>
  )
}

function ImgChip({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={
        "inline-flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold border " +
        (on
          ? "border-primary/60 bg-primary/15 text-primary"
          : "border-border bg-secondary/40 text-muted-foreground/50")
      }
    >
      {label}
    </span>
  )
}

function StockCell({
  car,
  booked,
  onAdjust,
}: {
  car: Car
  booked: number
  onAdjust: (delta: number) => void
}) {
  const total = getCarTotalQuantity(car) * CITIES.length
  const available = Math.max(0, total - booked)
  const pct = total > 0 ? available / total : 0
  const tone = available === 0 ? "rose" : pct < 0.2 ? "amber" : "emerald"
  const toneClass = {
    rose: "text-rose-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
  }[tone]
  return (
    <div className="flex items-center gap-2">
      <div className="leading-tight">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {getCarTotalQuantity(car)} / city
        </div>
        <div className={cn("font-semibold tabular-nums", toneClass)}>
          {available}
          <span className="text-muted-foreground/60"> / {total}</span>
        </div>
        <div className="text-[10px] text-muted-foreground">
          {booked} booked
        </div>
      </div>
      <div className="ml-auto inline-flex flex-col gap-1">
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onAdjust(1)}
          className="grid h-6 w-6 place-items-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onAdjust(-1)}
          disabled={getCarTotalQuantity(car) <= 0}
          className="grid h-6 w-6 place-items-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

function StockPill({
  active,
  onClick,
  tone,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  tone: "neutral" | "amber" | "rose"
  icon: React.ReactNode
  label: string
}) {
  const toneActive = {
    neutral: "border-primary/40 bg-primary/10 text-primary",
    amber: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    rose: "border-rose-500/40 bg-rose-500/10 text-rose-400",
  }[tone]
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? toneActive
          : "border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  )
}
