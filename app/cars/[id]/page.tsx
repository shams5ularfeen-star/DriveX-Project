import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CarDetail } from "@/components/car-detail"

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <CarDetail carId={id} />
      <Footer />
    </main>
  )
}
