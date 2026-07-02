import React, { useState } from "react";
import API from "../api";

const ProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    skuCode: "",
    name: "",
    description: "",
    price: "",
    currentStock: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await API.post("/products", formData);

      setSuccess(true);
      setFormData({
        skuCode: "",
        name: "",
        description: "",
        price: "",
        currentStock: "",
      }); // Reset form

      onProductAdded(response.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Gagal menambahkan produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Tambah Produk Baru
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm font-medium">
          Produk berhasil disimpan ke PostgreSQL!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Kode SKU (Unique)
            </label>
            <input
              type="text"
              name="skuCode"
              value={formData.skuCode}
              onChange={handleChange}
              required
              placeholder="Contoh: SKU-PCT-500"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nama barang atau obat"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Deskripsi (Opsional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            placeholder="Keterangan detail produk..."
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Harga (Rp)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="15000"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Stok Awal
            </label>
            <input
              type="number"
              name="currentStock"
              value={formData.currentStock}
              onChange={handleChange}
              required
              placeholder="100"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:bg-blue-300"
        >
          {loading ? "Menyimpan..." : "Simpan ke Database"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
