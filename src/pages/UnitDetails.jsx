import { useState } from "react";
import { services } from "../data/services";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Calendar from "../components/Calendar.jsx";
import { units } from "../data/units.js";
import { property } from "../data/property.js";
import { calcTotal, getBookings, isRangeAvailable } from "../utils/booking.js";
import { formatDate, naira, nightsBetween } from "../utils/dates.js";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappLink } from "../utils/whatsapp";

export default function UnitDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const unit = units.find((u) => u.id === id);

  const [bookings] = useState(getBookings);
  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState(params.get("in") || "");
  const [checkOut, setCheckOut] = useState(params.get("out") || "");
  const [guests, setGuests] = useState(Number(params.get("guests")) || 1);

  if (!unit) {
    return (
      <div className="container page">
        <h2>Apartment not found</h2>
        <Link to="/apartments" className="btn">Back to apartments</Link>
      </div>
    );
  }

  const g = Math.min(guests, unit.guests);
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const valid = nights > 0 && isRangeAvailable(unit.id, checkIn, checkOut, bookings);
  const price = calcTotal(unit, nights);

  // const askMessage = valid
  // ? `Hello ${property.name}, I'm interested in the ${unit.name} from ${formatDate(checkIn)} to ${formatDate(checkOut)} for ${g} guest${g > 1 ? "s" : ""}. Is it available?`
  // : `Hello ${property.name}, I'd like to know more about the ${unit.name}.`;

  function handleDates(a, b) {
    setCheckIn(a);
    setCheckOut(b);
  }

  function reserve() {
    const p = new URLSearchParams({ unit: unit.id, in: checkIn, out: checkOut, guests: g });
    navigate(`/checkout?${p}`);
  }

  return (
    <div className="container page">
      <Link to="/apartments" className="link">← All apartments</Link>
      <h1>{unit.name}</h1>
      <p className="muted">{unit.guests} guests · {unit.beds} bed · {unit.baths} bath · {unit.size}</p>

      <div className="details">
        <div>
            <img key={activeImg} className="gallery-main fade-in" src={unit.gallery[activeImg]} alt={unit.name} />
          <div className="thumbs">
            {unit.gallery.map((src, i) => (
              <img key={src} src={src} alt="" className={i === activeImg ? "active" : ""} onClick={() => setActiveImg(i)} />
            ))}
          </div>

          <h3>About this place</h3>
          <p>{unit.description}</p>

          <h3>Amenities</h3>
          <ul className="amenities">
            {unit.amenities.map((a) => (
              <li key={a.label}><a.icon size={18} /> {a.label}</li>
            ))}
          </ul>
          <h3>Extra services</h3>
          <ul className="amenities">
            {services.map((s) => (
              <li key={s.id}><s.icon size={18} /> {s.name} · {naira(s.price)}{s.type === "perNight" ? "/night" : ""}</li>
            ))}
          </ul>

          <h3>House rules</h3>
          <p className="muted">Check-in from {property.checkInTime} · Check-out by {property.checkOutTime} · No smoking · No parties</p>
        </div>

        <aside className="card booking-card">
          <p className="unit-price">{naira(unit.pricePerNight)} <span>/ night</span></p>
          <Calendar unitId={unit.id} bookings={bookings} checkIn={checkIn} checkOut={checkOut} onChange={handleDates} />

          <label className="field" style={{ marginTop: 14 }}>
            Guests
            <select value={g} onChange={(e) => setGuests(Number(e.target.value))}>
              {Array.from({ length: unit.guests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </label>

          {valid ? (
            <div style={{ marginTop: 14 }}>
              <p className="muted" style={{ margin: "0 0 8px" }}>{formatDate(checkIn)} → {formatDate(checkOut)}</p>
              <div className="price-row"><span>{naira(unit.pricePerNight)} × {nights} night{nights > 1 ? "s" : ""}</span><span>{naira(price.subtotal)}</span></div>
              <div className="price-row total"><span>Total</span><span>{naira(price.total)}</span></div>
              <p className="muted" style={{ fontSize: 12, margin: "8px 0 0" }}>Extra services can be added at checkout.</p>
            </div>
          ) : (
            <p className="muted" style={{ marginTop: 14 }}>Select your check-in and check-out dates.</p>
          )}

          <button className="btn" style={{ width: "100%", marginTop: 14 }} disabled={!valid} onClick={reserve}>
            Reserve now
          </button>
          {/* <a className="btn btn-outline" style={{ width: "100%", marginTop: 10 }} href={whatsappLink(askMessage)} target="_blank" rel="noreferrer">
            <FaWhatsapp size={18} /> Ask about this apartment
          </a> */}
        </aside>
      </div>
    </div>
  );
}