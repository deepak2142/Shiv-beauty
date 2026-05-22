const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// All admin routes are protected
router.use(protect);
router.use(adminOnly);

// --- PRODUCTS ---

// Get all products (including inactive)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add product with images
router.post('/products', upload.array('images', 6), async (req, res) => {
  try {
    const { name, description, price, discountPercent, category, brand, stock, tags, whatsappNumber } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/products/${f.filename}`) : [];

    const product = await Product.create({
      name, description,
      price: Number(price),
      discountPercent: Number(discountPercent) || 0,
      category, brand, stock: Number(stock) || 0,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      images,
      whatsappNumber
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put('/products/:id', upload.array('images', 6), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, discountPercent, category, brand, stock, tags, whatsappNumber, isActive, keepImages } = req.body;

    // Handle new images
    let images = product.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/products/${f.filename}`);
      // If keepImages flag is set, append; else replace
      images = keepImages === 'true' ? [...images, ...newImages] : newImages;
    }

    Object.assign(product, {
      name, description,
      price: Number(price),
      discountPercent: Number(discountPercent) || 0,
      category, brand,
      stock: Number(stock) || 0,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      images,
      whatsappNumber,
      isActive: isActive !== undefined ? isActive === 'true' : product.isActive
    });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete images from disk
    product.images.forEach(imgPath => {
      const fullPath = path.join(__dirname, '..', imgPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ORDERS ---

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.put('/orders/:id', async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- DASHBOARD STATS ---
router.get('/stats', async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, recentOrders] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email')
    ]);

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenue[0]?.total || 0,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
