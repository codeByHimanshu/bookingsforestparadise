const express = require("express");
const Room = require("../models/Room");

const router = express.Router();

// Fetch all available rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({ available: true });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Add a new room
router.post("/", async (req, res) => {
  const { name, price, image, capacity } = req.body;

  try {
    const newRoom = new Room({
      name,
      price,
      image,
      capacity,
    });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: "Invalid Room Data" });
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
