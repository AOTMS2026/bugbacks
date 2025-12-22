import { Navbar } from "../components/Navbar"
import { Hero } from "../components/Hero"
import { HotelPreview } from "../components/HotelPreview"
import { VacationPlans } from "../components/VacationPlans"
import { BlogSection } from "../components/BlogSection"
import { FeaturesSection } from "../components/FeaturesSection"
import { Footer } from "../components/Footer"

export function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HotelPreview />
      <VacationPlans />
      <BlogSection />
      <FeaturesSection />
      <Footer />
    </>
  )
}
