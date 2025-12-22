import { motion } from "framer-motion"
import { Globe } from "@/components/ui/globe"

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black flex flex-col items-center justify-center transition-colors duration-300 py-20 md:py-0">
      {/* Information Section - Positioned at the top/middle */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 md:-mt-32">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl mb-6 bg-gradient-to-b from-black dark:from-white to-gray-500 bg-clip-text text-transparent font-['Oswald'] uppercase leading-tight">
              Plan Smarter.<br className="md:hidden" /> Travel Better.
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl leading-7 text-gray-600 dark:text-gray-400 max-w-xl mx-auto px-4">
              AI-powered trip planning with budget, route, and food clarity. 
              Experience the world like never before with personalized itineraries.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <button
                className="w-full sm:w-auto rounded-full bg-black dark:bg-white px-10 py-4 text-base font-bold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg"
              >
                Plan My Trip
              </button>
              <button
                className="w-full sm:w-auto text-base font-bold leading-6 text-black dark:text-white cursor-pointer border-2 border-black/20 dark:border-white/20 px-10 py-4 rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/10"
              >
                How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Globe Section - Positioned at the very bottom of the hero section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[300px] sm:max-w-[500px] md:max-w-[800px] aspect-square translate-y-1/2 pointer-events-none opacity-30 md:opacity-40"
      >
        <Globe className="top-0" />
      </motion.div>
    </section>
  )
}
