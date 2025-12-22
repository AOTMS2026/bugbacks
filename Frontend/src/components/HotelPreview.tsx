import { MapPin, Calendar, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

export function HotelPreview() {
  return (
    <section className="relative py-24 overflow-hidden bg-black">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 max-w-6xl mx-auto">
          {/* Left Side: Image with Splash Mask Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative w-full aspect-4/3 max-w-112.5 mx-auto">
              <img 
                src="/advanture.png" 
                alt="Adventure" 
                className="w-full h-full object-cover rounded-[80px] border-4 border-white/10 shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Right Side: Booking Details */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 max-w-lg"
          >
            <div className="space-y-10">
              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Location</span>
                </div>
                <p className="text-xl font-bold text-white ml-7">Arizona/Phoenix</p>
                <div className="h-px w-full bg-white/5 mt-4" />
              </div>

              {/* Date & Price */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Date</span>
                  </div>
                  <p className="text-xl font-bold text-white ml-7">12-15 Dec 2024</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-500">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Price</span>
                  </div>
                  <p className="text-xl font-bold text-white ml-7">$148k</p>
                </div>
              </div>
              <div className="h-px w-full bg-white/5" />

              {/* Buttons */}
              <div className="flex gap-6 pt-2">
                <button className="flex-1 py-4 px-8 rounded-xl bg-[#f4f4f4] text-[#1a1a1a] font-bold hover:bg-white transition-all text-sm">
                  Preview Hotel
                </button>
                <button className="flex-1 py-4 px-8 rounded-xl bg-[#1a2b4b] text-white font-bold hover:bg-[#253d6b] transition-all shadow-xl text-sm">
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
