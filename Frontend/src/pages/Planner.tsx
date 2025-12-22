import React, { useState, useEffect } from 'react';
import RotatingEarth from '../components/ui/wireframe-dotted-globe';
import { Send, Sparkles, MapPin, Calendar, IndianRupee, Compass, Users, Wallet } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
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

interface Itinerary {
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
}

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '24px'
};

const Planner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form States
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    days: '3',
    people: '2',
    budget: '',
    preferences: ''
  });

  const [isPlanning, setIsPlanning] = useState(false);
  const [planningStatus, setPlanningStatus] = useState('');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  useEffect(() => {
    if (location.state?.savedTrip) {
      setItinerary(location.state.savedTrip);
    }
  }, [location.state]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handlePlanTrip = async () => {
    if (!formData.from.trim() || !formData.to.trim()) {
      toast.error('Please enter both origin and destination');
      return;
    }

    setItinerary(null);
    setIsPlanning(true);
    setPlanningStatus('AI Agent is analyzing your request and crafting your perfect itinerary...');

    try {
      const prompt = `Plan a trip from ${formData.from} to ${formData.to} for ${formData.days} days for ${formData.people} people. 
      Budget: ${formData.budget} INR. 
      Additional preferences: ${formData.preferences}.
      Please provide a daily budget breakdown in INR for each day.`;

      const response = await fetch('http://localhost:8000/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server is not responding correctly' }));
        throw new Error(errorData.message || 'Failed to plan trip');
      }

      const data = await response.json();
      setItinerary(data);
      toast.success('Itinerary generated successfully!');
    } catch (error: any) {
      console.error('Error planning trip:', error);
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        toast.error('Cannot connect to server. Please make sure the backend is running on port 8000.');
      } else {
        toast.error(error.message || 'An unexpected error occurred');
      }
    } finally {
      setIsPlanning(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!itinerary) {
      console.error('No itinerary to save');
      return;
    }

    const loadingToast = toast.loading('Saving your trip...');
    try {
      const token = localStorage.getItem('token');
      console.log('Saving trip with token:', token ? 'Present' : 'Missing');
      console.log('Itinerary data being sent:', itinerary);
      
      const response = await fetch('http://localhost:8000/api/save-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itinerary),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        console.error('Save trip failed:', errorData);
        
        if (response.status === 401) {
          toast.error('Session expired. Please login again.', { id: loadingToast });
          navigate('/login');
          return;
        }
        
        throw new Error(errorData.message || 'Failed to save trip');
      }

      const savedData = await response.json();
      console.log('Trip saved successfully:', savedData);
      toast.success('Trip saved successfully!', { id: loadingToast });
      navigate('/my-trips');
    } catch (error: any) {
      console.error('Error saving trip:', error);
      toast.error(error.message || 'Failed to save trip. Please try again.', { id: loadingToast });
    }
  };

  const openInGoogleMaps = () => {
    if (itinerary?.originCoordinates && itinerary?.destinationCoordinates) {
      const { lat: sLat, lng: sLng } = itinerary.originCoordinates;
      const { lat: dLat, lng: dLng } = itinerary.destinationCoordinates;
      // Google Maps Directions URL
      const url = `https://www.google.com/maps/dir/?api=1&origin=${sLat},${sLng}&destination=${dLat},${dLng}&travelmode=driving`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (itinerary?.destinationCoordinates) {
      const { lat, lng } = itinerary.destinationCoordinates;
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Location coordinates not available');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="grow container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Side: AI Agent Form */}
        <div className="w-full lg:w-1/2 space-y-8 lg:sticky lg:top-24">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-sm font-medium text-black dark:text-white">
              <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
              AI Travel Assistant
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Plan your dream trip in seconds.
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
              Fill in your details and let our AI agent craft a personalized itinerary for you.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> From (Origin)
                </label>
                <input
                  type="text"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  placeholder="e.g. Vijayawada"
                  className="w-full p-4 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> To (Destination)
                </label>
                <input
                  type="text"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  placeholder="e.g. Hyderabad"
                  className="w-full p-4 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Duration (Days)
                </label>
                <input
                  type="number"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  className="w-full p-4 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Number of People
                </label>
                <input
                  type="number"
                  value={formData.people}
                  onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                  className="w-full p-4 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> Total Budget (INR)
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="e.g. 50,000"
                  className="w-full p-4 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Compass className="w-4 h-4" /> Preferences & Interests
              </label>
              <textarea
                value={formData.preferences}
                onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                placeholder="e.g. I love art museums, local street food, and hiking..."
                className="w-full h-32 p-4 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none resize-none"
              />
            </div>

            <button
              onClick={handlePlanTrip}
              disabled={isPlanning || !formData.from.trim() || !formData.to.trim()}
              className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-lg"
            >
              {isPlanning ? (
                <div className="w-6 h-6 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Start AI agent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Globe or Itinerary */}
        <div className="w-full lg:w-1/2 flex justify-center items-start min-h-125">
          {!itinerary ? (
            <div className="relative w-full max-w-150 aspect-square mt-12">
              <RotatingEarth width={600} height={600} className="w-full h-full" />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white dark:from-black via-transparent to-transparent" />
              {isPlanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-full animate-in fade-in duration-500">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-black/10 dark:border-white/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-black dark:border-t-white rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-yellow-500 dark:text-yellow-400 animate-bounce" />
                  </div>
                  <p className="mt-4 text-lg font-medium text-black dark:text-white animate-pulse">{planningStatus}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 shadow-sm">
              {isLoaded && itinerary.destinationCoordinates && (
                <div className="relative group w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={itinerary.destinationCoordinates}
                    zoom={6}
                    options={{
                      fullscreenControl: true,
                      styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        {
                          featureType: "administrative.locality",
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#d59563" }],
                        },
                        {
                          featureType: "poi",
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#d59563" }],
                        },
                        {
                          featureType: "road",
                          elementType: "geometry",
                          stylers: [{ color: "#38414e" }],
                        },
                        {
                          featureType: "road",
                          elementType: "geometry.stroke",
                          stylers: [{ color: "#212a37" }],
                        },
                        {
                          featureType: "road",
                          elementType: "labels.text.fill",
                          stylers: [{ color: "#9ca5b3" }],
                        },
                        {
                          featureType: "water",
                          elementType: "geometry",
                          stylers: [{ color: "#17263c" }],
                        },
                      ],
                      disableDefaultUI: false,
                    }}
                  >
                    {itinerary.originCoordinates && (
                      <Marker
                        position={itinerary.originCoordinates}
                        label="A"
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }}
                      />
                    )}
                    <Marker
                      position={itinerary.destinationCoordinates}
                      label="B"
                      onClick={openInGoogleMaps}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                      }}
                    />
                    {itinerary.originCoordinates && itinerary.destinationCoordinates && (
                      <Polyline
                        path={[itinerary.originCoordinates, itinerary.destinationCoordinates]}
                        options={{
                          strokeColor: "#ef4444",
                          strokeOpacity: 0.8,
                          strokeWeight: 3,
                          icons: [{
                            icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
                            offset: '0',
                            repeat: '20px'
                          }]
                        }}
                      />
                    )}
                  </GoogleMap>

                  <button
                    onClick={openInGoogleMaps}
                    className="absolute bottom-4 right-4 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-all shadow-2xl z-10"
                  >
                    <MapPin className="w-4 h-4" />
                    View Full Route on Google Maps
                  </button>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {itinerary.origin} <span className="text-gray-400 dark:text-gray-500 text-xl mx-2">→</span> {itinerary.destination}
                  </h2>
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {itinerary.duration}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {itinerary.budget}</span>
                  </div>
                </div>
                <button
                  onClick={() => setItinerary(null)}
                  className="text-sm text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-8">
                {itinerary.days.map((day: Activity) => (
                  <div key={day.day} className="relative pl-8 border-l border-black/10 dark:border-white/10 space-y-4">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-black dark:bg-white border-4 border-white dark:border-black" />

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold">Day {day.day}: {day.title}</h3>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                          <IndianRupee className="w-3 h-3" /> {day.dailyBudget}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> Places to Visit
                        </h4>
                        <ul className="space-y-1">
                          {day.places?.map((place, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                              {place}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Users className="w-3 h-3" /> Recommended Hotel
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{day.hotel}</p>
                      </div>
                    </div>

                    <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                      <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Compass className="w-3 h-3" /> Local Food & Dining
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {day.food?.map((item, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs text-gray-600 dark:text-gray-300 border border-black/10 dark:border-white/10">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Activities</h4>
                      <ul className="space-y-2">
                        {day.activities.map((activity: string, idx: number) => (
                          <li key={idx} className="text-gray-500 dark:text-gray-400 flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5 shrink-0" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveTrip}
                className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
              >
                Save Trip to Profile
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Planner;
