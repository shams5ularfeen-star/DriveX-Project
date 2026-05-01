import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdminLoginForm } from "@/components/admin/admin-login-form"

export const metadata = {
  title: "Admin Access — DriveX Pakistan",
  description: "Restricted admin console login",
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20">
        <AdminLoginForm />
      </div>
      <Footer />
    </main>
  )
}
