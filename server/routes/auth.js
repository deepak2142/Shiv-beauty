const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =======================
// TOKEN GENERATORS
// =======================

const JWT_SECRET = process.env.JWT_SECRET || "Deep3123";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "RefreshSecret123";

const generateAccessToken = (id) => {
  return jwt.sign(
    { id },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// =======================
// REGISTER
// =======================

router.post("/register", async (req, res) => {
  try {

    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    return res.status(201).json({
      message: "Registration successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      accessToken: generateAccessToken(user._id),

      refreshToken: generateRefreshToken(user._id),
    });

  } catch (err) {

    console.log("REGISTER ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });

  }
});

// =======================
// LOGIN
// =======================

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({

      message: "Login successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      accessToken: generateAccessToken(user._id),

      refreshToken: generateRefreshToken(user._id),

    });

  } catch (err) {

    console.log("LOGIN ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });

  }
});

// =======================
// REFRESH TOKEN
// =======================

router.post("/refresh", async (req, res) => {
  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      REFRESH_SECRET
    );

    const newAccessToken = generateAccessToken(decoded.id);

    return res.status(200).json({
      accessToken: newAccessToken,
    });

  } catch (err) {

    console.log("REFRESH TOKEN ERROR:", err);

    return res.status(403).json({
      message: "Invalid refresh token",
    });

  }
});

module.exports = router;