const Order = require("../models/Order");

// POST /api/orders (auth)
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, pickupAddress, customerName, customerPhone, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Savat bo'sh" });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      pickupAddress,
      customerName,
      customerPhone,
      paymentMethod: paymentMethod || "card",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/orders/my (auth)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email phone").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "processing", "ready", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Noto'g'ri status" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/payment-status (admin) — punktda naqd/karta to'lovini qo'lda belgilash uchun
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const allowed = ["pending", "paid", "failed"];
    if (!allowed.includes(paymentStatus)) {
      return res.status(400).json({ message: "Noto'g'ri to'lov holati" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true });
    if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, updatePaymentStatus };