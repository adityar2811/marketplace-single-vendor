// frontend/src/components/ProductCard.jsx
import React from "react";

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;

  // Format angka ke Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Gambar Placeholder ala Shopee */}
      <div className="bg-gray-100 h-40 flex items-center justify-center text-gray-400 text-4xl font-bold">
        📦
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h4 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[40px] mb-1">
          {product.name}
        </h4>
        <p className="text-xs text-gray-400 mb-2">SKU: {product.sku}</p>

        <div className="mt-auto">
          <div className="text-orange-500 font-bold text-base mb-1">
            {formatRupiah(product.price)}
          </div>

          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isOutOfStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
            >
              {isOutOfStock ? "Stok Habis" : `Stok: ${product.stock}`}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`w-full mt-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
            }`}
          >
            {isOutOfStock ? "Habis" : "🛒 + Keranjang"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
