// frontend/src/components/AdminLogin.jsx
import React, { useState } from "react";
import API from "../api";

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/auth/login", formData);

      // Ambil token dari response backend
      const { token, admin } = response.data;

      // Simpan token ke localStorage browser agar aman saat page di-refresh
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminName", admin.name);

      // Picu fungsi callback untuk mengubah state di App.jsx
      onLoginSuccess(token, admin.name);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Kredensial salah atau server bermasalah.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            🔐 Admin Gateway
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Silakan masuk untuk mengelola marketplace
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Email Resmi
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@marketplace.com"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:bg-blue-300 mt-2"
          >
            {loading ? "Membuka Gembok Keamanan..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
