"use client"

import { useEffect, useState } from "react"

const USERS_KEY = "drivex_users_v1"
const SESSION_KEY = "drivex_session_v1"

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  cnic?: string
  city?: string
  /** lightly hashed password — DEMO ONLY (localStorage cannot be secure) */
  passwordHash: string
  createdAt: string
}

export type Session = {
  userId: string
  email: string
  name: string
  loggedInAt: string
}

type Listener = () => void
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("drivex:auth-changed"))
  }
}

// Tiny non-cryptographic "hash" — sufficient only for this demo
function weakHash(input: string): string {
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) + h + input.charCodeAt(i)
    h = h & 0xffffffff
  }
  return `h${(h >>> 0).toString(36)}-${input.length}`
}

function readUsers(): User[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as User[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: User[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession(): Session | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function writeSession(session: Session | null) {
  if (typeof window === "undefined") return
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    window.localStorage.removeItem(SESSION_KEY)
  }
  notify()
}

// ---- public API ---------------------------------------------------------

export function registerUser(input: {
  name: string
  email: string
  password: string
  phone?: string
  city?: string
}): { ok: true; user: User } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase()
  if (!email || !input.password || !input.name) {
    return { ok: false, error: "Please fill all required fields." }
  }
  if (input.password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." }
  }
  const users = readUsers()
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "An account with this email already exists." }
  }
  const user: User = {
    id: `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.name.trim(),
    email,
    phone: input.phone?.trim(),
    city: input.city,
    passwordHash: weakHash(input.password),
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  writeUsers(users)
  writeSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    loggedInAt: new Date().toISOString(),
  })
  return { ok: true, user }
}

export function loginUser(input: {
  email: string
  password: string
}): { ok: true; user: User } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase()
  const users = readUsers()
  const user = users.find((u) => u.email === email)
  if (!user) return { ok: false, error: "No account found with this email." }
  if (user.passwordHash !== weakHash(input.password)) {
    return { ok: false, error: "Incorrect password." }
  }
  writeSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    loggedInAt: new Date().toISOString(),
  })
  return { ok: true, user }
}

export function logoutUser() {
  writeSession(null)
}

export function updateUserProfile(
  userId: string,
  patch: Partial<Pick<User, "name" | "phone" | "cnic" | "city">>,
): { ok: true; user: User } | { ok: false; error: string } {
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) return { ok: false, error: "User not found." }
  const next: User = {
    ...users[idx],
    ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
    ...(patch.phone !== undefined ? { phone: patch.phone.trim() } : {}),
    ...(patch.cnic !== undefined ? { cnic: patch.cnic.trim() } : {}),
    ...(patch.city !== undefined ? { city: patch.city } : {}),
  }
  users[idx] = next
  writeUsers(users)
  // Refresh the session display name if it changed
  const session = readSession()
  if (session && session.userId === userId) {
    writeSession({ ...session, name: next.name, email: next.email })
  } else {
    notify()
  }
  return { ok: true, user: next }
}

export function getAllUsers(): User[] {
  return readUsers()
}

export function getUserById(userId: string): User | null {
  return readUsers().find((u) => u.id === userId) ?? null
}

export function getSession(): Session | null {
  return readSession()
}

export function getCurrentUser(): User | null {
  const s = readSession()
  if (!s) return null
  return readUsers().find((u) => u.id === s.userId) ?? null
}

// ---- React hook ---------------------------------------------------------

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const sync = () => {
      setSession(readSession())
      setUser(getCurrentUser())
    }
    sync()
    setHydrated(true)
    listeners.add(sync)
    window.addEventListener("storage", sync)
    window.addEventListener("drivex:auth-changed", sync)
    return () => {
      listeners.delete(sync)
      window.removeEventListener("storage", sync)
      window.removeEventListener("drivex:auth-changed", sync)
    }
  }, [])

  return { session, user, hydrated, isAuthenticated: !!session }
}
