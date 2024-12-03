const express = require("express");
const multer = require("multer");
const Room = require("../models/Room");

const router = express.Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
  },
});

const upload = multer({ storage });

// Fetch all available rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({ available: true });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Add a new room with image upload
router.post("/", upload.single("image"), async (req, res) => {
  const { name, price, available } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const newRoom = await Room.create({ name, price, available, image });
    res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update room availability
router.put("/:id", async (req, res) => {
  const { available } = req.body;

  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      room.available = available;
      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
