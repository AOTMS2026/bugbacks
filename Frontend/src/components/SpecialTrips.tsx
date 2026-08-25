import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { Sparkles, Map, Calendar, ArrowRight } from "lucide-react"


export function SpecialTrips() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="specials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-10 animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">Curated Experiences</h2>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400"
          >
            Special Trips & Backpacking
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Ready for a different kind of journey? Explore our handpicked extreme adventures and exclusive premium packages tailored for true explorers.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Card 1: Backpacking */}
          <motion.div 
            variants={itemVariants}
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
              High Adventure
            </div>
            <div className="relative h-72 w-full overflow-hidden">
              <img 
                src="/BAG_PACK.png" 
                alt="Backpacking Adventure" 
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="p-8 relative">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                The Ultimate Backpacking Trail
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Ditch the luxury hotels and connect with nature. Our AI algorithms find the safest, most scenic, and budget-friendly backpacking routes across the globe. Uncover raw landscapes and sleep under the stars.
              </p>
              <div className="flex items-center gap-6 mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-indigo-500" />
                  <span>Off-grid Routes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>Flexible Dates</span>
                </div>
              </div>
              <a href="#packages">
                <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-4 transition-all">
                  Explore Backpacking Packages <ArrowRight className="w-5 h-5" />
                </button>
              </a>
            </div>
          </motion.div>

          {/* Card 2: Special Packages */}
          <motion.div 
            variants={itemVariants}
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute top-4 right-4 z-20 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
              Premium Exclusive
            </div>
            <div className="relative h-72 w-full overflow-hidden">
              <img 
                src="/special.png" 
                alt="Special Premium Trip" 
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="p-8 relative">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Exclusive Signature Getaways
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Sometimes you just need to be pampered. Access our highly curated list of luxury villas, private islands, and VIP experiences. Let our AI handle the logistics while you enjoy unparalleled comfort.
              </p>
              <div className="flex items-center gap-6 mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-indigo-500" />
                  <span>VIP Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>Curated Itinerary</span>
                </div>
              </div>
              <a href="#packages">
                <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-4 transition-all">
                  View Signature Packages <ArrowRight className="w-5 h-5" />
                </button>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
