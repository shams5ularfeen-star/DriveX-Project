"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getAdminSession } from "@/lib/admin-auth"

/**
 * Global keyboard shortcut to open the Admin Console.
 *
 *   Ctrl + Shift + A    (Windows / Linux)
 *   Cmd  + Shift + A    (macOS)
 *
 * If the admin already has an active session, the shortcut jumps straight
 * to /admin. Otherwise it routes to /admin/login. Mounted once in the
 * root layout so it works on every page without cluttering the visible UI.
 */
export function AdminShortcut() {
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey
      if (!isMod || !e.shiftKey) return
      if (e.key.toLowerCase() !== "a") return
      // Ignore when the user is typing in an input/textarea
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        target?.isContentEditable
      if (isEditable) return

      e.preventDefault()
      const session = getAdminSession()
      if (session) {
        toast.success("Admin shortcut", {
          description: "Opening console — already signed in.",
        })
        router.push("/admin")
      } else {
        toast("Admin access", {
          description: "Sign in to the restricted console.",
        })
        router.push("/admin/login")
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [router])

  return null
}
