const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.put("/:id/payment-status", authMiddleware, adminMiddleware, updatePaymentStatus);

module.exports = router;