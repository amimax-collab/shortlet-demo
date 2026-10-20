import { Link } from "react-router-dom";
import { property } from "../data/property";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>{property.name}</strong>
          <div style={{ fontSize: 14, opacity: 0.7 }}>{property.address}</div>
        </div>
        <div>
          <Link to="/">Home</Link>
          <Link to="/apartments">Rooms</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin">Owner login</Link>
        </div>
      </div>
      <div className="container">
        <small>© {new Date().getFullYear()} {property.name} Short Lets. Stay Well. Stay Good.</small>
      </div>
    </footer>
  );
}