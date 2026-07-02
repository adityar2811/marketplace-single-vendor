// backend/src/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Impor middleware satpam yang baru kita buat
const verifyToken = require("../middlewares/authMiddleware");

// Semua orang boleh melihat produk (Akses Publik)
router.get("/", productController.getAllProducts);

// HANYA yang lolos verifyToken yang bisa menambah produk (Akses Terproteksi)
router.post("/", verifyToken, productController.createProduct);

module.exports = router;
