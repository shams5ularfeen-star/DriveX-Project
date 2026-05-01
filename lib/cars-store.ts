"use client"

import { useEffect, useState } from "react"
import { DEFAULT_CARS, type Car } from "@/lib/cars-data"

const STORAGE_KEY = "drivex_cars_v1"

// ----- pub/sub so components stay in sync across the app ----------------
type Listener = () => void
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }))
  }
}

function readFromStorage(): Car[] {
  if (typeof window === "undefined") return DEFAULT_CARS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CARS
    const parsed = JSON.parse(raw) as Car[]
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CARS
    return parsed
  } catch {
    return DEFAULT_CARS
  }
}

function writeToStorage(cars: Car[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cars))
  notify()
}

// ----- public API --------------------------------------------------------

export function getAllCars(): Car[] {
  return readFromStorage()
}

export function saveCar(car: Car) {
  const cars = readFromStorage()
  const idx = cars.findIndex((c) => c.id === car.id)
  if (idx >= 0) cars[idx] = car
  else cars.push(car)
  writeToStorage(cars)
}

export function deleteCar(id: string) {
  const cars = readFromStorage().filter((c) => c.id !== id)
  writeToStorage(cars)
}

export function resetCars() {
  writeToStorage(DEFAULT_CARS)
}

// ----- React hook --------------------------------------------------------

export function useCars(): Car[] {
  const [cars, setCars] = useState<Car[]>(DEFAULT_CARS)

  useEffect(() => {
    // Hydrate from localStorage on the client
    setCars(readFromStorage())

    const sync = () => setCars(readFromStorage())
    listeners.add(sync)
    window.addEventListener("storage", sync)
    return () => {
      listeners.delete(sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  return cars
}

export function useCar(id: string): Car | undefined {
  const cars = useCars()
  return cars.find((c) => c.id === id)
}
