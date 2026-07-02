// src/index.js
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// 1. Optimasi CORS untuk Produksi
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_PRODUCTION_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "Akses CORS ditolak oleh kebijakan keamanan server.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json());

// Endpoint Monitor Utama (Health Check)
app.get("/api/health", (req, res) => {
  res.json({
    status: "Active",
    message: "Server senior analyst berjalan dengan optimal",
    environment: NODE_ENV,
  });
});

//  [SOLUSI]: Pindahkan ke SINI (Sebelum 404 handler)
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// Penanganan Rute Tidak Ditemukan (404 Handler)
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

// 2. Middleware Penanganan Eror Global (Global Error Handler)
app.use((err, req, res, next) => {
  console.error("❌ [ERROR]:", err.stack);
  res.status(err.status || 500).json({
    error:
      NODE_ENV === "production"
        ? "Terjadi kesalahan internal pada server."
        : err.message,
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 [SERVER] Berhasil berjalan di port: ${PORT} (${NODE_ENV} mode)`,
  );
});
