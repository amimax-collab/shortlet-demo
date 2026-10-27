import { CircleCheck, MapPin } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { units } from "../data/units.js";
import { property } from "../data/property.js";
import { getBookings } from "../utils/booking.js";
import { formatDate, naira } from "../utils/dates.js";
import { services } from "../data/services";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappLink } from "../utils/whatsapp";

export default function Confirmation() {
  const [params] = useSearchParams();
  const booking = getBookings().find((b) => b.id === params.get("ref"));
  const unit = booking && units.find((u) => u.id === booking.unitId);
  const message =
  `Hello ${property.name}, this is ${booking.guest}. I just booked the ${unit.name} ` +
  `(ref ${booking.id}) from ${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)} ` +
  `for ${booking.guests} guest${booking.guests > 1 ? "s" : ""}. I have a question about my booking.`;
  const extras = services.filter((s) => booking?.services?.includes(s.id));

  if (!booking || !unit) {
    return (
      <div className="container page">
        <h2>Booking not found</h2>
        <Link to="/" className="btn">Go home</Link>
      </div>
    );
  }

  return (
    <div className="container page" style={{ maxWidth: 640 }}>
      <div className="card" style={{ textAlign: "center" }}>
          <CircleCheck className="pop" size={56} color="#1f6b4a" />
        <h1 style={{ margin: "8px 0" }}>Booking confirmed</h1>
        <p className="muted">A confirmation has been sent to {booking.email}.</p>
        <p><strong>Reference: {booking.id}</strong></p>

        <div style={{ textAlign: "left", marginTop: 20 }}>
          <div className="price-row"><span>Apartment</span><span>{unit.name}</span></div>
          <div className="price-row"><span>Check-in</span><span>{formatDate(booking.checkIn)} · from {property.checkInTime}</span></div>
          <div className="price-row"><span>Check-out</span><span>{formatDate(booking.checkOut)} · by {property.checkOutTime}</span></div>
          <div className="price-row"><span>Guests</span><span>{booking.guests}</span></div>
          {extras.length > 0 && (
            <div className="price-row"><span>Extra services</span><span>{extras.map((e) => e.name).join(", ")}</span></div>
          )}
          <div className="price-row total"><span>Total paid</span><span>{naira(booking.total)}</span></div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
          <a className="btn" href={property.directionsUrl} target="_blank" rel="noreferrer">
            <MapPin size={18} /> Get directions
          </a>
          <a className="btn btn-outline" href={whatsappLink(message)} target="_blank" rel="noreferrer">
            <FaWhatsapp size={18} /> WhatsApp us
          </a>
        </div>
      </div>
    </div>
  );
}