import axios from "axios";
import i18n from "../i18n";

const API = axios.create({
  // This uses the Render URL in production and localhost during development
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api"),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Accept-Language"] = i18n.language || "en";

  return config;
});

// ---- GET cache -------------------------------------------------------
// Identical GET requests made within 60s (same url, params and language)
// share one network call and one result. This also merges requests that
// two components make at the same moment, and makes going back to a page
// instant. Logged-in requests are never cached.
const GET_CACHE = new Map();
const GET_CACHE_TTL = 60 * 1000;
const rawGet = API.get.bind(API);

API.get = (url, config = {}) => {
  if (config.cache === false || localStorage.getItem("token")) {
    return rawGet(url, config);
  }
  const lang = (config.headers && config.headers["Accept-Language"]) || i18n.language || "en";
  const key = JSON.stringify([url, config.params || null, lang]);
  const hit = GET_CACHE.get(key);
  if (hit && Date.now() - hit.time < GET_CACHE_TTL) return hit.promise;

  const promise = rawGet(url, config);
  GET_CACHE.set(key, { time: Date.now(), promise });
  promise.catch(() => GET_CACHE.delete(key));
  return promise;
};

export default API;