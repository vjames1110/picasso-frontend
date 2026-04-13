import axios from "axios";

const api = axios.create({
  baseURL: "https://picasso-backend-7rap.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;