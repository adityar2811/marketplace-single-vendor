// frontend/src/pages/AdminDashboard.jsx
import React from "react";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import CheckoutSimulation from "../components/CheckoutSimulation"; // Sementara masih di sini sebelum dipindah ke halaman customer

const AdminDashboard = ({
  products,
  adminName,
  handleLogout,
  handleProductAdded,
  fetchProducts,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Dashboard Admin */}
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
            {/* Kita biarkan simulasi ini di sini dulu untuk cadangan testing admin */}
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

            <ProductTable products={products} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
