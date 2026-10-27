import { Routes, Route, useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { property } from "./data/property";
import Home from "./pages/Home";
import Apartments from "./pages/Apartments";
import UnitDetails from "./pages/UnitDetails";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import './styles/global.css'
import './styles/app.css'
import { whatsappLink } from "./utils/whatsapp";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main key={location.pathname} className="page-transition">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/apartments" element={<Apartments />} />
          <Route path="/apartments/:id" element={<UnitDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <a
          className="whatsapp-fab"
          href={whatsappLink(`Hello ${property.name}! I'd like to ask about booking an apartment.`)}
          target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={30} />
      </a>
    </>
  );
}