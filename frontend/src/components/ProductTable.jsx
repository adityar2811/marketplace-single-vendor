import React from "react";

const ProductTable = ({ products }) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">
              Informasi Produk
            </th>
            <th scope="col" className="px-6 py-3">
              Stok & Status
            </th>
            <th scope="col" className="px-6 py-3">
              Harga
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="bg-white border-b hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-base">
                    {product.name}
                  </span>
                  <span className="text-xs text-gray-400 font-mono mt-0.5">
                    {product.skuCode}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium">
                    {product.currentStock} Unit
                  </span>
                  <span
                    className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full w-max ${
                      product.currentStock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.currentStock > 0 ? "Tersedia" : "Habis"}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 font-semibold text-gray-900">
                Rp {parseFloat(product.price).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
