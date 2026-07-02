// frontend/src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan Axios Interceptor untuk menyisipkan Token JWT otomatis
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Menempelkan satpam digital
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
