const express = require("express");
const router = express.Router();
const { createPayment, paymentCallback } = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, createPayment);
router.post("/callback", paymentCallback); // inPAY webhook, auth talab qilinmaydi

module.exports = router;
