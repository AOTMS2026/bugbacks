import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function BlogSection() {
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
            Our <span className="text-gray-500 dark:text-gray-400">Blog</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-20 max-w-2xl mx-auto text-lg">
            An insight the incredible experience in the world
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16 text-left max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-4/3 rounded-[40px] overflow-hidden border-4 border-black/5 dark:border-white/10 shadow-2xl">
              <img 
                src="/ourblog-1.jpg" 
                alt="Beautiful Kashmir" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-black dark:text-white leading-tight font-oswald uppercase">
              Beautiful Kashmir <br /> The Heaven on Earth
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed">
              Discover the breathtaking landscapes, serene lakes, and vibrant culture of Kashmir. Our travel experts provide the best recommendations for your next mountain escape.
            </p>
            <button className="flex items-center gap-3 text-black dark:text-white font-bold text-lg group border-b-2 border-black/10 dark:border-white/20 pb-2 hover:border-black dark:hover:border-white transition-all">
              Read more 
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
