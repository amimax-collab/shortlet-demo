import { addDays, toISO } from "./dates";
import { services as allServices } from "../data/services";

const KEY = "haven_bookings";

function seed() {
  const d = (n) => addDays(toISO(new Date()), n);
  const b = (id, unitId, guest, from, to, guests, total, status = "Paid") => ({
    id, unitId, guest, email: "guest@example.com", phone: "08030000000",
    checkIn: d(from), checkOut: d(to), guests, total, status,
  });
  return [
    b("HV-1001", "two-bedroom", "Chidi Okafor", -95, -91, 3, 580000),
    b("HV-1002", "executive-suite", "Amina Bello", -70, -67, 2, 540000),
    b("HV-1003", "standard-room", "Tunde Adeyemi", -52, -49, 2, 195000),
    b("HV-1004", "one-bedroom", "Ngozi Eze", -33, -30, 2, 285000),
    b("HV-1005", "two-bedroom", "Ibrahim Musa", -20, -16, 4, 580000),
    b("HV-1006", "executive-suite", "Funke Adebayo", -9, -6, 2, 540000),
    b("HV-1007", "standard-room", "Emeka Obi", -4, -1, 2, 195000),
    b("HV-1008", "one-bedroom", "Hauwa Sani", 2, 5, 2, 285000),
    b("HV-1009", "two-bedroom", "Kelechi Nwosu", 4, 8, 4, 580000),
    b("HV-1010", "standard-room", "Zainab Yusuf", 6, 9, 1, 195000),
    b("HV-1011", "executive-suite", "Segun Balogun", 10, 14, 2, 720000, "Pending"),
    b("HV-1012", "one-bedroom", "Ada Nnadi", 12, 15, 2, 285000),
  ];
}

function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getBookings() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const data = seed();
  save(data);
  return data;
}

export function resetBookings() {
  localStorage.removeItem(KEY);
}

// A "night" is taken if some active booking covers it. Check-out day itself is free.
export function isNightTaken(unitId, iso, bookings) {
  return bookings.some(
    (b) => b.unitId === unitId && b.status !== "Cancelled" && b.checkIn <= iso && iso < b.checkOut
  );
}

// Two stays overlap if each starts before the other ends.
export function isRangeAvailable(unitId, checkIn, checkOut, bookings) {
  return !bookings.some(
    (b) =>
      b.unitId === unitId && b.status !== "Cancelled" &&
      checkIn < b.checkOut && checkOut > b.checkIn
  );
}

export function calcTotal(unit, nights, selectedIds = []) {
  const subtotal = unit.pricePerNight * nights;
  const extras = allServices
    .filter((s) => selectedIds.includes(s.id))
    .map((s) => ({ id: s.id, name: s.name, amount: s.type === "perNight" ? s.price * nights : s.price }));
  const extrasTotal = extras.reduce((sum, e) => sum + e.amount, 0);
  return { subtotal, extras, extrasTotal, total: subtotal + extrasTotal };
}

export function addBooking(data) {
  const list = getBookings();
  // Re-check at the moment of saving. This is the double-booking guard.
  if (!isRangeAvailable(data.unitId, data.checkIn, data.checkOut, list)) return { ok: false };
  const booking = { status: "Paid", ...data, id: "HV-" + Date.now().toString().slice(-6) };
  save([...list, booking]);
  return { ok: true, booking };
}

export function updateStatus(id, status) {
  save(getBookings().map((b) => (b.id === id ? { ...b, status } : b)));
}

export function removeBooking(id) {
  save(getBookings().filter((b) => b.id !== id));
}