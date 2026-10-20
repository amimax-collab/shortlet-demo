import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toISO, addDays } from "../utils/dates";

export default function SearchBar() {
  const navigate = useNavigate();
  const today = toISO(new Date());
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  function handleCheckIn(value) {
    setCheckIn(value);
    if (checkOut && checkOut <= value) setCheckOut("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("in", checkIn);
    if (checkOut) params.set("out", checkOut);
    params.set("guests", guests);
    navigate(`/apartments?${params}`);
  }

  return (
    <div className="container search-wrap">
      <form className="search-bar" onSubmit={handleSubmit}>
        <label className="field">
          Location
          <select defaultValue="Abuja"><option>Abuja</option></select>
        </label>
        <label className="field">
          Check-in
          <input type="date" min={today} value={checkIn} onChange={(e) => handleCheckIn(e.target.value)} />
        </label>
        <label className="field">
          Check-out
          <input
            type="date"
            min={checkIn ? addDays(checkIn, 1) : today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </label>
        <label className="field">
          Guests
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
            ))}
          </select>
        </label>
        <button className="btn" type="submit">Search</button>
      </form>
    </div>
  );
}