
import axios from "axios";
import { getToken, signOutAndRedirect } from "../auth/storage.tsx";

/**
 * Resolve API base from env:
 *  - Dev:    VITE_API_BASE=http://localhost:8080
 *  - Prod:   VITE_API_BASE=http://44.248.238.243   (or your domain)
 *
 * We append `/api` once here, so elsewhere you call api.get("/auth/signin"), etc.
 */
function resolveBaseURL() {
  const raw = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";
  // remove trailing slash if present
  const base = raw.replace(/\/+$/, "");
  return `${base}/api`;
}

// Create axios instance
const api = axios.create({
  baseURL: resolveBaseURL(),
  withCredentials: false, // using Authorization header, not cookies
});

// Endpoints that must remain public (no Authorization, no auto-redirect on 401)
const isPublicAuthFlow = (url: string) => {
  // url is relative to baseURL, e.g. "/auth/signin"
  return (
    url.includes("/auth/signin") ||
    url.includes("/auth/validate-invite") ||
    url.includes("/auth/signup-with-invite") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password")
  );
};

// Attach Authorization header for non-public routes
api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  const reqUrl = (config.url || "").toString();
  const token = getToken();

  if (isPublicAuthFlow(reqUrl)) {
    delete (config.headers as any).Authorization;
  } else if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  } else {
    delete (config.headers as any).Authorization;
  }
  return config;
});

// On 401 from protected routes, sign out and bounce to /signin
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = (err?.config?.url || "").toString();

    if (status === 401 && !isPublicAuthFlow(url)) {
      signOutAndRedirect();
      // Return a pending promise to halt caller chains after redirect
      return new Promise(() => {});
    }
    return Promise.reject(err);
  }
);

export default api;
