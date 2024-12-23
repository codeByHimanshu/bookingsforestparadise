
const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  receipt: { type: String, required: true },
  name: { type: String},
  mehod: { type: String },
  vpa: { type: String },
  status: { type: String },
  payment_id: { type: String },
  createdAt: { type: Date, default: Date.now },
  email:{type:String}
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

