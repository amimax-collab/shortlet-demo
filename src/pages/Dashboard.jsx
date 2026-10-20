import { useState } from "react";
import { units } from "../data/units.js";
import {
  addBooking, getBookings, isNightTaken, removeBooking, resetBookings, updateStatus,
} from "../utils/booking.js";
import { addDays, formatDate, naira, toISO } from "../utils/dates.js";

const weeklyVisits = [
  { label: "Mon", value: 120 }, { label: "Tue", value: 180 }, { label: "Wed", value: 150 },
  { label: "Thu", value: 220 }, { label: "Fri", value: 260 }, { label: "Sat", value: 310 },
  { label: "Sun", value: 280 },
];

function Bars({ data, format = (v) => v }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="bars">
      {data.map((d) => (
        <div className="bar-col" key={d.label}>
          <div className="bar-track">
            <div className="bar" style={{ height: `${(d.value / max) * 100}%` }} title={format(d.value)} />
          </div>
          <span className="bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [bookings, setBookings] = useState(getBookings);
  const [block, setBlock] = useState({ unitId: units[0].id, from: "", to: "" });
  const [blockError, setBlockError] = useState("");
  const [weekly, setWeekly] = useState(true);
  const [alerts, setAlerts] = useState(true);

  const refresh = () => setBookings(getBookings());
  const today = toISO(new Date());
  const unitName = (id) => units.find((u) => u.id === id)?.name ?? id;

  const paid = bookings.filter((b) => b.status === "Paid");
  const revenue = paid.reduce((sum, b) => sum + b.total, 0);
  const upcoming = bookings
    .filter((b) => b.checkIn >= today && (b.status === "Paid" || b.status === "Pending"))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  // Occupancy over the next 30 days (owner blocks aren't counted as guest stays)
  const guestStays = bookings.filter((b) => b.status !== "Blocked");
  let occupied = 0;
  for (const u of units) {
    for (let i = 0; i < 30; i++) if (isNightTaken(u.id, addDays(today, i), guestStays)) occupied++;
  }
  const occupancy = Math.round((occupied / (units.length * 30)) * 100);

  // Revenue for the last 6 months
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-GB", { month: "short" }),
      value: 0,
    });
  }
  paid.forEach((b) => {
    const m = months.find((m) => m.key === b.checkIn.slice(0, 7));
    if (m) m.value += b.total;
  });

  function handleBlock(e) {
    e.preventDefault();
    setBlockError("");
    if (!block.from || !block.to || block.to <= block.from) {
      setBlockError("Choose a start date and a later end date.");
      return;
    }
    const result = addBooking({
      unitId: block.unitId, guest: "Owner block", email: "", phone: "",
      checkIn: block.from, checkOut: block.to, guests: 0, total: 0, status: "Blocked",
    });
    if (!result.ok) return setBlockError("Those dates overlap an existing booking.");
    setBlock({ ...block, from: "", to: "" });
    refresh();
  }

  const sorted = [...bookings].sort((a, b) => b.checkIn.localeCompare(a.checkIn));

  return (
    <div className="container page">
      <div className="section-head">
        <h1 style={{ margin: 0 }}>Owner dashboard</h1>
        <button className="btn btn-outline btn-sm" onClick={() => { resetBookings(); refresh(); }}>Reset demo data</button>
      </div>

      <div className="stats">
        <div className="card stat"><span className="muted">Total revenue</span><div className="num">{naira(revenue)}</div></div>
        <div className="card stat"><span className="muted">Bookings</span><div className="num">{bookings.filter((b) => b.status === "Paid" || b.status === "Pending").length}</div></div>
        <div className="card stat"><span className="muted">Occupancy (next 30 days)</span><div className="num">{occupancy}%</div></div>
        <div className="card stat"><span className="muted">Next check-in</span><div className="num" style={{ fontSize: 18 }}>{upcoming[0] ? `${formatDate(upcoming[0].checkIn)}` : "None"}</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Revenue by month</h3>
          <Bars data={months} format={naira} />
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Website visits this week <span className="muted" style={{ fontSize: 12 }}>(sample data)</span></h3>
          <Bars data={weeklyVisits} />
        </div>
      </div>

      <div className="grid-2">
        <form className="card" onSubmit={handleBlock}>
          <h3 style={{ marginTop: 0 }}>Block dates</h3>
          <label className="field">Apartment
            <select value={block.unitId} onChange={(e) => setBlock({ ...block, unitId: e.target.value })}>
              {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </label>
          <label className="field">From<input type="date" min={today} value={block.from} onChange={(e) => setBlock({ ...block, from: e.target.value })} /></label>
          <label className="field">Until<input type="date" min={block.from || today} value={block.to} onChange={(e) => setBlock({ ...block, to: e.target.value })} /></label>
          {blockError && <p className="error">{blockError}</p>}
          <button className="btn" type="submit">Block these dates</button>
        </form>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Notifications</h3>
          <label className="check"><input type="checkbox" checked={alerts} onChange={(e) => setAlerts(e.target.checked)} /> Email me when a new booking comes in</label>
          <label className="check"><input type="checkbox" checked={weekly} onChange={(e) => setWeekly(e.target.checked)} /> Send me a weekly summary every Monday</label>
          <p className="muted" style={{ fontSize: 13 }}>These switch on for real when we connect the back end.</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>All bookings</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Ref</th><th>Guest</th><th>Apartment</th><th>Dates</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {sorted.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.guest}</td>
                  <td>{unitName(b.unitId)}</td>
                  <td>{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</td>
                  <td>{b.total ? naira(b.total) : "-"}</td>
                  <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                  <td>
                    {b.status === "Pending" && <button className="btn btn-sm" onClick={() => { updateStatus(b.id, "Paid"); refresh(); }}>Confirm</button>}{" "}
                    {(b.status === "Paid" || b.status === "Pending") && <button className="btn btn-outline btn-sm" onClick={() => { updateStatus(b.id, "Cancelled"); refresh(); }}>Cancel</button>}
                    {b.status === "Blocked" && <button className="btn btn-outline btn-sm" onClick={() => { removeBooking(b.id); refresh(); }}>Unblock</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}