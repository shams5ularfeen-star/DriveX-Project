import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { SearchBox } from "@/components/search-box"
import { CategoriesGrid } from "@/components/categories-grid"
import { FeaturedCars } from "@/components/featured-cars"
import { CityDriveBanner } from "@/components/city-drive-banner"
import { CitiesSection } from "@/components/cities-section"
import { Footer } from "@/components/footer"
import { Testimonials } from "@/components/testimonials"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection />
      <SearchBox />
      <CategoriesGrid />
      <FeaturedCars />
      <CityDriveBanner />
      <CitiesSection />
      <Testimonials />
      <Footer />
    </main>
  )
}
