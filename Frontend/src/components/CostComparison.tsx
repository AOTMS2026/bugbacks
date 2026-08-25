import { IndianRupee, MapPin, Star, AlertTriangle, CheckCircle, Car, Bus, Train, Plane, Loader2 } from 'lucide-react';



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
    vehicleComparison?: any[];
    days?: any[];
  } | null;
}

export const CostComparison = ({ tripData }: CostEstimationProps) => {
  if (!tripData) return null;

  // Derive estimates from AI trip data if present
  const budgetValue = typeof tripData.budget === 'string' 
    ? parseFloat(tripData.budget.replace(/[^0-9.]/g, '')) || 0 
    : tripData.budget;

  const transportOptions = (tripData.vehicleComparison || []).map(v => ({
    mode: v.vehicle,
    cost: parseFloat(v.cost.replace(/[^0-9.]/g, '')) || 0,
    duration: v.duration,
    pros: v.pros,
    cons: v.cons
  }));

  // Mock hotel options for comparison based on destination context
  const hotelOptions: HotelOption[] = [
    { name: 'Luxury Resort', costPerNight: 8500, rating: 4.8, distanceFromCenter: '2.5 km' },
    { name: 'Modern Boutique Hotel', costPerNight: 4500, rating: 4.5, distanceFromCenter: '0.8 km' },
    { name: 'Premium Heritage Stay', costPerNight: 6200, rating: 4.6, distanceFromCenter: '1.2 km' },
    { name: 'Standard Comfort Hotel', costPerNight: 2800, rating: 4.2, distanceFromCenter: '3.0 km' },
    { name: 'Budget Friendly Inn', costPerNight: 1200, rating: 3.8, distanceFromCenter: '5.0 km' }
  ].filter(h => h.costPerNight < budgetValue / 2); // Simple logic to show relevant hotels

  const daysCount = tripData.days?.length || 1;
  const foodEst = 800 * daysCount; // Standard estimate per person
  const activitiesEst = 1500; // Average activity cost
  const selectedTransport = transportOptions[0]?.cost || 0;
  const selectedHotel = (hotelOptions[1]?.costPerNight || 3000) * daysCount;
  
  const totalEstimatedCost = selectedTransport + selectedHotel + foodEst + activitiesEst;
  const budgetStatus = totalEstimatedCost <= budgetValue ? 'Within Budget' : 'Exceeds Budget';

  const getTransportIcon = (mode: string) => {
    switch(mode.toLowerCase()) {
      case 'flight': case 'plane': return <Plane className="w-5 h-5 text-indigo-500" />;
      case 'train': return <Train className="w-5 h-5 text-blue-500" />;
      case 'bus': return <Bus className="w-5 h-5 text-emerald-500" />;
      default: return <Car className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
      {/* 1. Comparison Summary Card */}
      <div className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8">
            {budgetStatus === 'Within Budget' ? (
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
                    ₹{totalEstimatedCost.toLocaleString()}
                </div>
            </div>
            <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Your Budget</span>
                <div className="text-4xl font-black tracking-tighter text-zinc-300 dark:text-zinc-700">
                    ₹{budgetValue.toLocaleString()}
                </div>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-4 pt-4 md:pt-0">
                <div className="flex justify-between text-xs font-black uppercase">
                    <span className="text-zinc-500 uppercase">Budget Utilization</span>
                    <span className={budgetStatus === 'Within Budget' ? 'text-emerald-500' : 'text-red-500'}>
                        {((totalEstimatedCost / budgetValue) * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden border-2 border-zinc-300 dark:border-zinc-700">
                    <div 
                        className={`h-full transition-all duration-1000 ${budgetStatus === 'Within Budget' ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min((totalEstimatedCost / budgetValue) * 100, 100)}%` }}
                    />
                </div>
                {budgetStatus !== 'Within Budget' && (
                    <p className="text-[10px] font-bold text-red-500/80 italic animate-pulse">
                        * Note: High costs detected. Consider switching to Train/Bus for transport or choosing standard hotel options.
                    </p>
                )}
            </div>
        </div>
      </div>

      {/* 2. Transport Comparison */}
      <div className="space-y-6">
        <h3 className="text-xl font-black tracking-tight italic flex items-center gap-2">
            <div className="w-8 h-1 bg-blue-500 rounded-full" /> TRANSPORT COMPARISON
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(tripData.vehicleComparison || []).map((v, i) => (
                <div key={i} className="group relative bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            {getTransportIcon(v.vehicle)}
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase italic">{v.duration}</div>
                            <div className="text-lg font-black tracking-tight text-blue-600 dark:text-blue-400">{v.cost}</div>
                        </div>
                    </div>
                    <h4 className="text-lg font-black uppercase mb-4 tracking-tighter">{v.vehicle}</h4>
                    <div className="space-y-4">
                        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/10">
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">PROS</span>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{v.pros}</p>
                        </div>
                        <div className="bg-red-500/5 dark:bg-red-500/10 p-3 rounded-xl border border-red-500/10">
                            <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest block mb-1">CONS</span>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{v.cons}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 3. Hotel Estimates */}
      <div className="space-y-6">
        <h3 className="text-xl font-black tracking-tight italic flex items-center gap-2">
            <div className="w-8 h-1 bg-amber-500 rounded-full" /> HOTEL ESTIMATES
        </h3>
        <div className="overflow-x-auto rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left border-collapse bg-white dark:bg-zinc-950">
                <thead className="bg-zinc-50 dark:bg-zinc-900 italic border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                        <th className="px-8 py-6 text-[10px] font-black tracking-widest uppercase text-zinc-400">HOTEL NAME</th>
                        <th className="px-8 py-6 text-[10px] font-black tracking-widest uppercase text-zinc-400">RATING</th>
                        <th className="px-8 py-6 text-[10px] font-black tracking-widest uppercase text-zinc-400">DISTANCE</th>
                        <th className="px-8 py-6 text-[10px] font-black tracking-widest uppercase text-zinc-400 text-right">PRICE / NIGHT</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {hotelOptions.map((h, i) => (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                            <td className="px-8 py-6 font-black tracking-tight uppercase">{h.name}</td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg w-fit text-xs font-black">
                                    <Star className="w-3 h-3 fill-current" /> {h.rating}
                                </div>
                            </td>
                            <td className="px-8 py-6 text-zinc-500 font-medium text-xs flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {h.distanceFromCenter} from center
                            </td>
                            <td className="px-8 py-6 text-right font-black text-black dark:text-white tracking-widest">
                                ₹{h.costPerNight.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* 4. Complete Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="space-y-6">
            <h4 className="text-xl font-black tracking-tight italic uppercase">Total Budget Breakdown</h4>
            <div className="space-y-4">
                {[
                    { label: 'TRANSPORT', cost: selectedTransport, color: 'bg-blue-500' },
                    { label: 'STAY / HOTEL', cost: selectedHotel, color: 'bg-amber-500' },
                    { label: 'FOOD & MEALS', cost: foodEst, color: 'bg-emerald-500' },
                    { label: 'ACTIVITIES', cost: activitiesEst, color: 'bg-indigo-500' }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
                        <div className="flex-1 border-b border-dotted border-zinc-200 dark:border-zinc-800" />
                        <span className="font-black text-zinc-900 dark:text-zinc-100">₹{item.cost.toLocaleString()}</span>
                    </div>
                ))}
                <div className="flex items-center gap-4 pt-4 mt-4 border-t-2 border-dashed border-zinc-100 dark:border-zinc-800">
                    <span className="text-lg font-black tracking-tighter italic">ESTIMATED TOTAL</span>
                    <div className="flex-1" />
                    <span className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400">₹{totalEstimatedCost.toLocaleString()}</span>
                </div>
            </div>
        </div>
        
        <div className="bg-zinc-100 dark:bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center text-center">
            <IndianRupee className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h4 className="text-lg font-black mb-2 opacity-50 italic">Financial Insight</h4>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed italic pr-2">
                "By choosing <strong>Standard Comfort Hotel</strong> and <strong>Train</strong> as your primary mode of transport, you can save up to <strong>₹{(selectedHotel - 1200*daysCount + selectedTransport - (transportOptions[1]?.cost || 0)).toLocaleString()}</strong> which could be reallocated for luxury dining or unique desert activities."
            </p>
        </div>
      </div>
    </div>
  );
};
