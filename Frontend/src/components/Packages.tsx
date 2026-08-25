
import { motion } from "framer-motion"
import { Globe, MapPin, Heart, Users, Compass, Mountain, Map, Briefcase, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"

export function Packages() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handlePackageClick = (packageName: string) => {
    if (!user) {
      toast.error("Please log in to book a package.")
      navigate("/login")
      return;
    }
    navigate(`/booking/service?type=${encodeURIComponent(packageName)}`)
  }

  const packages = [
    { icon: MapPin, name: "Domestic Tours", desc: "Discover the hidden gems in your own country." },
    { icon: Globe, name: "International Tours", desc: "Explore exotic destinations across the globe." },
    { icon: Heart, name: "Honeymoon Packages", desc: "Romantic getaways curated for couples." },
    { icon: Users, name: "Family Vacations", desc: "Fun-filled itineraries for the whole family." },
    { icon: Compass, name: "Group Tours", desc: "Travel with like-minded explorers." },
    { icon: Mountain, name: "Adventure & Trekking", desc: "Thrilling expeditions for adrenaline junkies." },
    { icon: Map, name: "Pilgrimage Tours", desc: "Spiritual journeys to sacred destinations." },
    { icon: Briefcase, name: "Corporate Travel", desc: "Seamless solutions for business trips." }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section id="packages" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#111] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3"
          >
            Our Offerings
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400"
          >
            Exclusive Tour Packages
          </motion.h3>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {packages.map((pkg, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              onClick={() => handlePackageClick(pkg.name)}
              className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-3xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden flex flex-col h-full"
            >
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <pkg.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{pkg.name}</h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-grow">{pkg.desc}</p>
              
              <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between mt-auto group-hover:border-indigo-100 dark:group-hover:border-indigo-500/30 transition-colors">
                <span className="text-sm font-bold text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Book Now</span>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
