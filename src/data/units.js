import { Wifi, Snowflake, Tv, CookingPot, Zap, ShieldCheck, Car, WashingMachine, Laptop, Coffee } from "lucide-react";

const A = {
  wifi: { icon: Wifi, label: "Fast Wi-Fi" },
  ac: { icon: Snowflake, label: "Air conditioning" },
  tv: { icon: Tv, label: "Smart TV" },
  kitchen: { icon: CookingPot, label: "Equipped kitchen" },
  power: { icon: Zap, label: "24/7 power" },
  security: { icon: ShieldCheck, label: "24/7 security" },
  parking: { icon: Car, label: "Free parking" },
  laundry: { icon: WashingMachine, label: "Washing machine" },
  desk: { icon: Laptop, label: "Work desk" },
  breakfast: { icon: Coffee, label: "Breakfast on request" },
};

export const units = [
  {
    id: "standard-room", name: "Standard Room", guests: 2, beds: 1, baths: 1, size: "28 m²",
    pricePerNight: 65000,
    image: "/images/standard-room.jpg",
    gallery: [
      "/images/standard-room.jpg",
      "/images/standard-2.jpg",
      "/images/standard-3.jpg",
      "/images/standard-4.jpg",
    ],
    description: "A cosy, fully furnished room that's perfect for solo travellers and couples who want comfort without the fuss.",
    amenities: [A.wifi, A.ac, A.tv, A.power, A.security, A.desk],
  },
  {
    id: "one-bedroom", name: "One Bedroom Apartment", guests: 2, beds: 1, baths: 1, size: "45 m²",
    pricePerNight: 95000,
    image: "/images/one-bed.jpg",
    gallery: [
      "/images/one-bed.jpg",
      "/images/one-bed-2.jpg",
      "/images/one-bed-3.jpg",
      "/images/one-bed-4.jpg",
    ],
    description: "A private one bedroom apartment with its own living room and kitchen. A home away from home for longer stays.",
    amenities: [A.wifi, A.ac, A.tv, A.kitchen, A.power, A.security, A.laundry, A.desk],
  },
  {
    id: "two-bedroom", name: "Two Bedroom Apartment", guests: 4, beds: 2, baths: 2, size: "78 m²",
    pricePerNight: 145000,
    image: "/images/two-bed-1.jpg",
    gallery: [
      "/images/two-bed-1.jpg",
      "/images/two-bed-2.jpg",
      "/images/two-bed-3.jpg",
      "/images/two-bed-4.jpg",
    ],
    description: "Spacious two bedroom apartment for families and small groups, with a dining area and a full kitchen.",
    amenities: [A.wifi, A.ac, A.tv, A.kitchen, A.power, A.security, A.parking, A.laundry],
  },
  {
    id: "executive-suite", name: "Executive Suite", guests: 2, beds: 1, baths: 1, size: "60 m²",
    pricePerNight: 180000,
    image: "/images/three-bed.jpg",
    gallery: [
      "/images/three-bed.jpg",
      "/images/three-bed-2.jpg",
      "/images/three-bed-3.jpg",
      "/images/three-bed-4.jpg",
    ],
    description: "Our premium suite with a king bed, a lounge area and the best views in the building. Made for business and special stays.",
    amenities: [A.wifi, A.ac, A.tv, A.kitchen, A.power, A.security, A.parking, A.breakfast, A.desk],
  },
];