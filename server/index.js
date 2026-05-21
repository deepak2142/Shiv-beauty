const cors = require("cors");
app.use(cors());
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
console.log("AUTH ROUTE FILE LOADED");

const app = express();

app.use("/api/auth", authRoutes);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Shiv Beauty API running' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
