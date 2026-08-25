import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Building2, Calendar, Users, CheckCircle2, ArrowRight, ArrowLeft, MapPin } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Navbar } from "../../components/Navbar"
import { Footer } from "../../components/Footer"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default Leaflet marker icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, setDestination }: { position: L.LatLng | null, setPosition: (p: L.LatLng) => void, setDestination: (d: string) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      setDestination(`${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`)
    },
  })
  return position === null ? null : (
    <Marker position={position}></Marker>
  )
}

export function HotelBookingForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  // Default position: Vijayawada, India
  const [mapPosition, setMapPosition] = useState<L.LatLng | null>(new L.LatLng(16.5062, 80.6480))
  const [formData, setFormData] = useState({
    destination: "16.5062, 80.6480",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
    roomType: "Standard",
    specialRequests: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const nextStep = () => {
    if (step === 1 && !formData.destination) {
      toast.error("Please enter a destination.")
      return
    }
    if (step === 2 && (!formData.checkInDate || !formData.checkOutDate)) {
      toast.error("Please select both check-in and check-out dates.")
      return
    }
    if (step === 2 && new Date(formData.checkInDate) > new Date(formData.checkOutDate)) {
      toast.error("Check-out date cannot be before check-in date.")
      return
    }
    setStep(s => Math.min(s + 1, 3))
  }
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!user) {
      toast.error("You must be logged in to book a hotel.")
      navigate("/login")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:8000/api/hotel-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id,
          ...formData,
          guests: { adults: Number(formData.adults), children: Number(formData.children) }
        })
      })

      if (!response.ok) {
        throw new Error("Failed to submit hotel booking.")
      }

      setIsSuccess(true)
      toast.success("Hotel booking request submitted successfully!")
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("An unknown error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
        
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#111] p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100 dark:border-white/5"
          >
            <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Booking Confirmed!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
              Your request has been successfully sent. Our travel agents will contact you shortly to finalize your stay.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-4 rounded-2xl font-bold transition-all shadow-lg"
            >
              Return to Home
            </button>
          </motion.div>
        ) : (
          <div className="w-full max-w-md bg-white dark:bg-[#111] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 relative">
            
            {/* Header & Progress */}
            <div className="px-8 pt-8 pb-6 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Hotel Booking</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Step {step} of 3</p>
                  </div>
                </div>
                <button onClick={() => navigate("/")} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-white/10'}`} />
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 relative min-h-[380px]">
              <AnimatePresence mode="wait" custom={1}>
                {step === 1 && (
                  <motion.div key="step1" custom={1} variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 p-8 flex flex-col">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Where to?</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Click the map to drop a pin at your destination.</p>
                    </div>
                    
                    {/* Map Container */}
                    <div className="flex-grow rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 relative z-10 shadow-inner min-h-[220px]">
                      <MapContainer center={[16.5062, 80.6480]} zoom={11} scrollWheelZoom={false} className="w-full h-full">
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker 
                          position={mapPosition} 
                          setPosition={setMapPosition} 
                          setDestination={(val) => setFormData(p => ({ ...p, destination: val }))} 
                        />
                      </MapContainer>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" custom={1} variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 p-8 flex flex-col justify-center">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">When are you going?</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Select your check-in and check-out dates.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Check-in</label>
                        <input 
                          type="date" 
                          name="checkInDate" 
                          value={formData.checkInDate} 
                          onChange={handleChange} 
                          className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white transition-all [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert font-medium" 
                        />
                      </div>
                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Check-out</label>
                        <input 
                          type="date" 
                          name="checkOutDate" 
                          value={formData.checkOutDate} 
                          onChange={handleChange} 
                          className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white transition-all [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert font-medium" 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" custom={1} variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 p-8 overflow-y-auto">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Final Details</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Who is traveling and what room do you need?</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Adults</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="number" min="1" name="adults" value={formData.adults} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white transition-all font-medium" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Children</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="number" min="0" name="children" value={formData.children} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white transition-all font-medium" />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Room Type</label>
                      <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white transition-all font-medium appearance-none">
                        <option value="Standard">Standard Room</option>
                        <option value="Deluxe">Deluxe Room</option>
                        <option value="Suite">Suite</option>
                        <option value="Family">Family Room</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Special Requests (Optional)</label>
                      <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={2} placeholder="E.g., early check-in, honeymoon..." className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white transition-all resize-none font-medium text-sm" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="p-8 pt-0 flex items-center justify-between mt-auto">
              {step > 1 ? (
                <button 
                  onClick={prevStep}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-12 h-12" /> // Spacer
              )}

              {step < 3 ? (
                <button 
                  onClick={nextStep}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Submit <CheckCircle2 className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
            
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
