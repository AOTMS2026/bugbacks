import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, Edit3, X, CheckCircle2, User as UserIcon, Building2 } from "lucide-react";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface HotelBooking {
  _id: string;
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  guests: { adults: number; children: number };
  roomType: string;
  specialRequests: string;
  status: string;
}

interface FlightReservation {
  _id: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: string;
  specialRequests: string;
  status: string;
}

interface Inquiry {
  _id: string;
  serviceRequested: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  destination?: string;
  travelDates?: string;
  numberOfTravelers?: number;
  specialRequests?: string;
  status: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [flightReservations, setFlightReservations] = useState<FlightReservation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<HotelBooking | null>(null);
  const [editingFlight, setEditingFlight] = useState<FlightReservation | null>(null);
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'services'>('hotels');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [hotelRes, flightRes, inquiryRes] = await Promise.all([
        fetch(`http://localhost:8000/api/hotel-bookings/user/${user.id}`),
        fetch(`http://localhost:8000/api/flight-reservations/user/${user.id}`),
        fetch(`http://localhost:8000/api/inquiries/user/${user.id}`)
      ]);
      
      if (hotelRes.ok) setHotelBookings(await hotelRes.json());
      if (flightRes.ok) setFlightReservations(await flightRes.json());
      if (inquiryRes.ok) setInquiries(await inquiryRes.json());
    } catch (error) {
      toast.error("Failed to load your profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingBooking) return;
    setEditingBooking({ ...editingBooking, [e.target.name]: e.target.value });
  };

  const handleFlightEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingFlight) return;
    setEditingFlight({ ...editingFlight, [e.target.name]: e.target.value });
  };

  const handleInquiryEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingInquiry) return;
    setEditingInquiry({ ...editingInquiry, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking && !editingFlight && !editingInquiry) return;
    
    setIsSubmitting(true);
    try {
      let response;
      if (editingBooking) {
        response = await fetch(`http://localhost:8000/api/hotel-bookings/${editingBooking._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingBooking)
        });
      } else if (editingFlight) {
        response = await fetch(`http://localhost:8000/api/flight-reservations/${editingFlight._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingFlight)
        });
      } else if (editingInquiry) {
        response = await fetch(`http://localhost:8000/api/inquiries/${editingInquiry._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingInquiry)
        });
      }
      
      if (response?.ok) {
        toast.success("Updated successfully!");
        setEditingBooking(null);
        setEditingFlight(null);
        setEditingInquiry(null);
        fetchData();
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        {/* Profile Header */}
        <div className="bg-white dark:bg-[#111] rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-white/5 mb-12 flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('hotels')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'hotels' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5'}`}
          >
            Hotel Bookings
          </button>
          <button 
            onClick={() => setActiveTab('flights')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'flights' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5'}`}
          >
            Flight Reservations
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'services' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5'}`}
          >
            Service Inquiries
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'hotels' ? (
          hotelBookings.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5">
              <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No hotel bookings yet</h3>
              <p className="text-gray-500 mt-2">Your hotel booking requests will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotelBookings.map((booking) => (
              <motion.div 
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5 relative group"
              >
                <div className="absolute top-6 right-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pr-20 flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
                  <span className="line-clamp-2">{booking.destination}</span>
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(booking.checkInDate).toLocaleDateString()} &rarr; {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="w-4 h-4" />
                    <span>{booking.roomType} Room</span>
                  </div>
                </div>

                <button
                  onClick={() => setEditingBooking(booking)}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Edit Details
                </button>
              </motion.div>
            ))}
            </div>
          )
        ) : activeTab === 'flights' ? (
          flightReservations.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5">
              <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No flight reservations yet</h3>
              <p className="text-gray-500 mt-2">Your flight reservation requests will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flightReservations.map((flight) => (
                <motion.div 
                  key={flight._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5 relative group"
                >
                  <div className="absolute top-6 right-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      flight.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      flight.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {flight.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pr-20 flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold truncate max-w-[80px]">{flight.departureCity}</span>
                    </div>
                    <span className="text-indigo-500">&rarr;</span>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold truncate max-w-[80px]">{flight.arrivalCity}</span>
                    </div>
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(flight.departureDate).toLocaleDateString()} {flight.returnDate && ` - ${new Date(flight.returnDate).toLocaleDateString()}`}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Building2 className="w-4 h-4" />
                      <span>{flight.passengers} Passenger(s) • {flight.cabinClass}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingFlight(flight)}
                    className="w-full py-3 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Details
                  </button>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          inquiries.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5">
              <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No service inquiries yet</h3>
              <p className="text-gray-500 mt-2">Your service requests will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inquiries.map((inq) => (
                <motion.div 
                  key={inq._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5 relative group"
                >
                  <div className="absolute top-6 right-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inq.status === 'Closed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      inq.status === 'Contacted' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pr-24 line-clamp-1">
                    {inq.serviceRequested}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{inq.destination || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{inq.travelDates || "Dates open"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{inq.numberOfTravelers ? `${inq.numberOfTravelers} Travelers` : "Travelers TBD"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingInquiry(inq)}
                    className="w-full py-3 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Details
                  </button>
                </motion.div>
              ))}
            </div>
          )
        )}
      </main>

      {/* Edit Modal for Hotel */}
      <AnimatePresence>
        {editingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#111] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Booking</h2>
                <button onClick={() => setEditingBooking(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="edit-booking-form" onSubmit={handleUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
                    <input type="text" name="destination" value={editingBooking.destination} onChange={handleEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in</label>
                      <input type="date" name="checkInDate" value={editingBooking.checkInDate.split('T')[0]} onChange={handleEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out</label>
                      <input type="date" name="checkOutDate" value={editingBooking.checkOutDate.split('T')[0]} onChange={handleEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Type</label>
                    <select name="roomType" value={editingBooking.roomType} onChange={handleEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white">
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                      <option value="Family">Family</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requests</label>
                    <textarea name="specialRequests" value={editingBooking.specialRequests || ''} onChange={handleEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white resize-none" rows={3}></textarea>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] flex justify-end gap-3">
                <button onClick={() => setEditingBooking(null)} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button form="edit-booking-form" type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Save Changes <CheckCircle2 className="w-4 h-4" /></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal for Flight */}
      <AnimatePresence>
        {editingFlight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#111] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Flight</h2>
                <button onClick={() => setEditingFlight(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="edit-flight-form" onSubmit={handleUpdate} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
                      <input type="text" name="departureCity" value={editingFlight.departureCity} onChange={handleFlightEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
                      <input type="text" name="arrivalCity" value={editingFlight.arrivalCity} onChange={handleFlightEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure</label>
                      <input type="date" name="departureDate" value={editingFlight.departureDate.split('T')[0]} onChange={handleFlightEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Return</label>
                      <input type="date" name="returnDate" value={editingFlight.returnDate ? editingFlight.returnDate.split('T')[0] : ''} onChange={handleFlightEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passengers</label>
                      <input type="number" min="1" name="passengers" value={editingFlight.passengers} onChange={handleFlightEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cabin Class</label>
                      <select name="cabinClass" value={editingFlight.cabinClass} onChange={handleFlightEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white">
                        <option value="Economy">Economy</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Business">Business</option>
                        <option value="First Class">First Class</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requests</label>
                    <textarea name="specialRequests" value={editingFlight.specialRequests || ''} onChange={handleFlightEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white resize-none" rows={2}></textarea>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] flex justify-end gap-3">
                <button onClick={() => setEditingFlight(null)} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button form="edit-flight-form" type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Save Changes <CheckCircle2 className="w-4 h-4" /></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal for Service Inquiries */}
      <AnimatePresence>
        {editingInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#111] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Inquiry</h2>
                <button onClick={() => setEditingInquiry(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="edit-inquiry-form" onSubmit={handleUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
                    <input type="text" name="destination" value={editingInquiry.destination || ''} onChange={handleInquiryEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Travel Dates</label>
                    <input type="text" name="travelDates" value={editingInquiry.travelDates || ''} onChange={handleInquiryEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Travelers</label>
                    <input type="number" min="1" name="numberOfTravelers" value={editingInquiry.numberOfTravelers || ''} onChange={handleInquiryEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requests</label>
                    <textarea name="specialRequests" value={editingInquiry.specialRequests || ''} onChange={handleInquiryEditChange} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-black dark:text-white resize-none" rows={3}></textarea>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] flex justify-end gap-3">
                <button onClick={() => setEditingInquiry(null)} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button form="edit-inquiry-form" type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Save Changes <CheckCircle2 className="w-4 h-4" /></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
