import { Link, useLocation, useSearchParams } from "react-router-dom";
import UnitCard from "../components/UnitCard.jsx";
import { units } from "../data/units.js";
import { getBookings, isRangeAvailable } from "../utils/booking";
import { formatDate } from "../utils/dates";

export default function Apartments() {
  const [params] = useSearchParams();
  const { search } = useLocation();
  const checkIn = params.get("in") || "";
  const checkOut = params.get("out") || "";
  const guests = Number(params.get("guests")) || 1;

  const bookings = getBookings();
  const results = units.filter(
    (u) =>
      u.guests >= guests &&
      (!checkIn || !checkOut || isRangeAvailable(u.id, checkIn, checkOut, bookings))
  );

  return (
    <div className="container page">
      <h1>Apartments &amp; Rooms</h1>
      {checkIn && checkOut && (
        <p className="muted">
          {formatDate(checkIn)} → {formatDate(checkOut)} · {guests} guest{guests > 1 ? "s" : ""} ·{" "}
          <Link to="/" className="link">Change search</Link>
        </p>
      )}

      {results.length === 0 ? (
        <div className="card">
          <h3>No apartments available for those dates</h3>
          <p className="muted">Try different dates or fewer guests.</p>
          <Link to="/apartments" className="btn">See all rooms</Link>
        </div>
      ) : (
        <div className="rooms-grid">
          {results.map((u) => <UnitCard key={u.id} unit={u} search={search} />)}
        </div>
      )}
    </div>
  );
}