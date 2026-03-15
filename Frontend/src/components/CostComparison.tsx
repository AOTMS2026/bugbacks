import { IndianRupee, MapPin, Star, AlertTriangle, CheckCircle, Car, Bus, Train, Plane, Loader2 } from "lucide-react";

interface HotelOption {
  name: string;
  costPerNight: number;
  rating: number;
  distanceFromCenter: string;
}

interface CostEstimationProps {
  tripData: {
    origin: string;
    destination: string;
    budget: string | number;
    vehicleComparison?: Array<{
      vehicle: string;
      cost: string;
      duration: string;
      pros: string;
      cons: string;
    }>;
    days?: any[];
  } | null;
}

export const CostComparison = ({ tripData }: CostEstimationProps) => {
  if (!tripData) return null;

  const budgetValue = typeof tripData.budget === "string" 
    ? parseFloat(tripData.budget.replace(/[^0-9.]/g, "")) || 0 
    : tripData.budget;

  const transportOptions = (tripData.vehicleComparison || []).map(v => ({
    mode: v.vehicle,
    cost: parseFloat(v.cost.replace(/[^0-9.]/g, "")) || 0,
    duration: v.duration,
    pros: v.pros,
    cons: v.cons
  }));

  const hotelOptions: HotelOption[] = [
    { name: "Luxury Resort", costPerNight: 8500, rating: 4.8, distanceFromCenter: "2.5 km" },
    { name: "Modern Boutique Hotel", costPerNight: 4500, rating: 4.5, distanceFromCenter: "0.8 km" },
    { name: "Premium Heritage Stay", costPerNight: 6200, rating: 4.6, distanceFromCenter: "1.2 km" },
    { name: "Standard Comfort Hotel", costPerNight: 2800, rating: 4.2, distanceFromCenter: "3.0 km" },
    { name: "Budget Friendly Inn", costPerNight: 1200, rating: 3.8, distanceFromCenter: "5.0 km" }
  ].filter(h => h.costPerNight < budgetValue / 2);

  const daysCount = tripData.days?.length || 1;
  const foodEst = 800 * daysCount;
  const activitiesEst = 1500;
  const selectedTransport = transportOptions[0]?.cost || 0;
  const selectedHotel = (hotelOptions[1]?.costPerNight || 3000) * daysCount;
  
  const totalEstimatedCost = selectedTransport + selectedHotel + foodEst + activitiesEst;
  const budgetStatus = totalEstimatedCost <= budgetValue ? "Within Budget" : "Exceeds Budget";

  const getTransportIcon = (mode: string) => {
    switch(mode.toLowerCase()) {
      case "flight": case "plane": return <Plane className="w-5 h-5 text-indigo-500" />;
      case "train": return <Train className="w-5 h-5 text-blue-500" />;
      case "bus": return <Bus className="w-5 h-5 text-emerald-500" />;
      default: return <Car className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700 mt-10">
      <div className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8">
            {budgetStatus === "Within Budget" ? (
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 text-sm font-black uppercase tracking-tighter">
                    <CheckCircle className="w-4 h-4" /> Within Budget
                </div>
            ) : (
                <div className="flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2 rounded-full border border-red-500/20 text-sm font-black uppercase tracking-tighter">
                    <AlertTriangle className="w-4 h-4" /> Exceeds Budget
                </div>
            )}
        </div>
        
        <h2 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            COST ESTIMATION SUMMARY
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Total Estimated</span>
                <div className="text-4xl font-black tracking-tighter text-black dark:text-white">
                    ?{totalEstimatedCost.toLocaleString()}
                </div>
            </div>
            <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Your Budget</span>
                <div className="text-4xl font-black tracking-tighter text-zinc-300 dark:text-zinc-700">
                    ?{budgetValue.toLocaleString()}
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold border-l-4 border-blue-500 pl-4 tracking-tight">TRANSPORT COMPARISON</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {transportOptions.map((opt, idx) => (
                <div key={idx} className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:bg-blue-500/10 transition-colors">
                            {getTransportIcon(opt.mode)}
                        </div>
                        <span className="text-sm font-black text-blue-500 tracking-tighter uppercase">{opt.duration}</span>
                    </div>
                    <h4 className="font-black uppercase text-lg mb-1">{opt.mode}</h4>
                    <div className="text-2xl font-black mb-4 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-zinc-400" />
                        {opt.cost.toLocaleString()}
                    </div>
                    <div className="space-y-2 text-xs font-medium text-zinc-500">
                        <p className="flex items-start gap-2 italic"><span className="text-emerald-500">?</span> {opt.pros}</p>
                        <p className="flex items-start gap-2 italic"><span className="text-red-500">?</span> {opt.cons}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold border-l-4 border-amber-500 pl-4 tracking-tight">STAY ESTIMATIONS</h3>
        <div className="grid grid-cols-1 gap-4">
            {hotelOptions.map((hotel, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <Star className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg leading-tight uppercase">{hotel.name}</h4>
                            <div className="flex items-center gap-3 text-xs font-black text-zinc-400 uppercase tracking-widest mt-1">
                                <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {hotel.rating}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {hotel.distanceFromCenter} from City Center</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-black text-zinc-400 uppercase tracking-widest">Avg. per night</div>
                        <div className="text-3xl font-black tracking-tighter">?{hotel.costPerNight.toLocaleString()}</div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
