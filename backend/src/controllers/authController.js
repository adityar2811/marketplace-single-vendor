// backend/src/controllers/authController.js
const prisma = require("../prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 1. Fitur Registrasi Admin Baru
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Semua kolom wajib diisi." });
    }

    // Hash password dengan salt round 10 (Standar Industri)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword, // Simpan versi hash, BUKAN password asli
      },
    });

    res.status(201).json({
      message: "Admin berhasil didaftarkan",
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email sudah terdaftar." });
    }
    next(error);
  }
};

// 2. Fitur Login Admin (Pemberian Token JWT)
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Email atau password salah (Gagal Autentikasi)." });
    }

    // Bandingkan password input dengan password hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Email atau password salah (Gagal Autentikasi)." });
    }

    // Jika valid, buat token JWT yang berlaku selama 1 hari
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login berhasil!",
      token,
      admin: { name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};
