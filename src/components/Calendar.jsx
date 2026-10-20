import { useState } from "react";
import { toISO, fromISO, addDays } from "../utils/dates";
import { isNightTaken, isRangeAvailable } from "../utils/booking";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Calendar({ unitId, bookings, checkIn, checkOut, onChange }) {
  const today = toISO(new Date());
  const [anchor, setAnchor] = useState(null); // the first day tapped, while the guest may still extend the stay
  const [cursor, setCursor] = useState(() => {
    const base = checkIn ? fromISO(checkIn) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // week starts Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toISO(new Date(year, month, i + 1))),
  ];

  const now = new Date();
  const prevDisabled = cursor <= new Date(now.getFullYear(), now.getMonth(), 1);

  // The selected days are the nights. The last night is the day before check-out.
  const lastNight = checkOut ? addDays(checkOut, -1) : "";

  const isDisabled = (iso) => iso < today || isNightTaken(unitId, iso, bookings);

  function handleClick(iso) {
    if (isDisabled(iso)) return;

    // Second tap on a later day: extend the stay (only if every night in between is free)
    if (anchor && iso > anchor && isRangeAvailable(unitId, anchor, addDays(iso, 1), bookings)) {
      onChange(anchor, addDays(iso, 1));
      setAnchor(null);
      return;
    }

    // Tapping the same day again keeps it as a one-night stay
    if (anchor && iso === anchor) {
      setAnchor(null);
      return;
    }

    // Otherwise start a new selection: one night, check-out the next day
    setAnchor(iso);
    onChange(iso, addDays(iso, 1));
  }

  return (
    <div className="calendar">
      <div className="cal-header">
        <button type="button" disabled={prevDisabled} onClick={() => setCursor(new Date(year, month - 1, 1))}>‹</button>
        <strong>{cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</strong>
        <button type="button" onClick={() => setCursor(new Date(year, month + 1, 1))}>›</button>
      </div>

      <div className="cal-grid">
        {DAYS.map((d) => <span key={d} className="cal-dow">{d}</span>)}
        {cells.map((iso, i) => {
          if (!iso) return <span key={`e${i}`} />;
          let cls = "cal-day";
          if (isNightTaken(unitId, iso, bookings)) cls += " taken";
          if (iso === checkIn || iso === lastNight) cls += " selected";
          else if (checkIn && lastNight && iso > checkIn && iso < lastNight) cls += " in-range";
          return (
            <button key={iso} type="button" className={cls} disabled={isDisabled(iso)} onClick={() => handleClick(iso)}>
              {Number(iso.slice(8))}
            </button>
          );
        })}
      </div>

      <p className="muted" style={{ fontSize: 12, margin: "10px 0 0" }}>
        {anchor
          ? "Tap a later date to stay longer, or reserve for this one night."
          : "Tap a date to book that night. Tap a second date for a longer stay."}
      </p>

      <div className="cal-legend">
        <span><i className="dot free" /> Available</span>
        <span><i className="dot taken" /> Booked</span>
        <span><i className="dot sel" /> Your stay</span>
      </div>
    </div>
  );
}