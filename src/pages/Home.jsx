import { Link } from "react-router-dom";
import { BedDouble, ShieldCheck, Wifi, MapPin, Sparkles, CalendarCheck, Wallet, Handshake } from "lucide-react";
import SearchBar from "../components/SearchBar";
import UnitCard from "../components/UnitCard";
import MapEmbed from "../components/MapEmbed";
import Reveal from "../components/Reveal";
import { units } from "../data/units";
import { property } from "../data/property";

const features = [
  { icon: BedDouble, title: "Fully Furnished", text: "Modern, stylish and ready for your stay." },
  { icon: ShieldCheck, title: "Safe & Secure", text: "24/7 security and peace of mind." },
  { icon: Wifi, title: "Fast Wi-Fi", text: "Stay connected at all times." },
  { icon: MapPin, title: "Prime Location", text: "Easy access to key areas in Abuja." },
];

const why = [
  { icon: Sparkles, title: "Clean & Modern Spaces", text: "Professionally cleaned before every stay." },
  { icon: CalendarCheck, title: "Flexible Booking", text: "Easy online booking with instant confirmation." },
  { icon: Wallet, title: "Great Rates", text: "Quality stays at competitive prices." },
  { icon: Handshake, title: "Local Support", text: "Quick help, whenever you need it." },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <small>MODERN · COMFORTABLE · SECURE</small>
          <h1>Your Perfect Stay Awaits in Abuja</h1>
          <p>Stylish, fully furnished apartments and rooms for short stays. Comfort, convenience and great service, all in one place.</p>
        </div>
      </section>

      <SearchBar />

      <div className="container features">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 100}>
            <div className="feature">
              <div className="icon"><f.icon size={24} /></div>
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <section className="container section">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Featured apartments</span>
              <h2>Our Apartments &amp; Rooms</h2>
            </div>
            <Link to="/apartments" className="link">View all rooms →</Link>
          </div>
        </Reveal>
        <div className="rooms-grid">
          {units.map((unit, i) => (
            <Reveal key={unit.id} delay={i * 100}>
              <UnitCard unit={unit} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section split">
        <Reveal>
          <img className="split-img" src="/images/lounge.jpg" alt="Lounge" />
        </Reveal>
        <Reveal delay={150}>
          <span className="eyebrow">Why choose us</span>
          <h2>Designed for Comfort, Built for Convenience</h2>
          <div className="why-grid">
            {why.map((w) => (
              <div className="feature" key={w.title}>
                <div className="icon"><w.icon size={24} /></div>
                <h4>{w.title}</h4>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container section split">
        <Reveal>
          <span className="eyebrow">Our location</span>
          <h2>Easy to find. Close to everything you need.</h2>
          <ul className="nearby">
            {property.nearby.map((n) => (
              <li key={n.name}><span>{n.name}</span><span>{n.time}</span></li>
            ))}
          </ul>
          <a className="btn" href={property.directionsUrl} target="_blank" rel="noreferrer">
            <MapPin size={18} /> Get directions
          </a>
        </Reveal>
        <Reveal delay={150}>
          <MapEmbed />
        </Reveal>
      </section>
    </>
  );
}