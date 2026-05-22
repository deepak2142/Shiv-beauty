const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// =======================
// GET CATEGORIES (MUST BE FIRST)
// =======================
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', {
      isActive: true,
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// GET ALL PRODUCTS
// =======================
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    let query = { isActive: true };

    // category filter
    if (category) {
      query.category = new RegExp(category, 'i');
    }

    // search filter
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };

    const products = await Product.find(query).sort(sortOption);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// GET SINGLE PRODUCT (LAST)
// =======================
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;