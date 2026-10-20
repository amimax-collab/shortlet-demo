// Dates are stored as "YYYY-MM-DD" strings. Built from local parts (not toISOString)
// so timezones never shift the day.
export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso, n) {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function nightsBetween(checkIn, checkOut) {
  return Math.round((fromISO(checkOut) - fromISO(checkIn)) / 86400000);
}

export const formatDate = (iso) =>
  fromISO(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const naira = (n) => "₦" + n.toLocaleString("en-NG");