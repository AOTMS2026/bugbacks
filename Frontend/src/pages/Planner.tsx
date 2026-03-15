import React, { useState, useEffect } from 'react';
import RotatingEarth from '../components/ui/wireframe-dotted-globe';
import { Sparkles, MapPin, Calendar, IndianRupee, Compass, Users, Wallet, Cloud, Car, ShieldAlert, Ticket, Bus, Route, Droplets, CheckCircle2, ExternalLink, Send, Info, ThumbsUp, ThumbsDown, AlertCircle, Clock, Coffee, Home, Zap, Baby, UserCheck, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CostComparison } from '../components/CostComparison';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

// Default icon removal to avoid accidental usage of system pins
L.Marker.prototype.options.icon = L.divIcon({ html: '' });

// Custom Icons for From and To with Labels - Centered on Dot
const fromIcon = L.divIcon({
  html: `
    <div class="flex flex-col items-center" style="transform: translate(-50%, -50%);">
      <div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
      <div class="mt-1 bg-white px-2 py-0.5 rounded shadow-sm border border-green-100 whitespace-nowrap">
        <span class="text-[9px] font-black text-green-700 tracking-tighter">FROM</span>
      </div>
    </div>
  `,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [0, 0],
});

const toIcon = L.divIcon({
  html: `
    <div class="flex flex-col items-center" style="transform: translate(-50%, -50%);">
      <div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
      <div class="mt-1 bg-white px-2 py-0.5 rounded shadow-sm border border-red-100 whitespace-nowrap">
        <span class="text-[9px] font-black text-red-700 tracking-tighter">TO</span>
      </div>
    </div>
  `,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [0, 0],
});

