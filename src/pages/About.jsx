import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, CalendarCheck, Clock } from "lucide-react";
import VideoBackground from "../components/VideoBackground";
import Reveal from "../components/Reveal";
import { services } from "../data/services";
import { property } from "../data/property";
import { naira } from "../utils/dates";

const highlights = [
  { icon: ShieldCheck, title: "24/7 security", text: "Round-the-clock security for your peace of mind." },
  { icon: Zap, title: "Reliable power", text: "Steady electricity so your stay is never interrupted." },
  { icon: CalendarCheck, title: "Instant booking", text: "Pick your dates, pay online and get confirmed right away." },
  { icon: Clock, title: "Relaxed check-out", text: `Stay until ${property.checkOutTime} on your last day.` },
];

export default function About() {
  return (
    <>
      <VideoBackground src="/videos/property.mp4" poster="/images/hero.jpg" className="about-hero">
        <span className="eyebrow light">About {property.name}</span>
        <h1>A calmer way to stay in {property.city}</h1>
        <p>Stylish, fully furnished apartments with the comfort of home and the service of a hotel.</p>
        <div className="hero-actions">
          <Link to="/apartments" className="btn">Book your stay <ArrowRight size={18} /></Link>
          <a href="#story" className="btn btn-ghost">Our story</a>
        </div>
      </VideoBackground>

      <section id="story" className="container section split">
        <Reveal>
          <img className="split-img" src="/images/lounge.jpg" alt="Lounge" />
        </Reveal>
        <Reveal delay={150}>
          <span className="eyebrow">Our story</span>
          <h2>Home comfort, hotel service</h2>
          <p>
            {property.name} was created for guests who want more than a bed for the night. Every apartment is fully
            furnished, professionally maintained and ready the moment you arrive.
          </p>
          <p>
            Book directly on this website for instant confirmation, with no back-and-forth messages. We're still
            on WhatsApp and Instagram for any questions along the way.
          </p>
        </Reveal>
      </section>

      <section className="container section">
        <div className="highlights">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 100}>
              <div className="feature">
                <div className="icon"><h.icon size={24} /></div>
                <h4>{h.title}</h4>
                <p>{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="container section">
          <Reveal>
            <span className="eyebrow">Extra services</span>
            <h2>Make your stay effortless</h2>
            <p className="muted">Add any of these when you book.</p>
          </Reveal>
          <div className="services-grid">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <div className="service-card">
                  <s.icon size={24} />
                  <h4>{s.name}</h4>
                  <p>{s.description}</p>
                  {/* <strong>{naira(s.price)}{s.type === "perNight" ? " / night" : ""}</strong> */}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <Reveal>
            <h2>Ready for your stay?</h2>
            <p>Choose your dates and book in a few minutes.</p>
            <Link to="/apartments" className="btn btn-light">See available apartments</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}