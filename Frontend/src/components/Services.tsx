import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { CoverflowCarousel } from "./ui/coverflow-carousel"
import type { CoverflowSlide } from "./ui/coverflow-carousel"

export function Services() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleServiceClick = (serviceName: string) => {
    if (!user) {
      toast.error('Please login to access services');
      navigate('/login');
      return;
    }
    
    if (serviceName === "Hotel Booking") {
      navigate('/booking/hotel');
      return;
    }

    if (serviceName === "Flight Reservation") {
      navigate('/booking/flight');
      return;
    }

    // Default route for all other services
    navigate(`/booking/service?type=${encodeURIComponent(serviceName)}`);
  }

  const slides: CoverflowSlide[] = [
    { 
      src: "/Booking_Hotel.png",
      alt: "Luxury hotel room with ocean view",
      title: "Hotel Booking",
      subtitle: "Premium stays at unbeatable prices worldwide.",
      meta: [{ label: "Coverage", value: "Global" }, { label: "Options", value: "50,000+" }],
      onClick: () => handleServiceClick("Hotel Booking")
    },
    { 
      src: "/Flight_Reservation.png",
      alt: "Airplane flying in the sky",
      title: "Flight Reservation",
      subtitle: "Hassle-free ticketing with the best airlines.",
      meta: [{ label: "Airlines", value: "400+" }, { label: "Support", value: "24/7" }],
      onClick: () => handleServiceClick("Flight Reservation")
    },
    { 
      src: "/Visa_Assistance.png",
      alt: "Passport with visa stamps",
      title: "Visa Assistance",
      subtitle: "Expert guidance for smooth visa processing.",
      meta: [{ label: "Success Rate", value: "99%" }, { label: "Countries", value: "80+" }],
      onClick: () => handleServiceClick("Visa Assistance")
    },
    { 
      src: "/Airport_Transport.png",
      alt: "Luxury car for airport transfer",
      title: "Airport Transfer",
      subtitle: "Comfortable and punctual pick-up/drop-offs.",
      meta: [{ label: "Vehicles", value: "Premium" }, { label: "Availability", value: "24/7" }],
      onClick: () => handleServiceClick("Airport Transfer")
    },
    { 
      src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&h=640&fit=crop",
      alt: "Traveler overlooking a scenic mountain",
      title: "Customized Packages",
      subtitle: "Tailor-made itineraries for your unique needs.",
      meta: [{ label: "Flexibility", value: "100%" }, { label: "Planning", value: "Expert AI" }],
      onClick: () => handleServiceClick("Customized Packages")
    },
    { 
      src: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=640&h=640&fit=crop",
      alt: "Luxury cruise ship at sea",
      title: "Cruise Packages",
      subtitle: "Luxurious voyages across the seven seas.",
      meta: [{ label: "Partners", value: "Top Tier" }, { label: "Destinations", value: "Worldwide" }],
      onClick: () => handleServiceClick("Cruise Packages")
    },
    { 
      src: "/Travel_Insurence.png",
      alt: "Travel insurance documents",
      title: "Travel Insurance",
      subtitle: "Comprehensive coverage for peace of mind.",
      meta: [{ label: "Coverage", value: "Full Health & Bag" }, { label: "Claim", value: "Instant" }],
      onClick: () => handleServiceClick("Travel Insurance")
    },
    { 
      src: "/Passport.png",
      alt: "Passport document close up",
      title: "Passport Assistance",
      subtitle: "Quick and easy passport application support.",
      meta: [{ label: "Processing", value: "Expedited" }, { label: "Support", value: "End-to-End" }],
      onClick: () => handleServiceClick("Passport Assistance")
    }
  ]

  return (
    <section id="services" className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3"
          >
            What We Do
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400"
          >
            Our Core Services
          </motion.h3>
        </div>
      </div>

      {/* Full width carousel container */}
      <div className="w-full">
        <CoverflowCarousel 
          slides={slides} 
          showCaption 
          showPagination 
          showNavigation 
          className="pb-10"
        />
      </div>
    </section>
  )
}
