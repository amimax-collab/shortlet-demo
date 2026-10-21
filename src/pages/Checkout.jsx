import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown, Upload, FileCheck, X, Sparkles } from "lucide-react";
import { units } from "../data/units";
import { services } from "../data/services";
import { addBooking, calcTotal } from "../utils/booking";
import { formatDate, naira, nightsBetween } from "../utils/dates";

const ID_TYPES = ["National ID (NIN)", "International passport", "Driver's licence", "Voter's card"];
const ALLOWED_FILES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_MB = 5;

export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const unit = units.find((u) => u.id === params.get("unit"));
  const checkIn = params.get("in");
  const checkOut = params.get("out");
  const guests = Number(params.get("guests")) || 1;

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", state: "", country: "Nigeria",
    idType: ID_TYPES[0], idNumber: "", notes: "",
  });
  const [idFile, setIdFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [selected, setSelected] = useState([]);
  const [showServices, setShowServices] = useState(false);
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

  const toggleService = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!ALLOWED_FILES.includes(file.type)) {
      setFileError("Please upload a JPG, PNG, WEBP or PDF file.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setFileError(`That file is too large. The maximum size is ${MAX_MB} MB.`);
      e.target.value = "";
      return;
    }
    setFileError("");
    setIdFile(file);
  }

  function handlePay(e) {
    e.preventDefault();
    if (!idFile) {
      setFileError("Please upload a photo or scan of your ID.");
      return;
    }
    setError("");
    setPaying(true);

    // BACKEND LATER: upload the ID file to private storage, open Paystack,
    // and only save the booking after payment is verified.
    setTimeout(() => {
      const result = addBooking({
        unitId: unit.id, guest: form.name, email: form.email, phone: form.phone,
        address: `${form.address}, ${form.city}, ${form.state}, ${form.country}`,
        idType: form.idType,
        idNumber: "****" + form.idNumber.slice(-4), // demo: keep only the last 4 digits
        idFileName: idFile.name,
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
          <div className="form-row">
            <label className="field">Email<input name="email" type="email" required value={form.email} onChange={handleChange} /></label>
            <label className="field">Phone number<input name="phone" type="tel" required value={form.phone} onChange={handleChange} /></label>
          </div>

          <h3>Home address</h3>
          <label className="field">Street address<input name="address" required value={form.address} onChange={handleChange} /></label>
          <div className="form-row">
            <label className="field">City<input name="city" required value={form.city} onChange={handleChange} /></label>
            <label className="field">State / region<input name="state" required value={form.state} onChange={handleChange} /></label>
          </div>
          <label className="field">Country<input name="country" required value={form.country} onChange={handleChange} /></label>

          <h3>Identity verification</h3>
          <div className="form-row">
            <label className="field">ID type
              <select name="idType" value={form.idType} onChange={handleChange}>
                {ID_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="field">ID number<input name="idNumber" required minLength={5} value={form.idNumber} onChange={handleChange} /></label>
          </div>

          {idFile ? (
            <div className="upload-done">
              <FileCheck size={18} />
              <span>{idFile.name}</span>
              <button type="button" className="icon-btn" onClick={() => setIdFile(null)} aria-label="Remove file"><X size={16} /></button>
            </div>
          ) : (
            <label className="upload-drop">
              <Upload size={20} />
              <span>Upload a photo or scan of your ID <small>(JPG, PNG or PDF, max {MAX_MB} MB)</small></span>
              <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleFile} hidden />
            </label>
          )}
          {fileError && <p className="error">{fileError}</p>}
          <p className="muted" style={{ fontSize: 12 }}>Your ID is only used to verify your booking. Demo: please use sample details.</p>

          <label className="field">Special requests (optional)<textarea name="notes" rows="3" value={form.notes} onChange={handleChange} /></label>

          <div className="accordion">
            <button type="button" className="accordion-head" aria-expanded={showServices} onClick={() => setShowServices(!showServices)}>
              <span className="accordion-title"><Sparkles size={18} /> Extra services <em>(optional)</em></span>
              <span className="accordion-meta">
                {selected.length > 0 && <span className="pill">{selected.length} selected</span>}
                <ChevronDown size={18} className={showServices ? "rotated" : ""} />
              </span>
            </button>
            <div className={`accordion-body ${showServices ? "open" : ""}`}>
              <div className="accordion-inner">
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
              </div>
            </div>
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