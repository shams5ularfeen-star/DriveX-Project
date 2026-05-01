"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Calendar, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CITIES } from "@/lib/cars-data"

export function SearchBox() {
  const router = useRouter()
  const [pickupCity, setPickupCity] = useState<string>("Islamabad")
  const [dropCity, setDropCity] = useState<string>("Islamabad")
  const [pickupDate, setPickupDate] = useState<string>("")
  const [dropDate, setDropDate] = useState<string>("")

  const onSearch = () => {
    const params = new URLSearchParams()
    if (pickupCity) params.set("city", pickupCity)
    router.push(`/cars?${params.toString()}`)
  }

  return (
    <section className="relative -mt-6 px-4 md:-mt-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass gold-glow-hover rounded-2xl p-3 md:p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-2">
            <Field
              label="Pickup city"
              icon={<MapPin className="h-4 w-4" />}
              className="md:col-span-3"
            >
              <Select value={pickupCity} onValueChange={setPickupCity}>
                <SelectTrigger className="h-11 border-0 bg-transparent shadow-none">
                  <SelectValue placeholder="Select city" />
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
            <Field
              label="Drop city"
              icon={<MapPin className="h-4 w-4" />}
              className="md:col-span-3"
            >
              <Select value={dropCity} onValueChange={setDropCity}>
                <SelectTrigger className="h-11 border-0 bg-transparent shadow-none">
                  <SelectValue placeholder="Select city" />
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
            <Field
              label="Pickup"
              icon={<Calendar className="h-4 w-4" />}
              className="md:col-span-2"
            >
              <Input
                type="datetime-local"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="h-11 border-0 bg-transparent shadow-none"
              />
            </Field>
            <Field
              label="Return"
              icon={<Calendar className="h-4 w-4" />}
              className="md:col-span-2"
            >
              <Input
                type="datetime-local"
                value={dropDate}
                onChange={(e) => setDropDate(e.target.value)}
                className="h-11 border-0 bg-transparent shadow-none"
              />
            </Field>
            <div className="md:col-span-2">
              <Button
                onClick={onSearch}
                className="h-full min-h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  icon,
  className,
  children,
}: {
  label: string
  icon: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-xl border border-border/40 bg-secondary/30 px-3 py-2 transition-colors hover:border-primary/30 ${className ?? ""}`}
    >
      <Label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </Label>
      <div className="mt-0.5">{children}</div>
    </div>
  )
}
