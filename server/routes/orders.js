const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

// ======================
// PLACE ORDER
// ======================
router.post("/", protect, async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress, upiTransactionId } =
      req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product || product.isActive === false) continue;

      const price =
        product.discountedPrice && product.discountedPrice > 0
          ? product.discountedPrice
          : product.price;

      totalAmount += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
        image: product.images?.[0] || "",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      shippingAddress,
      upiTransactionId,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ======================
// GET MY ORDERS
// ======================
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    console.error("MY ORDERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;