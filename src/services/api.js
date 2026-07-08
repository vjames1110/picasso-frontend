import axios from "axios";

const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const localBaseURL = "http://127.0.0.1:8000";
const remoteBaseURL = "https://picasso-backend-v8ci.onrender.com/";
const primaryBaseURL = import.meta.env.VITE_API_URL || (isLocalHost ? localBaseURL : remoteBaseURL);

const api = axios.create({
  baseURL: primaryBaseURL,
  headers: {
    "Content-Type": "application/json",
  },

  // Fail over quickly when the local API is running but its database is unavailable.
  timeout: isLocalHost ? 10000 : 60000,
});

// Attach token automatically if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isCanceled =
      error.code === "ERR_CANCELED" ||
      error.name === "CanceledError" ||
      error.config?.signal?.aborted;

    const shouldFallback =
      !isCanceled &&
      primaryBaseURL === localBaseURL &&
      !error.config?.__fallbackAttempt &&
      (!error.response || error.response.status >= 500);

    if (shouldFallback) {
      return api.request({
        ...error.config,
        baseURL: remoteBaseURL,
        timeout: 60000,
        __fallbackAttempt: true,
      });
    }

    return Promise.reject(error);
  }
);


export default api;

