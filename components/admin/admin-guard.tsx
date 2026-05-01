"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { useAdminAuth } from "@/lib/admin-auth"

/**
 * Hard-locks the admin console: until a verified admin session is hydrated,
 * nothing is rendered. Unauthenticated visitors are silently redirected to
 * the admin login route — the panel itself is never momentarily visible.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAdmin, hydrated } = useAdminAuth()

  useEffect(() => {
    if (!hydrated) return
    if (!isAdmin) router.replace("/admin/login")
  }, [hydrated, isAdmin, router])

  if (!hydrated || !isAdmin) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <Spinner className="h-6 w-6 text-primary" />
      </section>
    )
  }
  return <>{children}</>
}
