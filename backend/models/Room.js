const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  availableRooms: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  image: { type: String,required:true},
  amenities: { type: String },
});

module.exports = mongoose.model("Room", roomSchema);
