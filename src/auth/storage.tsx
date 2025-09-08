// src/auth/storage.ts
export const TOKEN_KEYS = ["auth_token", "token"]; // your current keys (order matters)
export const USER_KEY = "auth_user";

export function getToken(): string | null {
  for (const k of TOKEN_KEYS) {
    const v = localStorage.getItem(k) ?? sessionStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

export function setAuth(token: string, user?: unknown) {
  localStorage.setItem(TOKEN_KEYS[0], token); // persist to your primary key
  if (user !== undefined) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuth() {
  // wipe both common keys + user
  for (const k of TOKEN_KEYS) {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  }
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function signOutAndRedirect() {
  clearAuth();
  // Hard redirect to reset app state thoroughly
  if (window.location.pathname !== "/signin") {
    window.location.href = "/signin";
  }
}
