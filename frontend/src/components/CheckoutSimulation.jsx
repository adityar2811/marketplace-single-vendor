import React, { useState } from "react";
import API from "../api";

const CheckoutSimulation = ({ products, onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    productId: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessData(null);

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      items: [
        {
          productId: formData.productId,
          quantity: parseInt(formData.quantity),
        },
      ],
    };

    try {
      const response = await API.post("/orders/checkout", payload);
      setSuccessData(response.data.order);

      setFormData({ ...formData, productId: "", quantity: 1 });

      onOrderSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Gagal melakukan checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        🛒 Simulasi Transaksi Pembeli
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium">
          {error}
        </div>
      )}

      {successData && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-sm border border-green-200">
          <p className="font-bold">🎉 Checkout Berhasil!</p>
          <p className="mt-1">
            Nomor Invoice:{" "}
            <span className="font-mono bg-white px-1 rounded border">
              {successData.invoiceNumber}
            </span>
          </p>
          <p>
            Total Bayar:{" "}
            <span className="font-semibold">
              Rp {parseFloat(successData.totalAmount).toLocaleString("id-ID")}
            </span>
          </p>
        </div>
      )}

      <form onSubmit={handleCheckout} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Nama Pembeli
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            placeholder="Nama lengkap pembeli"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Email
          </label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            required
            placeholder="pembeli@email.com"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Pilih Produk
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">-- Pilih Barang --</option>
              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                  disabled={product.currentStock <= 0}
                >
                  {product.name} (Sisa: {product.currentStock})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Jumlah
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.productId}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:bg-green-300"
        >
          {loading ? "Memproses Transaksi..." : "Beli & Potong Stok Sekarang"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutSimulation;
