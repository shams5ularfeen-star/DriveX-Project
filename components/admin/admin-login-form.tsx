"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, KeyRound, Lock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { loginAdmin, useAdminAuth } from "@/lib/admin-auth"
import { toast } from "sonner"

export function AdminLoginForm() {
  const router = useRouter()
  const { isAdmin, hydrated } = useAdminAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // If already authenticated, send them straight to the dashboard
  useEffect(() => {
    if (hydrated && isAdmin) router.replace("/admin")
  }, [hydrated, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError("Please enter both email and password.")
      return
    }
    setSubmitting(true)
    // Simulated processing delay
    await new Promise((r) => setTimeout(r, 500))
    const result = loginAdmin(email, password)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      toast.error("Unauthorized Access", {
        description: "Invalid admin credentials. Access blocked.",
      })
      return
    }
    toast.success("Admin verified", { description: "Welcome to the console." })
    router.replace("/admin")
  }

  return (
    <section className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12 md:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="glass gold-glow rounded-2xl border border-border/60 bg-card/60 p-8 backdrop-blur">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <span className="text-[10px] uppercase tracking-[0.22em] text-primary">
                Restricted Area
              </span>
              <h1 className="font-display text-2xl font-bold">
                Admin Console
              </h1>
            </div>
          </div>

          <p className="mb-6 text-xs leading-relaxed text-muted-foreground">
            Access is limited to predefined operators. User accounts cannot
            authenticate here. All sign-in attempts are recorded.
          </p>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-xs text-destructive"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-email"
                className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold"
              >
                Admin Email
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@drivex.pk"
                  className="bg-background pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="admin-pass"
                className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-pass"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="bg-background pl-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="h-4 w-4" /> Verifying credentials…
                </span>
              ) : (
                "Sign in to console"
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-2">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-[11px] leading-relaxed text-muted-foreground">
              <div className="mb-1 font-semibold text-primary">
                Demo credentials
              </div>
              <div className="font-mono text-foreground">
                admin@drivex.pk
                <span className="text-muted-foreground"> · </span>
                123456
              </div>
            </div>
            <div className="rounded-lg border border-border/40 bg-card/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
              <div className="mb-1 font-semibold text-foreground">
                How to reach this page
              </div>
              <ul className="space-y-0.5 pl-3">
                <li>
                  Visit{" "}
                  <span className="font-mono text-primary">/admin/login</span>{" "}
                  directly
                </li>
                <li>
                  Click the <span className="font-semibold">Admin</span> link in
                  the page footer
                </li>
                <li>
                  Press{" "}
                  <kbd className="rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                    Ctrl
                  </kbd>{" "}
                  +{" "}
                  <kbd className="rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                    Shift
                  </kbd>{" "}
                  +{" "}
                  <kbd className="rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                    A
                  </kbd>{" "}
                  from anywhere
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
