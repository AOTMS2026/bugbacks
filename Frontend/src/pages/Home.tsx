import { Navbar } from "../components/Navbar"
import { Hero } from "../components/Hero"
import { AboutSection } from "../components/AboutSection"
import { SpecialTrips } from "../components/SpecialTrips"
import { Packages } from "../components/Packages"
import { Services } from "../components/Services"
import { Footer } from "../components/Footer"
import { motion } from "framer-motion"
import { Brain, Map, Wallet, Coffee, ArrowRight } from "lucide-react"

export function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-indigo-500" />,
      title: "AI-Powered Intelligence",
      description: "Our advanced algorithms analyze millions of data points to craft the perfect itinerary tailored just for you."
    },
    {
      icon: <Wallet className="w-8 h-8 text-green-500" />,
      title: "Smart Budgeting",
      description: "Get precise cost estimates for travel, stay, and food. Optimize your trip to fit your financial goals exactly."
    },
    {
      icon: <Map className="w-8 h-8 text-blue-500" />,
      title: "Optimized Routes",
      description: "Save time with logically sequenced stops. We calculate the best paths to minimize travel time and maximize fun."
    },
    {
      icon: <Coffee className="w-8 h-8 text-orange-500" />,
      title: "Local Experiences",
      description: "Discover hidden gems, local favorites, and authentic culinary experiences not found in standard guidebooks."
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Tell Us Your Dream",
      description: "Enter your destination, dates, budget, and travel style (e.g., Adventure, Family, Chill)."
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our AI agents instantly search flights, hotels, and activities to build a cohesive plan."
    },
    {
      number: "03",
      title: "Your Perfect Plan",
      description: "Receive a day-by-day itinerary with costs, maps, and booking links. Edit or book immediately."
    }
  ]

  const stats = [
    { value: "50k+", label: "Happy Travelers" },
    { value: "100+", label: "Countries Covered" },
    { value: "1M+", label: "Itineraries Generated" },
    { value: "4.9/5", label: "User Rating" }
  ]

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION - Preserved as requested */}
      <Hero />

      {/* NEW ABOUT SECTION */}
      <AboutSection />

      {/* NEW SPECIAL TRIPS SECTION */}
      <SpecialTrips />

      {/* NEW SERVICES SECTION */}
      <Services />

      {/* FEATURES SECTION */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-4"
            >
              Why Choose AI Travel?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              We combine cutting-edge AI with deep travel expertise to replace weeks of planning with seconds of magic.
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 group"
              >
                <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-white/10 w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/5 dark:bg-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                From Idea to Itinerary in <span className="text-indigo-600 dark:text-indigo-400">Seconds</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
                Traditional travel planning involves dozens of tabs, confusing spreadsheets, and endless stress. We fixed that.
              </p>

              <div className="space-y-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex gap-6"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12">
                <a href="#packages">
                  <button className="px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center gap-2 group">
                    View Our Packages <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-violet-600 rounded-full blur-[100px] opacity-20 dark:opacity-30 animate-pulse" />
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
                alt="Travel Planning"
                className="relative rounded-[2.5rem] shadow-2xl border-8 border-white dark:border-white/5 rotate-3 hover:rotate-0 transition-transform duration-700 w-full object-cover aspect-[4/5]"
              />

              {/* Floating Cards */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-8 -left-8 bg-white dark:bg-black p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 flex items-center gap-4 max-w-xs"
              >
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Average Savings</p>
                  <p className="text-xl font-bold">₹15,000 / trip</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 border-y border-black/5 dark:border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-600 dark:from-white dark:to-gray-500 mb-2 font-['Oswald']">
                  {stat.value}
                </h3>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/5 dark:bg-indigo-900/20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 font-['Oswald'] uppercase tracking-tighter leading-tight"
          >
            Ready for your next <br />
            <span className="text-indigo-600 dark:text-indigo-400">Great Adventure?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of travelers who are saving time and money while seeing the world in a whole new way.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <a href="#packages">
              <button className="px-12 py-5 rounded-full bg-indigo-600 text-white font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1">
                Explore All Packages
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* NEW PACKAGES SECTION */}
      <Packages />

      <Footer />
    </div>
  )
}
