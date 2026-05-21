const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress, upiTransactionId } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    // Recalculate total from DB prices (never trust client prices)
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) continue;
      totalAmount += (product.discountedPrice || product.price) * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.discountedPrice || product.price,
        quantity: item.quantity,
        image: product.images[0] || ''
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      shippingAddress,
      upiTransactionId
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
