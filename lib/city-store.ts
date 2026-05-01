"use client"

import { useEffect, useState } from "react"

const CITY_KEY = "drivex_selected_city_v1"

export type City = {
  id: string
  name: string
  region: string
  hub: string
}

export const CITIES: City[] = [
  { id: "islamabad", name: "Islamabad", region: "Capital", hub: "F-7 Markaz" },
  { id: "rawalpindi", name: "Rawalpindi", region: "Punjab", hub: "Saddar" },
  { id: "lahore", name: "Lahore", region: "Punjab", hub: "DHA Phase 5" },
  { id: "karachi", name: "Karachi", region: "Sindh", hub: "Clifton" },
  { id: "faisalabad", name: "Faisalabad", region: "Punjab", hub: "Madina Town" },
  { id: "multan", name: "Multan", region: "Punjab", hub: "Cantt" },
  { id: "peshawar", name: "Peshawar", region: "KPK", hub: "University Town" },
  { id: "quetta", name: "Quetta", region: "Balochistan", hub: "Jinnah Road" },
  { id: "sialkot", name: "Sialkot", region: "Punjab", hub: "Cantt Bazaar" },
  { id: "hyderabad", name: "Hyderabad", region: "Sindh", hub: "Latifabad" },
]

export function getCityById(id: string | null | undefined): City | undefined {
  if (!id) return undefined
  return CITIES.find((c) => c.id === id)
}

type Listener = () => void
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("drivex:city-changed"))
  }
}

export function getSelectedCityId(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(CITY_KEY)
}

export function setSelectedCityId(id: string | null) {
  if (typeof window === "undefined") return
  if (id) window.localStorage.setItem(CITY_KEY, id)
  else window.localStorage.removeItem(CITY_KEY)
  notify()
}

export function useSelectedCity() {
  const [cityId, setCityIdState] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const sync = () => setCityIdState(getSelectedCityId())
    sync()
    setHydrated(true)
    listeners.add(sync)
    window.addEventListener("storage", sync)
    window.addEventListener("drivex:city-changed", sync)
    return () => {
      listeners.delete(sync)
      window.removeEventListener("storage", sync)
      window.removeEventListener("drivex:city-changed", sync)
    }
  }, [])

  return {
    cityId,
    city: getCityById(cityId),
    hydrated,
    setCity: (id: string | null) => setSelectedCityId(id),
  }
}
