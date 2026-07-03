const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
};

// GET /api/products/filters — sidebar uchun kategoriya/rang/narx statistikasi
// DIQQAT: bu /:id dan OLDIN turishi shart, aks holda "filters" ID sifatida qabul qilinadi
router.get("/filters", async (req, res) => {
  try {
    const [categories, ageGroups, colorsAgg, priceStats] = await Promise.all([
      Product.aggregate([
        { $match: { category: { $ne: "" } } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Product.aggregate([{ $group: { _id: "$ageGroup", count: { $sum: 1 } } }]),
      Product.aggregate([
        { $unwind: "$colors" },
        { $group: { _id: "$colors" } },
      ]),
      Product.aggregate([
        { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
      ]),
    ]);

    res.json({
      categories: (() => {
        const list = categories.map((c) => ({ name: c._id, count: c.count }));
        // Ensure common age/category buckets are available in sidebar even if empty
        const required = ["Ayollar", "Bolalar"];
        const names = new Set(list.map((l) => l.name));
        required.forEach((r) => {
          if (!names.has(r)) list.push({ name: r, count: 0 });
        });
        return list;
      })(),
      ageGroups: ageGroups.map((a) => ({ name: a._id, count: a.count })),
      colors: colorsAgg.map((c) => c._id),
      priceMin: priceStats[0]?.min || 0,
      priceMax: priceStats[0]?.max || 0,
      total: await Product.countDocuments(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products — filter, sort, pagination bilan
router.get("/", async (req, res) => {
  try {
    const {
      category,
      ageGroup,
      minPrice,
      maxPrice,
      colors,
      sizes,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (ageGroup) filter.ageGroup = ageGroup;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.name = { $regex: search, $options: "i" };
    if (colors) filter.colors = { $in: colors.split(",") };
    if (sizes) filter.sizes = { $in: sizes.split(",") };

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "popular") sortOption = { reviewsCount: -1 };

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 12);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products — yangi mahsulot (admin, bir nechta rasm bilan)
router.post("/", authMiddleware, adminMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.sizes) data.sizes = parseArrayField(data.sizes);
    if (data.colors) data.colors = parseArrayField(data.colors);

    if (req.files && req.files.length > 0) {
      data.images = req.files.map((f) => `/uploads/${f.filename}`);
      data.image = data.images[0];
    }

    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id — tahrirlash (admin)
router.put("/:id", authMiddleware, adminMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.sizes) data.sizes = parseArrayField(data.sizes);
    if (data.colors) data.colors = parseArrayField(data.colors);

    if (req.files && req.files.length > 0) {
      data.images = req.files.map((f) => `/uploads/${f.filename}`);
      data.image = data.images[0];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id — o'chirish (admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json({ message: "Mahsulot o'chirildi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;