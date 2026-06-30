const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth.middleware");

// ✅ FIX: fayl bo'sh edi — CRUD routelar yozildi

// GET /api/products — barcha mahsulotlar
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id — bitta mahsulot
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products — yangi mahsulot (himoyalangan)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id — tahrirlash (himoyalangan)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id — o'chirish (himoyalangan)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json({ message: "Mahsulot o'chirildi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
