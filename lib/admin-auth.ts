"use client"

import { useEffect, useState } from "react"

/**
 * Predefined admin credentials.
 * Demo-only: localStorage cannot be truly secure, but this strictly enforces
 * that no user-registration path can ever gain admin access. Only these
 * credentials grant entry to the admin console.
 */
/**
 * Predefined admin accounts.
 * Demo-only: localStorage cannot be truly secure, but this strictly enforces
 * that no user-registration path can ever gain admin access.
 *
 *   PRIMARY  → admin@drivex.pk · 123456
 *   STRONG   → admin@drivex.pk · DriveX@2026   (back-compat)
 *   OWNER    → owner@drivex.pk · Owner#Premium1
 */
const ADMIN_USERS: { email: string; password: string; name: string }[] = [
  { email: "admin@drivex.pk", password: "123456", name: "DriveX Admin" },
  { email: "admin@drivex.pk", password: "DriveX@2026", name: "DriveX Admin" },
  { email: "owner@drivex.pk", password: "Owner#Premium1", name: "DriveX Owner" },
]

const ADMIN_SESSION_KEY = "drivex_admin_session_v1"

export type AdminSession = {
  email: string
  name: string
  /** ISO timestamp */
  loggedInAt: string
}

type Listener = () => void
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("drivex:admin-auth-changed"))
  }
}

function readSession(): AdminSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY)
    return raw ? (JSON.parse(raw) as AdminSession) : null
  } catch {
    return null
  }
}

function writeSession(session: AdminSession | null) {
  if (typeof window === "undefined") return
  if (session) {
    window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
  } else {
    window.localStorage.removeItem(ADMIN_SESSION_KEY)
  }
  notify()
}

export function loginAdmin(
  email: string,
  password: string,
):
  | { ok: true; session: AdminSession }
  | { ok: false; error: string } {
  const cleanEmail = email.trim().toLowerCase()
  const match = ADMIN_USERS.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password,
  )
  if (!match) {
    return {
      ok: false,
      error: "Unauthorized Access — invalid admin credentials.",
    }
  }
  const session: AdminSession = {
    email: match.email,
    name: match.name,
    loggedInAt: new Date().toISOString(),
  }
  writeSession(session)
  return { ok: true, session }
}

export function logoutAdmin() {
  writeSession(null)
}

export function getAdminSession(): AdminSession | null {
  return readSession()
}

/** React hook to subscribe to admin auth state */
export function useAdminAuth() {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const sync = () => setSession(readSession())
    sync()
    setHydrated(true)
    listeners.add(sync)
    window.addEventListener("storage", sync)
    window.addEventListener("drivex:admin-auth-changed", sync)
    return () => {
      listeners.delete(sync)
      window.removeEventListener("storage", sync)
      window.removeEventListener("drivex:admin-auth-changed", sync)
    }
  }, [])

  return {
    session,
    isAdmin: !!session,
    hydrated,
  }
}
