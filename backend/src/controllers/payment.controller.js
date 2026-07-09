// const axios = require("axios");
// const Order = require("../models/Order");

// const API_BASE = process.env.INPAY_API_BASE || "https://inpay.uz/api/v1";

// // inPAY.uz rasmiy hujjatiga ko'ra 2 bosqichli oqim:
// // 1) GET /authorization?merchant_id=&merchant_token=  -> bearer_token olamiz
// // 2) POST /create (Bearer bilan)                       -> pay_url olamiz

// const getBearerToken = async () => {
//   const { data } = await axios.get(`${API_BASE}/authorization/`, {
//     params: {
//       merchant_id: process.env.INPAY_MERCHANT_ID,
//       merchant_token: process.env.INPAY_TOKEN,
//     },
//   });
//   return data?.bearer_token;
// };

// // POST /api/payments/create  (auth) — body: { orderId }
// const createPayment = async (req, res) => {
//   try {
//     const { orderId } = req.body;
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
//     if (String(order.user) !== req.user.id) {
//       return res.status(403).json({ message: "Ruxsat yo'q" });
//     }

//     if (!process.env.INPAY_TOKEN || !process.env.INPAY_MERCHANT_ID) {
//       return res.status(503).json({
//         message:
//           "To'lov tizimi ulanmagan. Admin inPAY.uz kabinetidan Merchant ID va Token olib, .env fayliga qo'shishi kerak.",
//       });
//     }

//     // 1-qadam: bearer token olish
//     const bearerToken = await getBearerToken();
//     if (!bearerToken) {
//       return res.status(502).json({ message: "inPAY'dan avtorizatsiya tokeni olinmadi" });
//     }

//     // 2-qadam: to'lov yaratish
//     const response = await axios.post(
//       `${API_BASE}/create/`,
//       {
//         merchant_id: Number(process.env.INPAY_MERCHANT_ID),
//         token: process.env.INPAY_TOKEN,
//         amount: order.totalAmount,
//         description: `Buyurtma #${order._id}`,
//         payment_method: process.env.INPAY_PAYMENT_METHOD || "click",
//         callback_url: `${process.env.SERVER_URL || "http://localhost:5000"}/api/payments/callback`,
//         order_id: String(order._id),
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${bearerToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const paymentUrl = response.data?.pay_url;
//     const transactionId = response.data?.transaction_id || response.data?.id || "";

//     order.paymentTransactionId = transactionId;
//     await order.save();

//     res.json({ paymentUrl, transactionId, raw: response.data });
//   } catch (error) {
//     // inPAY'dan kelgan aniq xato javobini konsolga chiqaramiz (masalan
//     // CALLBACK_NOT_WHITELISTED kabi) — debug qilishda foydali.
//     console.error("inPAY xatosi:", error.response?.data || error.message);
//     res.status(500).json({
//       message: error.response?.data?.message || error.message,
//       details: error.response?.data?.details,
//     });
//   }
// };

// // POST /api/payments/callback — inPAY tomonidan chaqiriladigan webhook
// const paymentCallback = async (req, res) => {
//   try {
//     const { order_id, status, transaction_id } = req.body;
//     const order = await Order.findById(order_id);
//     if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });

//     if (status === "success" || status === "paid") {
//       order.paymentStatus = "paid";
//       order.status = "processing";
//       if (transaction_id) order.paymentTransactionId = transaction_id;
//     } else if (status === "failed" || status === "cancelled") {
//       order.paymentStatus = "failed";
//     }
//     await order.save();

//     res.json({ ok: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { createPayment, paymentCallback };
const axios = require("axios");
const Order = require("../models/Order");

const API_BASE = process.env.INPAY_API_BASE || "https://inpay.uz/api/v1";

// inPAY.uz rasmiy hujjatiga ko'ra 2 bosqichli oqim:
// 1) GET /authorization?merchant_id=&merchant_token=  -> bearer_token olamiz
// 2) POST /create (Bearer bilan)                       -> pay_url olamiz

const getBearerToken = async () => {
  const { data } = await axios.get(`${API_BASE}/authorization/`, {
    params: {
      merchant_id: process.env.INPAY_MERCHANT_ID,
      merchant_token: process.env.INPAY_TOKEN,
    },
  });
  return data?.bearer_token;
};

// POST /api/payments/create  (auth) — body: { orderId }
const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
    if (String(order.user) !== req.user.id) {
      return res.status(403).json({ message: "Ruxsat yo'q" });
    }

    if (!process.env.INPAY_TOKEN || !process.env.INPAY_MERCHANT_ID) {
      return res.status(503).json({
        message:
          "To'lov tizimi ulanmagan. Admin inPAY.uz kabinetidan Merchant ID va Token olib, .env fayliga qo'shishi kerak.",
      });
    }

    // 1-qadam: bearer token olish
    const bearerToken = await getBearerToken();
    if (!bearerToken) {
      return res.status(502).json({ message: "inPAY'dan avtorizatsiya tokeni olinmadi" });
    }

    // 2-qadam: to'lov yaratish
    const response = await axios.post(
      `${API_BASE}/create/`,
      {
        merchant_id: Number(process.env.INPAY_MERCHANT_ID),
        token: process.env.INPAY_TOKEN,
        amount: order.totalAmount,
        description: `Buyurtma #${order._id}`,
        // O'ZGARTIRILDI: Bu yerda endi "inpay" qiymati bor. Bu mijozga inPAY checkout sahifasida hamma usullarni ko'rsatadi.
        payment_method: "inpay",
        callback_url: `${process.env.SERVER_URL || "http://localhost:5000"}/api/payments/callback`,
        order_id: String(order._id),
      },
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentUrl = response.data?.pay_url;
    const transactionId = response.data?.transaction_id || response.data?.id || "";

    order.paymentTransactionId = transactionId;
    await order.save();

    res.json({ paymentUrl, transactionId, raw: response.data });
  } catch (error) {
    // inPAY'dan kelgan aniq xato javobini konsolga chiqaramiz (masalan
    // CALLBACK_NOT_WHITELISTED kabi) — debug qilishda foydali.
    console.error("inPAY xatosi:", error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.message || error.message,
      details: error.response?.data?.details,
    });
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
