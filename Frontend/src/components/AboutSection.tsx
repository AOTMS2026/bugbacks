import { motion } from "framer-motion"
import { Compass, Shield, Users } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white dark:bg-black">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3">About Us</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 leading-tight">
              Redefining the Way You Experience the World.
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              At Bag Pack Tours, our mission is to eliminate the stress of trip planning. We believe travel should be about the adventure, the food, and the memories—not the dozens of spreadsheets and browser tabs it usually takes to get there.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 text-black dark:text-white">Smart Exploration</h4>
                  <p className="text-gray-600 dark:text-gray-400">Discover hidden gems and local favorites curated by artificial intelligence based on your unique tastes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 text-black dark:text-white">Reliable & Transparent</h4>
                  <p className="text-gray-600 dark:text-gray-400">Get honest cost breakdowns and realistic itineraries so you're never caught off guard.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 text-black dark:text-white">Community Driven</h4>
                  <p className="text-gray-600 dark:text-gray-400">Join a network of thousands of travelers sharing their experiences and optimizing future trips for everyone.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-full min-h-[500px]"
          >
            {/* Collage of images */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-black z-20">
              <img src="/ourblog-1.jpg" alt="Travel Experience" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-black z-10">
              <img src="/ourblog-2.jpg" alt="Travel Planning" className="w-full h-full object-cover" />
            </div>
            {/* Decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-20 dark:opacity-40 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
