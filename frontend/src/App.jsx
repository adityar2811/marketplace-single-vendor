// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import API from "./api";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import CheckoutSimulation from "./components/CheckoutSimulation";
import AdminLogin from "./components/AdminLogin"; // Impor Halaman Login

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Autentikasi
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
  }, [token]); // Ambil ulang data jika token berubah

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

  // JIKA BELUM LOGIN: Paksa tampilkan halaman login gelap yang elegan
  if (!token) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // JIKA SUDAH LOGIN: Tampilkan dashboard utama marketplace
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Dashboard Utama + Tombol Logout */}
        <div className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              ⚙️ Dashboard Operasional Terproteksi
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Selamat bekerja,{" "}
              <span className="font-bold text-blue-600">{adminName}</span> (Mode
              Secure Teraktifkan)
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm"
          >
            Keluar Sistem (Logout)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <ProductForm onProductAdded={handleProductAdded} />
            <CheckoutSimulation
              products={products}
              onOrderSuccess={fetchProducts}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                📊 Live Gudang & Katalog Real-Time
              </h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Total Jenis: {products.length} Barang
              </span>
            </div>

            {loading && (
              <div className="text-center py-10 font-medium text-gray-600">
                Sinkronisasi data terenkripsi...
              </div>
            )}
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 font-medium">
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
                {products.length === 0 ? (
                  <div className="bg-white shadow p-8 rounded-lg text-center text-gray-500 border border-gray-200">
                    Gudang PostgreSQL kosong. Sila isi form "Tambah Produk"
                    untuk memulai ekosistem.
                  </div>
                ) : (
                  <ProductTable products={products} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
