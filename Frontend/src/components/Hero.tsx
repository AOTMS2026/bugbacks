import { motion } from "framer-motion"
import { Globe } from "@/components/ui/globe"

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-orange-200 via-white to-blue-200 dark:from-[#00294f] dark:via-slate-900 dark:to-orange-900/60 flex flex-col items-center justify-center transition-colors duration-500 py-20 md:py-0 animate-gradient">
      {/* Information Section - Positioned at the top/middle */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl mb-6 bg-gradient-to-b from-black dark:from-white to-gray-500 bg-clip-text text-transparent font-['Oswald'] uppercase leading-tight">
              From Idea to<br className="md:hidden" /> Itinerary in Seconds.
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl leading-7 text-gray-600 dark:text-gray-400 max-w-xl mx-auto px-4">
              Bag Pack Tours is your ultimate digital travel agency, leveraging advanced AI to craft flawless itineraries, manage budgets, and uncover exclusive global experiences just for you.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <button
                onClick={() => {
                  document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto rounded-full bg-black dark:bg-white px-10 py-4 text-base font-bold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg cursor-pointer"
              >
                Explore Packages
              </button>
              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto text-base font-bold leading-6 text-black dark:text-white cursor-pointer border-2 border-black/20 dark:border-white/20 px-10 py-4 rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/10"
              >
                How It Works
              </button>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                <span>AI-Powered Routing</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                <span>Real-time Budgeting</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                <span>100% Free to use</span>
              </div>
            </motion.div>

            {/* TRUST BUILDING SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-12 flex flex-col items-center justify-center pt-8 border-t border-black/10 dark:border-white/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-white dark:border-black" src="https://i.pravatar.cc/100?img=1" alt="User 1" />
                  <img className="w-10 h-10 rounded-full border-2 border-white dark:border-black" src="https://i.pravatar.cc/100?img=2" alt="User 2" />
                  <img className="w-10 h-10 rounded-full border-2 border-white dark:border-black" src="https://i.pravatar.cc/100?img=3" alt="User 3" />
                  <img className="w-10 h-10 rounded-full border-2 border-white dark:border-black" src="https://i.pravatar.cc/100?img=4" alt="User 4" />
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-black bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">+50k</div>
                </div>
              </div>
              <p className="text-gray-900 dark:text-white font-bold text-lg mb-1">Highly Trusted by Global Explorers</p>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm font-medium text-gray-500">4.9/5 Average Rating</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md text-center">
                Join thousands of customers who rely on our secure, AI-driven platform for authentic and meticulously planned travel experiences.
              </p>
            </motion.div>
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
