import { Navbar } from "../components/Navbar"
import { GlobalNetwork } from "../components/GlobalNetwork"
import { DestinationSearch } from "../components/DestinationSearch"
import { Footer } from "../components/Footer"
import { motion } from "framer-motion"

export function Destination() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        {/* Destination Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-8xl font-bold text-black dark:text-white font-oswald uppercase tracking-tighter mb-6">
                Explore the <span className="text-gray-500">World</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Discover thousands of destinations tailored to your preferences.
                From the serene beaches of Bali to the historic streets of Rome,
                our global network connects you to the most breathtaking places on Earth.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="pb-20">
          <GlobalNetwork />
          <DestinationSearch />
        </div>
      </main>
      <Footer />
    </div>
  )
}
