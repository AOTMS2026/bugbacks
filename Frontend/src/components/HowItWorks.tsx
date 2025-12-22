import { motion } from "framer-motion"
import { MapPin, Calendar, Sparkles } from "lucide-react"

const steps = [
  {
    title: "Tell us your vibe",
    desc: "Share your destination, budget, and what you love doing.",
    icon: MapPin,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "AI Magic",
    desc: "Our AI analyzes thousands of data points to craft your perfect trip.",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    title: "Get your plan",
    desc: "Receive a detailed itinerary with routes, food, and costs.",
    icon: Calendar,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20"
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-green-600 uppercase tracking-wide">Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How It Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-400 mx-auto">
            Three simple steps to your next unforgettable adventure.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.bg} ${step.color} mb-6`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-0.5 bg-gray-100 dark:bg-gray-800" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
