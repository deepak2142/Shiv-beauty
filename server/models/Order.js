const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['upi', 'whatsapp', 'cod'],
    default: 'upi'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String
  },
  upiTransactionId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
