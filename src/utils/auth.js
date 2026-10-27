const KEY = "haven_admin_session";

// DEMO ONLY: replaced by Supabase Auth in the back end step
const DEMO_EMAIL = "owner@thehaven.ng";
const DEMO_PASSWORD = "haven2026";

export function login(email, password) {
  if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
    sessionStorage.setItem(KEY, "1"); // cleared when the browser tab closes
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(KEY);
}

export function isLoggedIn() {
  return sessionStorage.getItem(KEY) === "1";
}