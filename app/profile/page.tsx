import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProfileDashboard } from "@/components/profile-dashboard"

export const metadata = {
  title: "My Profile · DriveX Pakistan",
  description:
    "View your booking history, order timeline, loyalty tier and personal details.",
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ProfileDashboard />
      <Footer />
    </main>
  )
}
