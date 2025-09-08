
import axios from "axios";
import { getToken, signOutAndRedirect } from "../auth/storage.tsx";

const api = axios.create({ baseURL: "http://localhost:8080/api" });

// Attach Authorization header when token exists
api.interceptors.request.use((config) => {
  const token = getToken();

  config.headers = config.headers ?? {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Avoid logging the raw token for security; log presence only if needed.
    // console.debug("AUTH -> present");
  } else {
    delete (config.headers as any).Authorization;
    delete (api.defaults.headers.common as any).Authorization;
    // console.debug("AUTH -> none");
  }
  return config;
});

// Auto sign-out on 401 (token expired/invalid)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      signOutAndRedirect();
    }
    return Promise.reject(err);
  }
);

export default api;
