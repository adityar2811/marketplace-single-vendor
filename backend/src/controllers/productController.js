// backend/src/controllers/productController.js
const prisma = require("../prisma");

// Ambil semua produk (Bisa untuk katalog maupun tabel admin)
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (error) {
    next(error); // Lempar ke Global Error Handler yang sudah kita buat sebelumnya
  }
};

// Tambah Produk Baru (Fitur Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const { skuCode, name, description, price, currentStock } = req.body;

    // Validasi data input sederhana
    if (!skuCode || !name || !price) {
      return res
        .status(400)
        .json({ error: "SKU, nama, dan harga wajib diisi." });
    }

    const newProduct = await prisma.product.create({
      data: {
        skuCode,
        name,
        description,
        price: parseFloat(price), // Pastikan diconvert ke float/decimal
        currentStock: parseInt(currentStock) || 0,
      },
    });

    res
      .status(201)
      .json({ message: "Produk berhasil ditambahkan", data: newProduct });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "Kode SKU sudah digunakan oleh produk lain." });
    }
    next(error);
  }
};
