import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import MapEmbed from "../components/MapEmbed.jsx";
import { property } from "../data/property.js";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappLink } from "../utils/whatsapp";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="container page">
      <h1>Contact us</h1>
      <div className="split" style={{ alignItems: "start" }}>
        <div>
          <p className="contact-line"><MapPin size={18} /> {property.address}</p>
          <p className="contact-line"><Phone size={18} /> {property.phone}</p>
          <p className="contact-line"><Mail size={18} /> {property.email}</p>
          <a className="btn" href={whatsappLink(`Hello ${property.name}, I'd like to make an enquiry.`)} target="_blank" rel="noreferrer">
            <FaWhatsapp size={18} /> Chat on WhatsApp
          </a>

          {sent ? (
            <p className="card" style={{ marginTop: 20 }}>Thanks! We'll get back to you shortly.</p>
          ) : (
            <form className="card" style={{ marginTop: 20 }} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <label className="field">Name<input required /></label>
              <label className="field">Email<input type="email" required /></label>
              <label className="field">Message<textarea rows="4" required /></label>
              <button className="btn" type="submit">Send message</button>
            </form>
          )}
        </div>
        <MapEmbed />
      </div>
    </div>
  );
}