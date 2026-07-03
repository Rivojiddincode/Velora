const axios = require("axios");
const Order = require("../models/Order");

// POST /api/payments/create  (auth) — body: { orderId }
// inPAY.uz REST API orqali to'lov yaratadi va mijozni to'lov sahifasiga yo'naltiradi.
// ESLATMA: inPAY merchant kabinetidan olingan haqiqiy INPAY_TOKEN va INPAY_API_URL
// backend/.env fayliga qo'yilgandan so'ng bu to'liq ishlaydi.
const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
    if (String(order.user) !== req.user.id) {
      return res.status(403).json({ message: "Ruxsat yo'q" });
    }

    if (!process.env.INPAY_TOKEN) {
      return res.status(503).json({
        message:
          "To'lov tizimi ulanmagan. Admin inPAY.uz orqali merchant hisobini ochib, INPAY_TOKEN ni .env fayliga qo'shishi kerak.",
      });
    }

    const apiUrl = process.env.INPAY_API_URL || "https://inpay.uz/api/v1/payment";

    const response = await axios.post(
      apiUrl,
      {
        amount: order.totalAmount,
        currency: "UZS",
        description: `Buyurtma #${order._id}`,
        callback_url: `${process.env.SERVER_URL || "http://localhost:5000"}/api/payments/callback`,
        order_id: String(order._id),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.INPAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentUrl =
      response.data?.payment_url || response.data?.url || response.data?.data?.url;
    const transactionId = response.data?.id || response.data?.transaction_id || "";

    order.paymentTransactionId = transactionId;
    await order.save();

    res.json({ paymentUrl, transactionId, raw: response.data });
  } catch (error) {
    res.status(500).json({ message: error.response?.data?.message || error.message });
  }
};

// POST /api/payments/callback — inPAY tomonidan chaqiriladigan webhook
const paymentCallback = async (req, res) => {
  try {
    const { order_id, status, transaction_id } = req.body;
    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });

    if (status === "success" || status === "paid") {
      order.paymentStatus = "paid";
      order.status = "processing";
      if (transaction_id) order.paymentTransactionId = transaction_id;
    } else if (status === "failed" || status === "cancelled") {
      order.paymentStatus = "failed";
    }
    await order.save();

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, paymentCallback };
