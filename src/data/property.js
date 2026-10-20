const mapQuery = "Jabi Lake Mall, Abuja"; // swap for the real address later

export const property = {
  name: "The Haven",
  city: "Abuja",
  address: "Jabi, Abuja",
  phone: "+234 902 685 1735",
  whatsapp: "2349026851735",
  email: "stay@thehaven.ng",
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM",
  mapQuery,
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(mapQuery),
  nearby: [
    { name: "Jabi Lake Mall", time: "10 mins" },
    { name: "Nnamdi Azikiwe International Airport", time: "30 mins" },
    { name: "Wuse Market", time: "15 mins" },
    { name: "City Centre", time: "12 mins" },
  ],
};