import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-20 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-10 text-center lg:text-left"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white leading-tight font-oswald uppercase tracking-tight">
              We Make World <br /> Travel Easy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              Navigating the globe effortlessly, we transform wonderful dreams into seamless adventures. With us, the world becomes your incredible playground, travel simplified.
            </p>
            <button className="flex items-center gap-3 text-black dark:text-white font-bold text-xl group border-b-2 border-black/10 dark:border-white/20 pb-2 hover:border-black dark:hover:border-white transition-all mx-auto lg:mx-0">
              Explore Our Tour 
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-4/3 rounded-[40px] overflow-hidden border-4 border-black/5 dark:border-white/10 shadow-2xl">
              <img 
                src="/ourblog-2.jpg" 
                alt="Travel Easy" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
