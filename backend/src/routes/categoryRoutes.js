const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const list = await Category.find().sort({ name: 1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/categories (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Category already exists' });
    const cat = await Category.create({ name, slug });
    res.status(201).json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/categories/:id (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, slug } = req.body;
    const cat = await Category.findByIdAndUpdate(req.params.id, { name, slug }, { new: true, runValidators: true });
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
