import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RegisterForm } from "@/components/auth/register-form"
import { Spinner } from "@/components/ui/spinner"

export const metadata = {
  title: "Create account — DriveX Pakistan",
  description: "Sign up for DriveX to book luxury cars across Pakistan.",
}

export default function RegisterPage() {
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
            <RegisterForm />
          </Suspense>
        </div>
      </section>
      <Footer />
    </main>
  )
}
