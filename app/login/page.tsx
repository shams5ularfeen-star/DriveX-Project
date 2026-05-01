import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/auth/login-form"
import { Spinner } from "@/components/ui/spinner"

export const metadata = {
  title: "Sign in — DriveX Pakistan",
  description: "Sign in to your DriveX account to manage bookings.",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="grid-bg relative px-4 py-16 md:px-6 lg:py-24">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <Spinner className="h-6 w-6 text-primary" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </section>
      <Footer />
    </main>
  )
}
