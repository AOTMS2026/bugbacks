import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, IndianRupee, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface Activity {
  day: number;
  title: string;
  activities: string[];
  hotel: string;
  food: string[];
  places: string[];
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
  duration: string;
  createdAt: string;
}

const MyTrips = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

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

        console.log('Fetching trips from: http://localhost:8000/api/my-trips');
        const response = await fetch('http://localhost:8000/api/my-trips', {
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
      const response = await fetch(`http://localhost:8000/api/delete-trip/${id}`, {
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
      
      <main className="grow container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Saved Trips</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Your collection of AI-planned adventures.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-black dark:text-white font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Refresh
            </button>
            <button 
              onClick={() => navigate('/planner')}
              className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
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
          <div className="text-center py-24 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl">
            <MapPin className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No trips saved yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Start planning your first adventure with our AI agent.</p>
            <button 
              onClick={() => navigate('/planner')}
              className="px-8 py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div key={trip._id} className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden hover:border-black/10 dark:hover:border-white/20 transition-all group shadow-sm">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {trip.origin} → {trip.destination}
                    </h3>
                    <div className="flex gap-2">
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
                  
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.duration}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {trip.budget}</span>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/5">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Itinerary Preview</p>
                    <div className="space-y-2">
                      {trip.days.slice(0, 2).map((day) => (
                        <div key={day.day} className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          <span className="font-bold text-black dark:text-white mr-2">Day {day.day}:</span>
                          {day.title}
                        </div>
                      ))}
                      {trip.days.length > 2 && (
                        <p className="text-xs text-gray-400 dark:text-gray-600">+{trip.days.length - 2} more days...</p>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/planner`, { state: { savedTrip: trip } })}
                    className="w-full py-3 rounded-xl bg-black/5 dark:bg-white/10 text-black dark:text-white font-bold hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all mt-4"
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
