const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/checkout", orderController.createOrder);

router.get("/history", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true, // Ikut sertakan detail produk yang dibeli
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Urutkan dari pesanan terbaru
      },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data riwayat pesanan." });
  }
});

module.exports = router;
