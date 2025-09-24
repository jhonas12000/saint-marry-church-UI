import axios from "axios";
import { getToken, signOutAndRedirect } from "../auth/storage.tsx";

// Local dev baseURL already includes /api
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: false,
});

// Public auth endpoints — never send Authorization and never auto-redirect on 401
const isPublicAuthFlow = (url: string) => {
  // NOTE: url here is the request path relative to baseURL, e.g. "/auth/validate-invite"
  return (
    url.includes("/auth/signin") ||
    url.includes("/auth/validate-invite") ||
    url.includes("/auth/signup-with-invite") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password")
  );
};

// Attach token except on public auth flows
api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  const token = getToken();
  const reqUrl = (config.url || "").toString();

  if (isPublicAuthFlow(reqUrl)) {
    delete (config.headers as any).Authorization;
  } else if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  } else {
    delete (config.headers as any).Authorization;
  }
  return config;
});

// Only redirect to /signin on 401 for NON-public endpoints
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = (err?.config?.url || "").toString();

    if (status === 401 && !isPublicAuthFlow(url)) {
      signOutAndRedirect();
      return new Promise(() => {}); // stop further handling after redirect
    }
    return Promise.reject(err);
  }
);

export default api;
