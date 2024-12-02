const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  image: { type: String, required: true },
  capacity: { type: Number, default: 4 }, // Max people per room
});

module.exports = mongoose.model("Room", roomSchema);