// User Location Icon (Blue Pulsing)
const userLocationIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-6 h-6 bg-blue-500/30 rounded-full animate-ping"></div>
      <div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-xl"></div>
    </div>
  `,
  className: 'user-location-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});


// Component to handle map bounds
const MapBounds = ({ origin, destination, route, recenterTrigger }: { origin: { lat: number, lng: number }, destination: { lat: number, lng: number }, route?: [number, number][], recenterTrigger?: number }) => {
  const map = useMap();
  useEffect(() => {
    if (origin && destination) {
      if (route && route.length > 0) {
        const bounds = L.latLngBounds(route);
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        const bounds = L.latLngBounds([origin.lat, origin.lng], [destination.lat, destination.lng]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [origin, destination, route, recenterTrigger, map]);
  return null;
};

// TravelDirection removed for a cleaner visual path
const TravelDirection = () => {
  return null;
};

// Component to fetch and display the real road route
const RoadRoute = ({ origin, destination }: { origin: { lat: number, lng: number }, destination: { lat: number, lng: number } }) => {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      try {
        // Use OSRM Public API (Demo Server)
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
          setRoute(coords);
        } else {
          // Fallback to straight line
          setRoute([[origin.lat, origin.lng], [destination.lat, destination.lng]]);
        }
      } catch (err) {
        console.error('Routing error:', err);
        setRoute([[origin.lat, origin.lng], [destination.lat, destination.lng]]);
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination) {
      fetchRoute();
    }
  }, [origin, destination]);

  if (loading && route.length === 0) return null;

  return (
    <>
      <Polyline
        positions={route}
        color="#3b82f6"
        weight={6}
        opacity={0.8}
        lineJoin="round"
      />
      <MapBounds origin={origin} destination={destination} route={route} />
      <TravelDirection />
    </>
  );
};

const LiveLocation = ({ isActive, setPosition }: { isActive: boolean, setPosition: (pos: [number, number] | null) => void }) => {
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);

  useEffect(() => {
    if (!isActive) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCurrentPos(newPos);
        setPosition(newPos);
        setAccuracy(pos.coords.accuracy);
      },
      (err) => {
        console.error('Geolocation error:', err);
        toast.error('Location access denied or unavailable');
      },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setCurrentPos(null);
      setPosition(null);
    };
  }, [isActive, setPosition]);

  if (!currentPos) return null;

  return (
    <>
      <LeafletMarker position={currentPos} icon={userLocationIcon}>
        <Popup>
          <div className="p-1">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">You are here</p>
            <p className="text-[8px] text-gray-500 mt-0.5">Accuracy: ±{accuracy.toFixed(0)}m</p>
          </div>
        </Popup>
      </LeafletMarker>
      {accuracy > 0 && (
        <Circle
          center={currentPos}
          radius={accuracy}
          pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.1, color: '#3b82f6', weight: 1, dashArray: '5, 10' }}
        />
      )}
    </>
  );
};


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
}

const Planner = () => {
  const calculateRoadDistance = async () => {
    return null;
  };
  const { user } = useAuth();
  const [isLocating, setIsLocating] = useState(false);
  const [, setUserPosition] = useState<[number, number] | null>(null);
  const [recenterCount, setRecenterCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Form States
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    tripType: 'Leisure',
    days: '3',
    people: '2',
    startDate: '',
    endDate: '',
    preferredMode: 'Any',
    travelPace: 'Moderate',
    tripNature: 'Round trip',
    budget: '',
    budgetPriority: 'Balanced',
    foodType: 'Mixed',
    cuisine: 'Any',
    dietary: 'Any',
    stayType: 'Any',
    stayLocation: 'Near destination',
    acPreference: 'Any',
    travelTime: 'Day',
    crowdPreference: 'Any',
    darshanPreference: 'Free',
    seniorCitizens: 'No',
    children: 'No',
    preferences: ''
  });

  const [isPlanning, setIsPlanning] = useState(false);
  const [planningStatus, setPlanningStatus] = useState('');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);

  // Voice & Text Logic
  const [voiceInput, setVoiceInput] = useState('');
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported: isSpeechSupported } = useSpeechRecognition();
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();

  useEffect(() => {
    if (transcript) {
      setVoiceInput(transcript);
    }
  }, [transcript]);



  useEffect(() => {
    console.log('Location State changed:', location.state);
    if (location.state?.savedTrip) {
      console.log('Loading saved trip:', location.state.savedTrip);
      const saved = location.state.savedTrip;
      setItinerary(saved);

      // Pre-fill form with saved trip details
      setFormData(prev => ({
        ...prev,
        from: saved.origin || '',
        to: saved.destination || '',
        days: saved.days?.length?.toString() || '3',
        budget: saved.budget || '',
        people: '2', // Default or extract if saved
        startDate: '', // Can't easily extract unless stored
        endDate: '',
        tripType: 'Leisure', // Default
      }));
    }
  }, [location.state]);


  const formatCurrency = (amount: string | number | undefined | null) => {
    try {
      if (!amount) return '';
      // Ensure we have a string
      const str = String(amount);
      return str.replace(/â‚¹/g, '₹');
    } catch (e) {
      console.warn('Currency format error:', e);
      return String(amount || '');
    }
  };



  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleAskAI = async () => {
    if (!chatMessage.trim() || !itinerary) return;

    setIsAskingAI(true);
    const loadingToast = toast.loading('AI is thinking...');

    try {
      const prompt = `The user has an existing trip plan from ${itinerary.origin} to ${itinerary.destination}.
      Current Itinerary: ${JSON.stringify(itinerary)}
      User Question/Adjustment: ${chatMessage}
      
      Please adjust the plan based on this request and return the FULL updated JSON itinerary following the same structure as before.
      Include vehicle comparisons, group splitting, and AI insights in the response.`;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/plan-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to update plan');

      const data = await response.json();
      setItinerary(data);
      setChatMessage('');
      toast.success('Plan updated successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Failed to update plan. Please try again.', { id: loadingToast });
    } finally {
      setIsAskingAI(false);
    }
  };


  const handlePlanTrip = async (manualPrompt?: string) => {
    // If no manual prompt (voice) is provided, validate form
    if (typeof manualPrompt !== 'string' && (!formData.from.trim() || !formData.to.trim() || !formData.startDate || !formData.endDate || !formData.budget || !formData.days || !formData.people)) {
      toast.error('Please fill in all mandatory fields marked with *');
      return;
    }

    setItinerary(null);
    setIsPlanning(true);
    setPlanningStatus('Analyzing your request...');

    try {
      let prompt = '';

      if (typeof manualPrompt === 'string' && manualPrompt.trim().length > 0) {
        // Use voice/manual prompt
        console.log('Using manual/voice prompt');
        prompt = `The user wants to plan a trip. Here is their request: "${manualPrompt}". 
        Please infer the origin, destination, duration, budget, and other details from the request. 
        If any critical information is missing (like specific dates), assume reasonable defaults (e.g., next weekend, balanced budget) but prioritize the user's explicit constraints.
        
        Provide the response in the exact JSON format specified in the system prompt.`;
      } else {
        // Use Form Data
        console.log('Starting execution of handlePlanTrip with Form Data...');
        setPlanningStatus('Calculating real-time road distance and analyzing your request...');
        const roadDataPromise = calculateRoadDistance();
        const limitPromise = new Promise((resolve) => setTimeout(resolve, 5000));
        const roadData = await Promise.race([roadDataPromise, limitPromise]) as { distance: string; duration: string } | null;

        const distanceInfo = (roadData && roadData.distance) ? `The actual road distance is ${roadData.distance} and it takes approximately ${roadData.duration} to reach.` : '';

        prompt = `Plan a ${formData.tripType} trip from ${formData.from} to ${formData.to} for ${formData.days} days for ${formData.people} people.
        Dates: ${formData.startDate} to ${formData.endDate}.
        Preferred Mode: ${formData.preferredMode}.
        Travel Pace: ${formData.travelPace}.
        Trip Nature: ${formData.tripNature}.
        Total Budget: ${formData.budget} INR.
        Budget Priority: ${formData.budgetPriority}.
        Food Preferences: ${formData.foodType}, ${formData.cuisine} cuisine, ${formData.dietary} dietary.
        Stay Preferences: ${formData.stayType} stay, ${formData.stayLocation}, ${formData.acPreference}.
        Travel Time Preference: ${formData.travelTime}.
        Crowd Preference: ${formData.crowdPreference}.
        ${formData.tripType === 'Spiritual' ? `Darshan Preference: ${formData.darshanPreference}.` : ''}
        ${formData.tripType === 'Family' ? `Senior Citizens: ${formData.seniorCitizens}, Children: ${formData.children}.` : ''}
        Additional preferences: ${formData.preferences}.
  
        ${distanceInfo}
  
        Please provide:
        1. A detailed budget breakdown in INR, including specific costs for long-distance transport (train/bus/flight), local transport (local train/bus/taxi), water/refreshments, and daily activities.
        2. The distance and time to reach the destination from the origin (use the provided road distance if available).
        3. Booking suggestions for transport and accommodation.
        4. An extra money suggestion for emergencies (clearly labeled as "Extra Money/Emergency Fund").
        5. A useful checklist including Aadhar card, PAN card, mobile battery charging, and dress code suggestions.
        6. A vehicle comparison (Train vs Bus vs Bike/Car) with duration, cost, pros, cons, and who it's best for.
        7. Group-based cost splitting (total per person and day-wise per person).
        8. AI Insights: Analyze if the budget is high or low for the given distance and duration. If the budget is high for a short distance, suggest luxury upgrades. If low, suggest cost-saving tips. Include travel tips, do's and don't's, and waiting time estimates at attractions.`;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log(`Sending request to Backend at: ${apiUrl}/api/plan-trip`);
      const response = await fetch(`${apiUrl}/api/plan-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      console.log('Received response from Backend:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server is not responding correctly' }));
        throw new Error(errorData.message || 'Failed to plan trip');
      }

      const data = await response.json();
      console.log('Parsed API Response Data:', data);
      setItinerary(data);
      console.log('Itinerary state set called.');
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error planning trip:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        toast.error('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        toast.error((error as Error).message || 'An unexpected error occurred');
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

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/save-trip`, {
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
    } catch (error) {
      console.error('Error saving trip:', error);
      toast.error((error as Error).message || 'Failed to save trip. Please try again.', { id: loadingToast });
    }
  };



  const openInMap = () => {
    if (itinerary?.originCoordinates && itinerary?.destinationCoordinates) {
      const { lat: sLat, lng: sLng } = itinerary.originCoordinates;
      const { lat: dLat, lng: dLng } = itinerary.destinationCoordinates;
      // Open in OpenStreetMap with a route (using OSRM demo or just showing markers)
      const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${sLat}%2C${sLng}%3B${dLat}%2C${dLng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (itinerary?.destinationCoordinates) {
      const { lat, lng } = itinerary.destinationCoordinates;
      const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
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

          <div className="bg-transparent dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 space-y-8 shadow-sm max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* 0. VOICE ASSISTANT / QUICK PLAN */}
            {isSpeechSupported && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                  <Mic className="w-5 h-5 text-indigo-500" /> Voice Assistant / Quick Plan
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tap the mic and speak your plan (e.g. "Plan a 3 day trip to Goa from Mumbai for 2 people with a budget of 20k").
                </p>

                <div className="relative">
                  <textarea
                    value={voiceInput}
                    onChange={(e) => {
                      setVoiceInput(e.target.value);
                      if (e.target.value === '') {
                        resetTranscript();
                      }
                    }}
                    placeholder="Speak or type your trip details here..."
                    className="w-full h-24 p-4 pr-12 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 text-black dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 transition-all outline-none resize-none text-sm"
                  />
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-black/5 dark:bg-white/10 text-gray-500 hover:bg-black/10 dark:hover:bg-white/20'
                      }`}
                    title={isListening ? "Stop Listening" : "Start Voice Input"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                {voiceInput.trim() && (
                  <button
                    onClick={() => handlePlanTrip(voiceInput)}
                    disabled={isPlanning}
                    className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isPlanning ? 'Analyzing...' : 'Generate Plan from Voice'}
                  </button>
                )}
              </div>
            )}

            {/* 1. BASIC TRIP DETAILS */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                <Info className="w-5 h-5 text-blue-500" /> 1. BASIC TRIP DETAILS *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> From *
                  </label>
                  <input
                    type="text"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="Starting Location"
                    title="Starting Location"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> To *
                  </label>
                  <input
                    type="text"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="Destination"
                    title="Destination"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Compass className="w-4 h-4" /> Trip Type *
                  </label>
                  <select
                    value={formData.tripType}
                    onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                    title="Trip Type"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="Spiritual">Spiritual</option>
                    <option value="Leisure">Leisure</option>
                    <option value="Family">Family</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Number of Days *
                  </label>
                  <input
                    type="number"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    title="Number of Days"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Number of People *
                  </label>
                  <input
                    type="number"
                    value={formData.people}
                    onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                    title="Number of People"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    title="Start Date"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    title="End Date"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. TRAVEL PREFERENCES */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                <Car className="w-5 h-5 text-green-500" /> 2. TRAVEL PREFERENCES *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Bus className="w-4 h-4" /> Preferred Mode *
                  </label>
                  <select
                    value={formData.preferredMode}
                    onChange={(e) => setFormData({ ...formData, preferredMode: e.target.value })}
                    title="Preferred Mode"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="Train">Train</option>
                    <option value="Bus">Bus</option>
                    <option value="Car">Car</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Travel Pace *
                  </label>
                  <select
                    value={formData.travelPace}
                    onChange={(e) => setFormData({ ...formData, travelPace: e.target.value })}
                    title="Travel Pace"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="Relaxed">Relaxed</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Fast">Fast</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Route className="w-4 h-4" /> Trip Nature *
                  </label>
                  <select
                    value={formData.tripNature}
                    onChange={(e) => setFormData({ ...formData, tripNature: e.target.value })}
                    title="Trip Nature"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="One-way">One-way</option>
                    <option value="Round trip">Round trip</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. BUDGET DETAILS */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                <Wallet className="w-5 h-5 text-yellow-500" /> 3. BUDGET DETAILS *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" /> Total Budget (₹) *
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g. 50,000"
                    title="Total Budget"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" /> Budget Priority *
                  </label>
                  <select
                    value={formData.budgetPriority}
                    onChange={(e) => setFormData({ ...formData, budgetPriority: e.target.value })}
                    title="Budget Priority"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="Low cost">Low cost</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Comfort focused">Comfort focused</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Per-person budget
                  </label>
                  <div className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white text-sm font-bold">
                    ₹ {formData.budget && formData.people ? (parseInt(formData.budget.replace(/,/g, '')) / parseInt(formData.people)).toLocaleString() : '0'}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. FOOD PREFERENCES */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                <Coffee className="w-5 h-5 text-orange-500" /> 4. FOOD PREFERENCES *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Droplets className="w-4 h-4" /> Food Type *
                  </label>
                  <select
                    value={formData.foodType}
                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                    title="Food Type"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="Outside food">Outside food</option>
                    <option value="Temple prasadam">Temple prasadam</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Compass className="w-4 h-4" /> Cuisine *
                  </label>
                  <select
                    value={formData.cuisine}
                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                    title="Cuisine"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="South Indian">South Indian</option>
                    <option value="North Indian">North Indian</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Dietary *
                  </label>
                  <select
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    title="Dietary Preference"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-veg">Non-veg</option>
                    <option value="Jain">Jain</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 5. STAY / COMFORT PREFERENCES */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                <Home className="w-5 h-5 text-purple-500" /> 5. STAY / COMFORT PREFERENCES *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Home className="w-4 h-4" /> Stay Type *
                  </label>
                  <select
                    value={formData.stayType}
                    onChange={(e) => setFormData({ ...formData, stayType: e.target.value })}
                    title="Stay Type"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="Budget">Budget</option>
                    <option value="Mid-range">Mid-range</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Stay Location *
                  </label>
                  <select
                    value={formData.stayLocation}
                    onChange={(e) => setFormData({ ...formData, stayLocation: e.target.value })}
                    title="Stay Location"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="Near destination">Near destination</option>
                    <option value="Near transport hub">Near transport hub</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Cloud className="w-4 h-4" /> AC / Non-AC
                  </label>
                  <select
                    value={formData.acPreference}
                    onChange={(e) => setFormData({ ...formData, acPreference: e.target.value })}
                    title="AC Preference"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 6. TIME & CROWD PREFERENCES */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                <Clock className="w-5 h-5 text-red-500" /> 6. TIME & CROWD PREFERENCES *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Preferred Travel Time *
                  </label>
                  <select
                    value={formData.travelTime}
                    onChange={(e) => setFormData({ ...formData, travelTime: e.target.value })}
                    title="Preferred Travel Time"
                    className="w-full p-3 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="Early Morning">Early Morning</option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Crowd Preference *
                  </label>
                  <select
                    value={formData.crowdPreference}
                    onChange={(e) => setFormData({ ...formData, crowdPreference: e.target.value })}
                    title="Crowd Preference"
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                  >
                    <option value="Avoid crowd">Avoid crowd</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 7. SPECIAL TRIP OPTIONS */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> 7. SPECIAL TRIP OPTIONS *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.tripType === 'Spiritual' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Ticket className="w-4 h-4" /> Darshan Preference *
                    </label>
                    <select
                      value={formData.darshanPreference}
                      onChange={(e) => setFormData({ ...formData, darshanPreference: e.target.value })}
                      title="Darshan Preference"
                      className="w-full p-3 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                    >
                      <option value="Free">Free</option>
                      <option value="Paid (Sheeghra)">Paid (Sheeghra)</option>
                    </select>
                  </div>
                )}
                {formData.tripType === 'Family' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <UserCheck className="w-4 h-4" /> Senior Citizens? *
                      </label>
                      <select
                        value={formData.seniorCitizens}
                        onChange={(e) => setFormData({ ...formData, seniorCitizens: e.target.value })}
                        title="Senior Citizens"
                        className="w-full p-3 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Baby className="w-4 h-4" /> Children? *
                      </label>
                      <select
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                        title="Children"
                        className="w-full p-3 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none text-sm"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Compass className="w-4 h-4" /> Additional Preferences
              </label>
              <textarea
                value={formData.preferences}
                onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                placeholder="Any other specific requests..."
                title="Additional Preferences"
                className="w-full h-24 p-4 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 transition-all outline-none resize-none text-sm"
              />
            </div>

            <button
              onClick={() => handlePlanTrip()}
              disabled={isPlanning || !formData.from.trim() || !formData.to.trim() || !formData.startDate || !formData.endDate}
              className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-lg"
            >
              {isPlanning ? (
                <div className="w-6 h-6 border-2 border-white/20 dark:border-black/20 border-t-black dark:border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Start AI agent</span>
                </>
              )}
            </button>
          </div>

          {/* AI Chat Assistant */}
          {itinerary && (
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-sm animate-in slide-in-from-left-8 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="font-bold">Smart AI Assistant</h3>
                  <p className="text-xs text-gray-500">Ask for adjustments or tips</p>
                </div>
              </div>

              <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl text-sm text-gray-600 dark:text-gray-300 italic">
                "I can help you adjust the plan, compare vehicles, or give you more do's and don't's. What's on your mind?"
              </div>

              <div className="relative">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="e.g. Can we add more museums? Or make it more budget-friendly?"
                  title="Chat Message"
                  className="w-full h-24 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm focus:border-black/30 dark:focus:border-white/30 transition-all outline-none resize-none"
                />
                <button
                  onClick={handleAskAI}
                  disabled={isAskingAI || !chatMessage.trim()}
                  title="Send Message"
                  aria-label="Send Message"
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Globe or Itinerary */}
        <div className="w-full lg:w-1/2 flex justify-center items-start min-h-125">
          {!itinerary ? (
            <div className="relative w-full max-w-150 aspect-square mt-12">
              <RotatingEarth width={600} height={600} className="w-full h-full" />
              <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-white dark:from-black via-transparent to-transparent" />
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
            <ErrorBoundary>
              <div className="w-full max-w-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 shadow-sm">
                {itinerary.destinationCoordinates && (
                  <div className="relative group w-full overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 h-[500px] bg-gray-100 dark:bg-zinc-900 shadow-2xl">
                    {/* Map Controls */}
                    <div className="absolute top-4 left-4 z-[1001] flex flex-col gap-2">
                      <button
                        onClick={() => setIsLocating(!isLocating)}
                        className={`p-3 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${isLocating
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white/90 dark:bg-black/90 border-black/5 text-gray-700 dark:text-gray-300'
                          }`}
                        title={isLocating ? "Disable Location" : "Show My Location"}
                      >
                        <MapPin className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>

                    <MapContainer
                      center={[itinerary.destinationCoordinates.lat, itinerary.destinationCoordinates.lng]}
                      zoom={6}
                      style={{ height: '100%', width: '100%' }}
                      doubleClickZoom={false}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <LiveLocation isActive={isLocating} setPosition={setUserPosition} />

                      {itinerary.originCoordinates && (
                        <LeafletMarker
                          position={[itinerary.originCoordinates.lat, itinerary.originCoordinates.lng]}
                          icon={fromIcon}
                        >
                          <Popup className="custom-popup">
                            <div className="p-3">
                              <p className="text-sm font-bold text-gray-900">{itinerary.origin}</p>
                              <p className="text-[10px] font-mono text-gray-500 mt-1">
                                {itinerary.originCoordinates.lat.toFixed(4)}, {itinerary.originCoordinates.lng.toFixed(4)}
                              </p>
                            </div>
                          </Popup>
                        </LeafletMarker>
                      )}

                      <LeafletMarker
                        position={[itinerary.destinationCoordinates.lat, itinerary.destinationCoordinates.lng]}
                        icon={toIcon}
                      >
                        <Popup className="custom-popup">
                          <div className="p-3">
                            <p className="text-sm font-bold text-gray-900">{itinerary.destination}</p>
                            <p className="text-[10px] font-mono text-gray-500 mt-1">
                              {itinerary.destinationCoordinates.lat.toFixed(4)}, {itinerary.destinationCoordinates.lng.toFixed(4)}
                            </p>
                          </div>
                        </Popup>
                      </LeafletMarker>

                      {itinerary.originCoordinates && itinerary.destinationCoordinates && (
                        <RoadRoute
                          origin={itinerary.originCoordinates}
                          destination={itinerary.destinationCoordinates}
                        />
                      )}

                      <MapBounds
                        origin={itinerary.originCoordinates}
                        destination={itinerary.destinationCoordinates}
                        recenterTrigger={recenterCount}
                      />

                      <div className="absolute bottom-4 right-4 z-[1000] flex gap-2 pointer-events-auto">
                        <button
                          onClick={() => {
                            setRecenterCount(prev => prev + 1);
                            toast.success('Recenter Route');
                          }}
                          className="bg-white/90 dark:bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-black/5 shadow-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                          title="Recenter Route"
                        >
                          <Route className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        <button
                          onClick={openInMap}
                          className="bg-white/90 dark:bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-black/5 shadow-lg group hover:bg-blue-600 transition-all duration-300"
                          title="Open in native map"
                        >
                          <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
                        </button>
                      </div>
                    </MapContainer>
                  </div>
                )}

                {/* Budget Breakdown Section */}
                {itinerary.budgetBreakdown && (
                  <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-3xl border border-green-100 dark:border-green-800/20">
                    <h4 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Wallet className="w-4 h-4" /> Total Budget Breakdown
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Long Distance</p>
                        <p className="text-sm font-bold">{formatCurrency(itinerary.budgetBreakdown.longDistanceTransport)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Local Transport</p>
                        <p className="text-sm font-bold">{formatCurrency(itinerary.budgetBreakdown.localTransport)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Stay</p>
                        <p className="text-sm font-bold">{formatCurrency(itinerary.budgetBreakdown.accommodation)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Food</p>
                        <p className="text-sm font-bold">{formatCurrency(itinerary.budgetBreakdown.food)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Activities</p>
                        <p className="text-sm font-bold">{formatCurrency(itinerary.budgetBreakdown.activities)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                          <Droplets className="w-2 h-2" /> Water/Drinks
                        </p>
                        <p className="text-sm font-bold">{formatCurrency(itinerary.budgetBreakdown.waterAndRefreshments)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Initial Journey Section */}
                {itinerary.initialJourney && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800/20">
                    <h4 className="text-sm font-bold text-blue-600 dark:text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Route className="w-4 h-4" /> Journey to Destination
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Distance</p>
                        <p className="text-sm font-bold">{itinerary.initialJourney.distance}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Duration</p>
                        <p className="text-sm font-bold">{itinerary.initialJourney.duration}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Mode</p>
                        <p className="text-sm font-bold">{itinerary.initialJourney.transportType}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Departure</p>
                        <p className="text-sm font-bold">{itinerary.initialJourney.departureTime}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Arrival</p>
                        <p className="text-sm font-bold">{itinerary.initialJourney.arrivalTime}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Est. Cost</p>
                        <p className="text-sm font-bold">{formatCurrency(itinerary.initialJourney.cost)}</p>
                      </div>
                    </div>
                  </div>
                )}



                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {itinerary.origin} <span className="text-gray-400 dark:text-gray-500 text-xl mx-2">→</span> {itinerary.destination}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 items-center">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {itinerary.duration}</span>
                      <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {formatCurrency(itinerary.budget)}</span>

                      {/* Audio Summary Button */}
                      <button
                        onClick={() => {
                          if (isSpeaking) {
                            stopSpeaking();
                          } else {
                            const summary = `Trip from ${itinerary.origin} to ${itinerary.destination} for ${itinerary.duration}. Total budget is ${itinerary.budget}. ${itinerary.aiInsights?.whyTheseOptions || ''}`;
                            speak(summary);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isSpeaking
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-black/5 text-black dark:bg-white/10 dark:text-white hover:bg-black/10 dark:hover:bg-white/20'
                          }`}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3" /> Stop Reading
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" /> Read Summary
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setItinerary(null);
                      stopSpeaking();
                    }}
                    className="text-sm text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                </div>

                {/* New Sections: Transportation & Real-time Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {itinerary.transportation && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                      <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Bus className="w-3 h-3" /> Recommended Transport
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-300">{itinerary.transportation}</p>
                    </div>
                  )}
                  {itinerary.realTimeData && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                      <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Cloud className="w-3 h-3" /> Weather & Local Info
                      </h4>
                      <p className="text-sm text-amber-800 dark:text-amber-300">{itinerary.realTimeData.weather}</p>
                    </div>
                  )}
                </div>

                {itinerary.realTimeData && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Car className="w-3 h-3" /> Traffic
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{itinerary.realTimeData.traffic}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3" /> Safety
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{itinerary.realTimeData.safety}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Ticket className="w-3 h-3" /> Events
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{itinerary.realTimeData.events}</p>
                    </div>
                  </div>
                )}

                {/* Vehicle Comparison Section */}
                {itinerary.vehicleComparison && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Car className="w-4 h-4" /> Vehicle Comparison & Guidance
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {itinerary.vehicleComparison?.map((v, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/10 space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-lg">{v.vehicle}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-bold">{formatCurrency(v.cost)}</span>
                          </div>
                          <p className="text-xs text-gray-500">{v.duration} • {v.bestFor}</p>
                          <div className="pt-2 space-y-1">
                            <p className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1">
                              <ThumbsUp className="w-2 h-2" /> {v.pros}
                            </p>
                            <p className="text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1">
                              <ThumbsDown className="w-2 h-2" /> {v.cons}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Group Splitting Section */}
                {itinerary.groupSplitting && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/20">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4" /> Group Expense Summary (Per Person)
                      </h4>
                      <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">Total: {formatCurrency(itinerary.groupSplitting.totalPerPerson)}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {itinerary.groupSplitting.dayWisePerPerson?.map((d, i) => (
                        <div key={i} className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-indigo-100 dark:border-indigo-800/30 text-center">
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Day {d.day}</p>
                          <p className="text-sm font-bold">{formatCurrency(d.amount)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Insights & Recommendations */}
                {itinerary.aiInsights && (
                  <div className="space-y-6">
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-800/20">
                      <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Why this plan is best
                      </h4>
                      <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                        {itinerary.aiInsights.whyTheseOptions}
                      </p>
                      <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800/30">
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold mb-2">Waiting Time Estimates</p>
                        <p className="text-xs italic text-amber-700 dark:text-amber-400">{itinerary.aiInsights.waitingTimeEstimates}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-800/20">
                        <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <ThumbsUp className="w-3 h-3" /> Travel Do's
                        </h4>
                        <ul className="space-y-2">
                          {itinerary.aiInsights.dos?.map((doItem, i) => (
                            <li key={i} className="text-xs text-green-800 dark:text-green-300 flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-green-400 mt-1.5" />
                              {doItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-800/20">
                        <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertCircle className="w-3 h-3" /> Travel Don'ts
                        </h4>
                        <ul className="space-y-2">
                          {itinerary.aiInsights.donts?.map((dontItem, i) => (
                            <li key={i} className="text-xs text-red-800 dark:text-red-300 flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5" />
                              {dontItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- Cost Estimation & Comparison Module --- */}
                <div className="pt-8 border-t border-black/10 dark:border-white/10">
                  <CostComparison tripData={itinerary} />
                </div>

                {/* Booking & Checklist Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itinerary.bookingSuggestions && (
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-3xl border border-purple-100 dark:border-purple-800/20 space-y-4">
                      <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> Booking Suggestions
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
                            <Bus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Transport</p>
                            <p className="text-sm">{itinerary.bookingSuggestions.transport}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
                            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Accommodation</p>
                            <p className="text-sm">{itinerary.bookingSuggestions.accommodation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {itinerary.checklist && (
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-3xl border border-orange-100 dark:border-orange-800/20 space-y-4">
                      <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Essential Checklist
                      </h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {itinerary.checklist?.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {itinerary.extraMoneySuggestion && (
                        <div className="pt-4 border-t border-orange-200 dark:border-orange-800/30">
                          <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                            <Wallet className="w-3 h-3" /> Extra Money Suggestion
                          </p>
                          <p className="text-sm font-bold text-orange-700 dark:text-orange-300">{formatCurrency(itinerary.extraMoneySuggestion)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  {itinerary.days?.map((day: Activity) => (
                    <div key={day.day} className="relative pl-8 border-l border-black/10 dark:border-white/10 space-y-4">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-black dark:bg-white border-4 border-white dark:border-black" />

                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold">Day {day.day}: {day.title}</h3>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                            <IndianRupee className="w-3 h-3" /> {formatCurrency(day.dailyBudget)}
                          </span>
                        </div>
                      </div>

                      {day.dailyTravel && (
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-800/20 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                              <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase font-bold">Daily Travel</p>
                              <p className="text-sm font-medium">{day.dailyTravel.mode} • {day.dailyTravel.distance}</p>
                              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">{day.dailyTravel.timings}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Cost</p>
                            <p className="text-sm font-bold">{formatCurrency(day.dailyTravel.cost)}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                          <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Places to Visit
                          </h4>
                          <ul className="space-y-1">
                            {day.places?.map((place, i) => (
                              <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                                    {place.name}
                                  </div>
                                  <span className="text-[10px] font-bold text-gray-400">{formatCurrency(place.entryFee)}</span>
                                </div>
                                <span className="text-[10px] text-blue-500 dark:text-blue-400 ml-3 font-medium">{place.visitTimings}</span>
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
                            <div key={i} className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600 dark:text-gray-300">{item.item || item.restaurant}</span>
                                <span className="text-[10px] font-bold opacity-50">{formatCurrency(item.cost)}</span>
                              </div>
                              <span className="text-[9px] text-blue-500 dark:text-blue-400 font-bold">{item.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Activities</h4>
                        <ul className="space-y-2">
                          {day.activities?.map((activity, idx: number) => (
                            <li key={idx} className="text-gray-500 dark:text-gray-400 flex items-start justify-between gap-2 text-sm">
                              <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5 shrink-0" />
                                <div className="flex flex-col">
                                  <span>{activity.name}</span>
                                  <span className="text-[10px] text-blue-500 dark:text-blue-400 font-bold">{activity.time}</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold mt-1">{formatCurrency(activity.cost)}</span>
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
            </ErrorBoundary>
          )}
        </div>
      </main >

      <Footer />
    </div >
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Planner Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-200">
          <h3 className="font-bold text-lg mb-2">Something went wrong showing the trip plan.</h3>
          <p className="text-sm mb-4">Please try refreshing or contacting support.</p>
          <pre className="text-xs bg-white/50 p-4 rounded overflow-auto max-h-48 text-black">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Planner;
