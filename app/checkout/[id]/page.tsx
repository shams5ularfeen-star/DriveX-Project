import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutFlow } from "@/components/checkout-flow"

export const metadata = {
  title: "Checkout — DriveX Pakistan",
  description: "Complete your DriveX booking.",
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <CheckoutFlow carId={id} />
      <Footer />
    </main>
  )
}
