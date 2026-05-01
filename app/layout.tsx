import type { Metadata, Viewport } from "next"
import { Poppins, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { AdminShortcut } from "@/components/admin/admin-shortcut"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DriveX Pakistan — Luxury Car Rentals",
  description:
    "Pakistan's #1 ultra-premium car rental platform. Rent luxury, exotic, SUVs and economy cars across Islamabad, Lahore, Karachi and more.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${poppins.variable} ${montserrat.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
        <AdminShortcut />
        <Toaster theme="dark" richColors position="top-right" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
