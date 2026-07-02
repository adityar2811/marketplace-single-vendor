// backend/src/controllers/orderController.js
const prisma = require("../prisma");

exports.createOrder = async (req, res, next) => {
  try {
    const { customerName, customerEmail, items } = req.body; // items = [{ productId, quantity }]

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Keranjang belanja tidak boleh kosong." });
    }

    // Jalankan Database Transaction untuk keamanan data tingkat tinggi
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      // Loop setiap item yang dibeli pembeli
      for (const item of items) {
        // 1. Ambil data produk terkini langsung dari DB di dalam transaksi
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(
            `Produk dengan ID ${item.productId} tidak ditemukan.`,
          );
        }

        // 2. Concurrency Control: Validasi apakah stok mencukupi
        if (product.currentStock < item.quantity) {
          throw new Error(
            `Stok untuk produk '${product.name}' tidak mencukupi (Tersisa: ${product.currentStock}).`,
          );
        }

        // 3. Kurangi stok produk secara langsung
        await tx.product.update({
          where: { id: item.productId },
          data: { currentStock: product.currentStock - item.quantity },
        });

        // 4. Hitung total harga
        const itemTotal = parseFloat(product.price) * item.quantity;
        totalAmount += itemTotal;

        // Siapkan data untuk tabel order_items
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });
      }

      // 5. Generate Nomor Invoice Unik secara otomatis (INV/TahunBulanHari/Random)
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const invoiceNumber = `INV/${dateStr}/${randomId}`;

      // 6. Buat data pesanan induk beserta detailnya sekaligus (Nested Write)
      const newOrder = await tx.order.create({
        data: {
          invoiceNumber,
          customerName,
          customerEmail,
          totalAmount,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true }, // Sertakan detail item di response kembalian
      });

      return newOrder;
    });

    res.status(201).json({ message: "Checkout berhasil!", order: result });
  } catch (error) {
    // Tangani error stok habis dari baris throw new Error di atas
    res.status(400).json({ error: error.message });
  }
};
