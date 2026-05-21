const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  discountedPrice: { type: Number },
  category: { type: String, required: true, trim: true },
  brand: { type: String, trim: true },
  stock: { type: Number, default: 0 },
  images: [{ type: String }], // array of image file paths
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  whatsappNumber: { type: String, default: '' }
}, { timestamps: true });

// Auto-calculate discounted price before save
productSchema.pre('save', function (next) {
  if (this.discountPercent > 0) {
    this.discountedPrice = Math.round(this.price - (this.price * this.discountPercent / 100));
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
