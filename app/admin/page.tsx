import { AdminPanel } from "@/components/admin-panel"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdminGuard } from "@/components/admin/admin-guard"

export const metadata = {
  title: "Admin Panel — DriveX Pakistan",
  description: "Manage your luxury fleet inventory",
}

export default function AdminPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20">
        <AdminGuard>
          <AdminPanel />
        </AdminGuard>
      </div>
      <Footer />
    </main>
  )
}
