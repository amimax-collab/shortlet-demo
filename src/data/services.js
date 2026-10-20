import { Plane, Coffee, Shirt, ChefHat, Sparkles, Clock } from "lucide-react";

// type: "once" = charged once per booking, "perNight" = charged for every night
export const services = [
  { id: "airport", name: "Airport pickup", description: "A driver meets you at the airport and takes you straight to the apartment.", price: 25000, type: "once", icon: Plane },
  { id: "breakfast", name: "Daily breakfast", description: "Fresh breakfast served to your door every morning.", price: 8000, type: "perNight", icon: Coffee },
  { id: "housekeeping", name: "Daily housekeeping", description: "Your space freshened and towels changed every day.", price: 7000, type: "perNight", icon: Sparkles },
  { id: "laundry", name: "Laundry service", description: "Washed, dried and folded, returned within 24 hours.", price: 10000, type: "once", icon: Shirt },
  { id: "chef", name: "Private chef", description: "A home-cooked dinner prepared in your apartment.", price: 40000, type: "once", icon: ChefHat },
  { id: "late-checkout", name: "Late check-out", description: "Keep the apartment until 4:00 PM on your last day.", price: 15000, type: "once", icon: Clock },
];