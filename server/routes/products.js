const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all active products (with optional category/search filter)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = { isActive: true };

    if (category) query.category = { $regex: category, $options: 'i' };
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { discountedPrice: 1 };
    if (sort === 'price_desc') sortOption = { discountedPrice: -1 };

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
