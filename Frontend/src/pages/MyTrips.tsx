import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, IndianRupee, Trash2, ExternalLink, Route } from 'lucide-react';
import toast from 'react-hot-toast';

interface Activity {
  day: number;
  title: string;
  dailyTravel?: {
    distance: string;
    mode: string;
    timings: string;
    cost: string;
  };
  activities: { name: string; time: string; cost: string }[];
  hotel: string;
  food: { item?: string; restaurant?: string; time: string; cost: string }[];
  places: { name: string; visitTimings: string; entryFee: string }[];
  dailyBudget: string;
}

interface Trip {
  _id: string;
  origin: string;
  destination: string;
  originCoordinates: {
    lat: number;
    lng: number;
  };
  destinationCoordinates: {
    lat: number;
    lng: number;
  };
  days: Activity[];
  budget: string;
  initialJourney?: {
    distance: string;
    duration: string;
    transportType: string;
    departureTime: string;
    arrivalTime: string;
    cost: string;
  };
  budgetBreakdown?: {
    longDistanceTransport: string;
    localTransport: string;
    accommodation: string;
    food: string;
    activities: string;
    waterAndRefreshments: string;
    miscellaneous: string;
  };
  duration: string;
  transportation?: string;
  realTimeData?: {
    weather: string;
    traffic: string;
    safety: string;
    events: string;
  };
  bookingSuggestions?: {
    transport: string;
    accommodation: string;
    activities: string;
  };
  extraMoneySuggestion?: string;
  checklist?: string[];
  groupSplitting?: {
    totalPerPerson: string;
    dayWisePerPerson: { day: number; amount: string }[];
  };
  vehicleComparison?: {
    vehicle: string;
    duration: string;
    cost: string;
    pros: string;
    cons: string;
    bestFor: string;
  }[];
  aiInsights?: {
    whyTheseOptions: string;
    tips: string[];
    dos: string[];
    donts: string[];
    waitingTimeEstimates: string;
  };
  createdAt: string;
}

const MyTrips = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          setLoading(false);
          return;
        }

        console.log(`Fetching trips from: ${import.meta.env.VITE_API_URL}/api/my-trips`);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/my-trips`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Trips fetched successfully:', data);
          setTrips(data);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Failed to fetch trips:', response.status, errorData);
          
          if (response.status === 401) {
            toast.error('Session expired. Please login again.');
            navigate('/login');
            return;
          }
          
          toast.error(`Failed to load trips: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
        toast.error('Connection error. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user, navigate]);

  const handleDeleteTrip = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    const deleteToast = toast.loading('Deleting trip...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-trip/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTrips(trips.filter(trip => trip._id !== id));
        toast.success('Trip deleted successfully', { id: deleteToast });
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error('Failed to delete trip', { id: deleteToast });
    }
  };

  const openInGoogleMaps = (origin?: {lat: number, lng: number}, dest?: {lat: number, lng: number}) => {
    if (origin && dest) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${dest.lat},${dest.lng}&travelmode=driving`;
      window.open(url, '_blank');
    } else if (dest) {
      const url = `https://www.google.com/maps/search/?api=1&query=${dest.lat},${dest.lng}`;
      window.open(url, '_blank');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="grow container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Saved Trips</h1>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">Your collection of AI-planned adventures.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 md:flex-none px-4 md:px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-black dark:text-white font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-sm md:text-base"
            >
              Refresh
            </button>
            <button 
              onClick={() => navigate('/planner')}
              className="flex-2 md:flex-none px-4 md:px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-sm md:text-base"
            >
              Plan New Trip
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-black/10 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16 md:py-24 px-6 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl">
            <MapPin className="w-12 h-12 md:w-16 md:h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">No trips saved yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm md:text-base">Start planning your first adventure with our AI agent.</p>
            <button 
              onClick={() => navigate('/planner')}
              className="w-full md:w-auto px-8 py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {trips.map((trip) => (
              <div key={trip._id} className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden hover:border-black/10 dark:hover:border-white/20 transition-all group shadow-sm">
                <div className="p-5 md:p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl md:text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {trip.origin} → {trip.destination}
                    </h3>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => openInGoogleMaps(trip.originCoordinates, trip.destinationCoordinates)}
                        className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all"
                        title="View Route on Google Maps"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTrip(trip._id)}
                        className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-red-500/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md"><Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" /> {trip.duration}</span>
                    <span className="flex items-center gap-1 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md"><IndianRupee className="w-3.5 h-3.5 md:w-4 md:h-4" /> {trip.budget}</span>
                    {trip.originCoordinates && trip.destinationCoordinates && (
                      <span className="flex items-center gap-1 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">
                        <Route className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                        {calculateDistance(
                          trip.originCoordinates.lat,
                          trip.originCoordinates.lng,
                          trip.destinationCoordinates.lat,
                          trip.destinationCoordinates.lng
                        )} km
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/5">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Itinerary Preview</p>
                    <div className="space-y-2">
                      {trip.days.slice(0, 2).map((day) => (
                        <div key={day.day} className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                          <span className="font-bold text-black dark:text-white mr-2">Day {day.day}:</span>
                          {day.title}
                        </div>
                      ))}
                      {trip.days.length > 2 && (
                        <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-600">+{trip.days.length - 2} more days...</p>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/planner`, { state: { savedTrip: trip } })}
                    className="w-full py-3 md:py-4 rounded-xl bg-black/5 dark:bg-white/10 text-black dark:text-white font-bold hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all mt-4 text-sm md:text-base"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyTrips;
