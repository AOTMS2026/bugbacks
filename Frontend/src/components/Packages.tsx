"use client";

import { Pricing } from "./blocks/pricing";

const travelPackages = [
  {
    name: "ESSENTIAL ESCAPE",
    price: "299",
    yearlyPrice: "249",
    period: "per person",
    features: [
      "3 Nights / 4 Days",
      "Standard Hotel Accommodation",
      "Daily Breakfast included",
      "Basic City Tour",
      "24/7 Virtual Support",
    ],
    description: "Perfect for a quick weekend getaway",
    buttonText: "Book Now",
    href: "/booking/service?type=Essential",
    isPopular: false,
  },
  {
    name: "PREMIUM VACATION",
    price: "599",
    yearlyPrice: "499",
    period: "per person",
    features: [
      "4 Nights / 5 Days",
      "4-Star Resort Accommodation",
      "All Meals included",
      "Guided Sightseeing Tours",
      "Airport Transfers",
      "Priority Support",
      "Customizable Itinerary",
    ],
    description: "Ideal for families and couples looking for comfort",
    buttonText: "Get Started",
    href: "/booking/service?type=Premium",
    isPopular: true,
  },
  {
    name: "ULTIMATE ITINERARY",
    price: "1299",
    yearlyPrice: "999",
    period: "per person",
    features: [
      "7 Nights / 8 Days",
      "5-Star Luxury Stays",
      "Private Chauffeur Service",
      "Exclusive VIP Experiences",
      "Dedicated Travel Concierge",
      "Flexible Travel Dates",
      "Full Travel Insurance",
      "Spa & Wellness Package",
    ],
    description: "For travelers who want the absolute best experience",
    buttonText: "Contact Us",
    href: "/booking/service?type=Ultimate",
    isPopular: false,
  },
];

export function Packages() {
  return (
    <section id="packages" className="w-full bg-white dark:bg-black py-20 transition-colors duration-300">
      <Pricing 
        plans={travelPackages}
        title="Curated Travel Packages"
        description="Choose the perfect vacation plan that works for you. \nAll packages include expert itinerary planning and 24/7 dedicated support."
      />
    </section>
  );
}
