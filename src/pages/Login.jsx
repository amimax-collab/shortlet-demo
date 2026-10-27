import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { isLoggedIn, login } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoggedIn()) return <Navigate to="/admin" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    if (login(email, password)) {
      navigate(location.state?.from || "/admin", { replace: true });
    } else {
      setError("Incorrect email or password.");
    }
  }

  return (
    <div className="container page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <div className="login-icon"><Lock size={22} /></div>
        <h1 style={{ margin: "12px 0 4px", fontSize: 26 }}>Owner login</h1>
        <p className="muted" style={{ marginTop: 0 }}>Sign in to manage bookings and availability.</p>
        <label className="field">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="field">Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit" style={{ width: "100%" }}>Sign in</button>
        <p className="muted" style={{ fontSize: 12, marginBottom: 0 }}>Demo login: owner@thehaven.ng / haven2026</p>
      </form>
    </div>
  );
}