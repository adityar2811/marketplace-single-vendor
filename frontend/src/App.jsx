// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import API from "./api";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerMarketplace from "./pages/CustomerMarketplace";
import AdminLogin from "./components/AdminLogin";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Autentikasi Admin
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [adminName, setAdminName] = useState(localStorage.getItem("adminName"));

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke server backend.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLoginSuccess = (newToken, name) => {
    setToken(newToken);
    setAdminName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    setToken(null);
    setAdminName(null);
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-gray-500">
        Memuat Sistem Shopee Vendor...
      </div>
    );

  return (
    <Router>
      <Routes>
        {/* RUTE UTAMA: Sisi Customer ala Shopee */}
        <Route
          path="/"
          element={
            <CustomerMarketplace
              products={products}
              fetchProducts={fetchProducts}
            />
          }
        />

        {/* RUTE SELLER CENTRE: Dashboard Admin yang Terproteksi JWT */}
        <Route
          path="/admin"
          element={
            token ? (
              <AdminDashboard
                products={products}
                adminName={adminName}
                handleLogout={handleLogout}
                handleProductAdded={handleProductAdded}
                fetchProducts={fetchProducts}
              />
            ) : (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Jika URL asal-asalan, lempar ke beranda */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
