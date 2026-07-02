// frontend/src/pages/CustomerMarketplace.jsx
import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import API from "../api";

const CustomerMarketplace = ({ products, fetchProducts }) => {
  const [cart, setCart] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState({
    type: "",
    text: "",
  });
  const [buyerInfo, setBuyerInfo] = useState({ name: "", email: "" });

  // 1. Fungsi Tambah ke Keranjang Belanja
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Jika barang sudah ada, cek apakah kuantitas melebihi stok live
        if (existingItem.quantity >= product.stock) {
          alert(
            `Maaf, batas maksimal pembelian sesuai stok hanya ${product.stock} pcs.`,
          );
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // 2. Fungsi Kurangi/Hapus Kuantitas di Keranjang
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  // 3. Hitung Total Belanja
  const totalBelanja = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // 4. Eksekusi Multi-Item Checkout Ke Backend
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Validasi tambahan agar pembeli wajib mengisi nama & email
    if (!buyerInfo.name || !buyerInfo.email) {
      setCheckoutMessage({
        type: "error",
        text: "⚠️ Silakan isi Nama Lengkap dan Email Pengiriman dahulu.",
      });
      return;
    }

    setCheckoutLoading(true);
    setCheckoutMessage({ type: "", text: "" });

    const itemsPayload = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    try {
      // SUNTIKKAN buyerInfo.name dan buyerInfo.email ke payload backend
      await API.post("/orders/checkout", {
        customerName: buyerInfo.name,
        customerEmail: buyerInfo.email,
        items: itemsPayload,
      });

      setCheckoutMessage({
        type: "success",
        text: "🎉 Transaksi Berhasil! Pengaman stok sukses memotong data.",
      });
      setCart([]);
      setBuyerInfo({ name: "", email: "" }); // Reset form pembeli
      fetchProducts();
    } catch (err) {
      console.error(err);
      setCheckoutMessage({
        type: "error",
        text: err.response?.data?.error || "Transaksi gagal.",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Ala Shopee Mini */}
      <nav className="bg-orange-500 text-white shadow-md sticky top-0 z-50 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-wider">🧡 SHOPEE VENDOR</h1>
        <a
          href="/admin"
          className="bg-white/20 hover:bg-white/35 text-white font-medium py-1.5 px-4 rounded-lg text-sm transition-colors"
        >
          Masuk Seller Centre ⚙️
        </a>
      </nav>

      <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Katalog Grid Produk */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🛍️ Semua Produk Pilihan
          </h2>

          {products.length === 0 ? (
            <div className="bg-white border rounded-xl p-8 text-center text-gray-400">
              Toko belum mengunggah produk.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Live Nota Keranjang Belanja */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-800 text-base border-b pb-3 mb-4 flex items-center gap-2">
              🛒 Keranjang Belanjaan
            </h3>
            <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                📋 Informasi Pengiriman
              </p>
              <input
                type="text"
                placeholder="Nama Lengkap Pembeli"
                value={buyerInfo.name}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, name: e.target.value })
                }
                className="w-full p-2 border text-xs rounded bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
              <input
                type="email"
                placeholder="Email Aktif"
                value={buyerInfo.email}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, email: e.target.value })
                }
                className="w-full p-2 border text-xs rounded bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
            {checkoutMessage.text && (
              <div
                className={`p-3 rounded-lg mb-4 text-xs font-semibold ${checkoutMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {checkoutMessage.text}
              </div>
            )}

            {cart.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">
                Keranjang kosong. Yuk pilih produk!
              </p>
            ) : (
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm border-b pb-2"
                  >
                    <div>
                      <h5 className="font-semibold text-gray-700 truncate max-w-[150px]">
                        {item.name}
                      </h5>
                      <span className="text-xs text-orange-500 font-medium">
                        {formatRupiah(item.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-2 rounded"
                      >
                        -
                      </button>
                      <span className="font-bold text-gray-800 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-2 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between font-bold text-gray-800 text-base">
                <span>Total Biaya:</span>
                <span className="text-orange-600">
                  {formatRupiah(totalBelanja)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkoutLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors disabled:bg-gray-200 disabled:text-gray-400 shadow-sm mt-4 text-sm"
              >
                {checkoutLoading
                  ? "Memproses Transaksi Terbimbing..."
                  : `Selesaikan Pesanan (${cart.length} Jenis)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMarketplace;
