const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("Room", roomSchema);
