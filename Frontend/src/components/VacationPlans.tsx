import { Star, Navigation } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
  { name: "Rome, Italy", price: "$148k", duration: "7 Day Trip", rating: "4.8", img: "/Best Vacation-1.jpg" },
  { name: "India, Delhi", price: "$748k", duration: "7 Day Trip", rating: "4.5", img: "/Best Vacation-2.jpg" },
  { name: "Usa, Chicago", price: "$1148k", duration: "7 Day Trip", rating: "4.8", img: "/Best Vacation-3.jpg" },
  { name: "Uk, London", price: "$748k", duration: "7 Day Trip", rating: "4.5", img: "/destination-1.jpg" },
]

export function VacationPlans() {
  return (
    <section className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6 font-oswald uppercase tracking-tight">
            Best <span className="text-gray-500 dark:text-gray-400">Vacation Plan</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-20 max-w-2xl mx-auto text-lg">
            Plan your perfect vacation with our travel agency. Choose among hundreds of all-inclusive offer!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-4/5 rounded-[40px] mb-8 overflow-hidden relative border-4 border-black/5 dark:border-white/5 shadow-2xl transition-all group-hover:border-black/10 dark:group-hover:border-white/20 group-hover:scale-[1.02]">
                <img 
                  src={plan.img} 
                  alt={plan.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex justify-between items-start mb-3 px-2">
                <h3 className="text-xl font-bold text-black dark:text-white">{plan.name}</h3>
                <span className="text-xl font-bold text-black dark:text-white">{plan.price}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 px-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 rotate-45 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm font-medium">{plan.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-medium text-black dark:text-white">{plan.rating}</span>
                </div>
              </div>
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
