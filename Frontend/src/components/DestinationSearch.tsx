import { Search, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export function DestinationSearch() {
  const destinations = [
    { id: 1, img: "/destination-1.jpg" },
    { id: 2, img: "/destination-2.jpg" },
    { id: 3, img: "/destination-3.jpg" },
    { id: 4, img: "/destination-4.jpg" },
  ]

  return (
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6 font-oswald uppercase tracking-tight">
            Find Your <span className="text-gray-500 dark:text-gray-400">Best Destination</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
            We have more than 2000 destination you can choose
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto relative mb-24"
        >
          <div className="flex items-center bg-black/5 dark:bg-[#1a2b4b]/40 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-full px-8 py-5 shadow-2xl">
            <MapPin className="w-5 h-5 text-gray-400 mr-4" />
            <input 
              type="text" 
              placeholder="Search Destination" 
              className="bg-transparent border-none focus:ring-0 text-black dark:text-white w-full placeholder-gray-500 text-lg"
            />
            <Search className="w-6 h-6 text-black dark:text-white ml-4 cursor-pointer" />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
          {destinations.map((dest) => (
            <motion.div 
              key={dest.id} 
              whileHover={{ rotate: 2, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative aspect-4/5 rounded-4xl overflow-hidden border-4 border-black/5 dark:border-white/10 shadow-2xl cursor-pointer"
            >
              <img 
                src={dest.img} 
                alt={`Destination ${dest.id}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {dest.id === 2 && (
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <p className="text-white font-bold text-xl">Amazon</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20"
        >
          <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium flex items-center gap-2 mx-auto">
            See more <span className="text-xl">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
