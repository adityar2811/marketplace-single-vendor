// backend/src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // 1. Ambil header Authorization (Format standar: "Bearer <TOKEN>")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          error: "Akses ditolak. Token tidak ditemukan atau format salah.",
        });
    }

    // 2. Potong string untuk mengambil token-nya saja
    const token = authHeader.split(" ")[1];

    // 3. Verifikasi token menggunakan JWT_SECRET kita
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Masukkan data user yang terdekripsi ke dalam object req agar bisa dipakai di controller berikutnya
    req.userData = decoded;

    // 5. Lolos verifikasi, lanjutkan ke fungsi utama (Controller)
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Akses ditolak. Token kedaluwarsa atau tidak valid." });
  }
};
