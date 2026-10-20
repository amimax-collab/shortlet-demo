import { Link } from "react-router-dom";
import { naira } from "../utils/dates";

export default function UnitCard({ unit, search = "" }) {
  return (
    <div className="unit-card">
      <img src={unit.image} alt={unit.name} />
      <div className="unit-card-body">
        <h3>{unit.name}</h3>
        <p className="unit-meta">
          {unit.guests} Guests · {unit.beds} Bed · {unit.baths} Bath
        </p>
        <p className="unit-price">
          {naira(unit.pricePerNight)} <span>/ night</span>
        </p>
        <Link to={`/apartments/${unit.id}${search}`} className="btn btn-outline">
          View details →
        </Link>
      </div>
    </div>
  );
}