require('dotenv').config();

console.log("JWT_SECRET =", process.env.JWT_SECRET);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();

// =======================
// CORS FIXED FOR VERCEL
// =======================
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://shiv-beauty-14ac1s2ei-deepak2142s-projects.vercel.app/",
    "https://shiv-beauty.vercel.app/"
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.options('*', cors());

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// STATIC UPLOADS
// =======================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================
// API ROUTES
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// =======================
// HEALTH CHECK
// =======================
app.get('/', (req, res) => {
  res.send("Shiv Beauty API Running 🚀");
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Shiv Beauty API running'
  });
});

// =======================
// MONGODB CONNECT
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.log("Mongo Error:", err);
  });