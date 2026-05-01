"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const TOPICS = [
  "Booking enquiry",
  "Corporate / fleet partnership",
  "Wedding package",
  "Press & media",
  "Feedback",
  "Other",
]

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast.error("Please fill out all required fields")
      return
    }

    setLoading(true)
    // Simulated submission — wire to API later
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success("Message sent — we'll get back to you within 1 business day.")
    }, 800)
  }

  if (submitted) {
    return (
      <div className="mt-6 flex flex-col items-center rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold">Message received</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Thanks {name.split(" ")[0]} — our concierge desk will reach out to{" "}
          <span className="text-foreground">{email}</span> shortly.
        </p>
        <Button
          variant="outline"
          className="mt-5 bg-transparent"
          onClick={() => {
            setSubmitted(false)
            setName("")
            setEmail("")
            setPhone("")
            setMessage("")
          }}
        >
          Send another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cf-name" className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            Full name *
          </Label>
          <Input
            id="cf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ali Khan"
            required
          />
        </div>
        <div>
          <Label htmlFor="cf-email" className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            Email *
          </Label>
          <Input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ali@example.com"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cf-phone" className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            Phone (optional)
          </Label>
          <Input
            id="cf-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 333 1234567"
          />
        </div>
        <div>
          <Label className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            Topic
          </Label>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="cf-msg" className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
          Message *
        </Label>
        <Textarea
          id="cf-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your trip, the car you have in mind, or any specific requirements..."
          rows={5}
          required
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? (
          "Sending…"
        ) : (
          <>
            Send message <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground">
        By submitting this form you agree to our privacy policy. We never share
        your information with third parties.
      </p>
    </form>
  )
}
