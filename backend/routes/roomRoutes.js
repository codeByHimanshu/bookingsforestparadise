const express = require("express");
const multer = require("multer");
const Room = require('../models/Room')
const migrate = require("../config/Migrate");
const Book = require("../models/BookingDetails");

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
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.log(error, "from get request")
    res.status(500).json({ message: "Server Error" });
  }
});

router.get('/room-type', async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(404).json({
      error: "Query parameter is required"
    })
  }
  try {
    const rooms = await Room.find({ name: new RegExp(name, 'i') });
    if (rooms.length === 0) {
      return res.status(400).json({
        message: "no room find with this id"
      })
    }
    res.status(201).json({ rooms })
  } catch (error) {
    return res.status(400).json({
      error
    })
  }

})

router.post("/", async (req, res) => {
  try {
    const { availableRooms, name, price, available, image, amenities } = req.body;

    if (!availableRooms || !name || !price || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newRoom = new Room({
      availableRooms,
      name,
      price,
      available: available !== undefined ? available : true, // Default to true if not provided
      image,
      amenities,
    });

    // Save the room to the database
    const savedRoom = await newRoom.save();

    // Respond with the saved room
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

router.put("/update", async (req, res) => {
  const { name, availableRooms } = req.body;

  if (!name || availableRooms === undefined) {
    return res.status(400).json({
      error: "Name and availableRooms are required"
    });
  }

  try {
    const room = await Room.findOneAndUpdate(
      { name: new RegExp(name, "i") },
      { availableRooms },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        message: "No room found with this name"
      });
    }

    res.status(200).json({
      message: "Room count updated successfully",
      room
    });
  } catch (error) {
    console.error("Error updating room count:", error);
    res.status(500).json({
      error: "An error occurred while updating the room count"
    });
  }
});


router.post('/bookings', async (req, res) => {
  try {
    const {
      username,
      email,
      phoneNumber,
      NoOfPeople,
      NoOfRooms,
      checkInDate,
      checkOutDate,
      room,
      totalAmount
    } = req.body;
    if (
      !username || 
      !email || 
      !phoneNumber || 
      !NoOfPeople || 
      !NoOfRooms || 
      !checkInDate || 
      !checkOutDate || 
      !room || 
      !totalAmount
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const newBooking = new Book({
      username,
      email,
      phoneNumber,
      NoOfPeople,
      NoOfRooms,
      checkInDate,
      checkOutDate,
      room,
      totalAmount
    });
    await newBooking.save();
    console.log(newBooking ,"new booking from the routes")

    return res.status(201).json({ message: 'Booking created successfully.' });

  } catch (error) {
    console.error('Error creating booking:', error.message, error.stack);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

router.get('/room-type', async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(404).json({
      error: "Query parameter is required"
    })
  }
  try {
    const rooms = await Room.find({ name: new RegExp(name, 'i') });
    if (rooms.length === 0) {
      return res.status(400).json({
        message: "no room find with this id"
      })
    }
    res.status(201).json({ rooms })
  } catch (error) {
    return res.status(400).json({
      error
    })
  }

})
router.post('/create-booking-order', async (req, res) => {
  try {
    const {
      username,
      email,
      phoneNumber,
      checkinDate,
      checkoutDate,
      noofadults,
      noofchildren,
      noofroom,
      amount
    } = req.body;
    if (!username || !email || !phoneNumber || !checkinDate || !checkoutDate || !noofadults || !noofroom || !amount) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const newBooking = new Book({
      username,
      email,
      phoneNumber,
      checkinDate,
      checkoutDate,
      noofadults,
      noofchildren,
      noofroom,
      amount
    });
    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});
module.exports = router;

