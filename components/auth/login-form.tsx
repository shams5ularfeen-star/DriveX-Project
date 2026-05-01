"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { loginUser } from "@/lib/auth-store"
import { toast } from "sonner"

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get("redirect") || "/cars"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = loginUser({ email, password })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      toast.error("Login failed", { description: result.error })
      return
    }
    toast.success(`Welcome back, ${result.user.name.split(" ")[0]}!`)
    router.push(redirect)
  }

  return (
    <div className="glass gold-glow w-full max-w-md rounded-2xl p-6 md:p-8">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </span>
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to access your DriveX bookings & checkout.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="h-4 w-4" /> Signing in…
            </span>
          ) : (
            "Sign in"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          New to DriveX?{" "}
          <Link
            href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}
