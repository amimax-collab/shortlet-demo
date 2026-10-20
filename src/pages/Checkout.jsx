import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { units } from "../data/units";
import { services } from "../data/services";
import { addBooking, calcTotal } from "../utils/booking";
import { formatDate, naira, nightsBetween } from "../utils/dates";

export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const unit = units.find((u) => u.id === params.get("unit"));
  const checkIn = params.get("in");
  const checkOut = params.get("out");
  const guests = Number(params.get("guests")) || 1;

  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [selected, setSelected] = useState([]); // ids of the extra services the guest ticked
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  if (!unit || !checkIn || !checkOut) {
    return (
      <div className="container page">
        <h2>Missing booking details</h2>
        <Link to="/apartments" className="btn">Browse apartments</Link>
      </div>
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const price = calcTotal(unit, nights, selected);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // The (prev) => ... form always starts from the latest list, so quick clicks never get lost
  const toggleService = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  function handlePay(e) {
    e.preventDefault();
    setError("");
    setPaying(true);

    // BACKEND LATER: open Paystack here, and only save the booking after payment is verified.
    setTimeout(() => {
      const result = addBooking({
        unitId: unit.id, guest: form.name, email: form.email, phone: form.phone,
        notes: form.notes, checkIn, checkOut, guests, services: selected, total: price.total,
      });
      if (!result.ok) {
        setError("Sorry, those dates were just taken. Please choose different dates.");
        setPaying(false);
        return;
      }
      navigate(`/confirmation?ref=${result.booking.id}`);
    }, 1500);
  }

  return (
    <div className="container page">
      <h1>Confirm your booking</h1>
      <div className="checkout">
        <form className="card" onSubmit={handlePay}>
          <h3 style={{ marginTop: 0 }}>Guest details</h3>
          <label className="field">Full name<input name="name" required value={form.name} onChange={handleChange} /></label>
          <label className="field">Email<input name="email" type="email" required value={form.email} onChange={handleChange} /></label>
          <label className="field">Phone number<input name="phone" type="tel" required value={form.phone} onChange={handleChange} /></label>
          <label className="field">Special requests (optional)<textarea name="notes" rows="3" value={form.notes} onChange={handleChange} /></label>

          <h3>Add extra services <span className="muted" style={{ fontSize: 13, fontWeight: 400 }}>(optional)</span></h3>
          <div className="service-list">
            {services.map((s) => {
              const on = selected.includes(s.id);
              return (
                <label key={s.id} className={`service ${on ? "on" : ""}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleService(s.id)} />
                  <s.icon size={20} />
                  <div className="service-info">
                    <strong>{s.name}</strong>
                    <span>{s.description}</span>
                  </div>
                  <span className="service-price">{naira(s.price)}{s.type === "perNight" ? "/night" : ""}</span>
                </label>
              );
            })}
          </div>

          {error && <p className="error">{error}</p>}
          <button className="btn" type="submit" disabled={paying} style={{ width: "100%", marginTop: 16 }}>
            {paying ? <><span className="spinner" /> Processing payment…</> : `Pay ${naira(price.total)} with Paystack`}
          </button>
          <p className="muted" style={{ fontSize: 12 }}>Demo mode: no real payment is taken.</p>
        </form>

        <aside className="card">
          <img src={unit.image} alt={unit.name} style={{ borderRadius: 8, marginBottom: 12 }} />
          <h3 style={{ margin: "0 0 4px" }}>{unit.name}</h3>
          <p className="muted" style={{ margin: "0 0 12px" }}>
            {formatDate(checkIn)} → {formatDate(checkOut)} · {guests} guest{guests > 1 ? "s" : ""}
          </p>
          <div className="price-row"><span>{naira(unit.pricePerNight)} × {nights} night{nights > 1 ? "s" : ""}</span><span>{naira(price.subtotal)}</span></div>
          {price.extras.map((e) => (
            <div className="price-row" key={e.id}><span>{e.name}</span><span>{naira(e.amount)}</span></div>
          ))}
          <div className="price-row total"><span>Total</span><span>{naira(price.total)}</span></div>
        </aside>
      </div>
    </div>
  );
}