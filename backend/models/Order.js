// models/order.js
const mongoose = require('mongoose')

// Order schema definition
const orderSchema = new mongoose.Schema({
  order_id: { type: String},
  amount: { type: Number },
  currency: { type: String},
  receipt: { type: String },
  contact: { type: String },
  mehod: { type: String },
  email: { type: String },
  vpa: { type: String },
  status: { type: String },
  payment_id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

