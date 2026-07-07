const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const normalizeCategoryName = (name = '') => {
  const normalized = String(name).trim().toLowerCase();
  const aliases = {
    mujskoy: 'Erkaklar',
    erkek: 'Erkaklar',
    erkak: 'Erkaklar',
    erkaklar: 'Erkaklar',
    men: 'Erkaklar',
    male: 'Erkaklar',
    boys: 'Erkaklar',
    ayollar: 'Ayollar',
    ayol: 'Ayollar',
    women: 'Ayollar',
    woman: 'Ayollar',
    female: 'Ayollar',
    girls: 'Ayollar',
    car: 'Car',
    cars: 'Car',
    avto: 'Car',
  };
  return aliases[normalized] || String(name).trim();
};

const buildCategorySlug = (name) => {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const list = await Category.find().sort({ name: 1 });
    res.json(list.map((item) => ({ ...item.toObject(), name: normalizeCategoryName(item.name) })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/categories (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const normalizedName = normalizeCategoryName(name);
    const exists = await Category.findOne({ name: normalizedName });
    if (exists) return res.status(400).json({ message: 'Category already exists' });
    const cat = await Category.create({ name: normalizedName, slug: slug || buildCategorySlug(normalizedName) });
    res.status(201).json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/categories/:id (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, slug } = req.body;
    const normalizedName = normalizeCategoryName(name);
    const cat = await Category.findByIdAndUpdate(req.params.id, { name: normalizedName, slug: slug || buildCategorySlug(normalizedName) }, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/categories/:id (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
