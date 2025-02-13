import axios from "axios";

const API_URL = import.meta.env.BACKEND_URL || "http://localhost:5000"; // Default fallback

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true // Add this line to enable sending cookies
});

export default api;
