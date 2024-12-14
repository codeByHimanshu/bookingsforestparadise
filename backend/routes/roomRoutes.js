const express = require("express");
const multer = require("multer");
const Room = require("../models/Room");
const migrate = require("../config/Migrate");
const BookingSchema = require("../models/BookingDetails");

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
  const { name, price, available, availableRooms, amenities } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const newRoom = await Room.create({ name, price, available, image, availableRooms, amenities });
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

router.post('/update-availability', async (req, res) => {
  try {
    const { roomsToUpdate } = req.body;

    // Ensure roomsToUpdate is an array
    if (!Array.isArray(roomsToUpdate)) {
      return res.status(400).send('Invalid format: roomsToUpdate should be an array');
    }

    // Iterate over each room to update its available rooms
    for (let { roomId, selectedRooms } of roomsToUpdate) {
      // Find the specific room by _id in the database
      const room = await Room.findById(roomId);

      if (room) {
        // Ensure availableRooms is parsed as integer (convert from string if necessary)
        let availableRooms = parseInt(room.availableRooms, 10); // Parse availableRooms as integer

        // Check if there are enough available rooms
        if (availableRooms >= selectedRooms) {
          // Subtract selectedRooms from availableRooms
          availableRooms -= selectedRooms;

          // Update the room's availableRooms in the database
          room.availableRooms = availableRooms.toString(); // Store availableRooms as string

          // Save the updated room document
          await room.save(); // Ensure we are saving only the selected room
        } else {
          return res.status(400).send('Not enough rooms available');
        }
      } else {
        return res.status(404).send(`Room with ID ${roomId} not found`);
      }
    }

    // Send a success response after updating the rooms
    res.status(200).send('Room availability updated successfully');
  } catch (error) {
    console.error('Error updating room availability:', error); // Log detailed error
    res.status(500).send('Server error');
  }
});
router.post('/save-booking-details', async (req, res) => {
  const { checkInDate, checkOutDate, NoOfAdults, NoOfChildren, NoOfRooms } = req.body;
  try {
    const newdata = new BookingSchema({ checkInDate, checkOutDate, NoOfAdults, NoOfChildren, NoOfRooms });
    await newdata.save();
    res.status(201).json({
      msg: "Booking details have been created successfully"
    });
  } catch (error) {
    res.status(500).json({
      msg: "There is an error"
    });
  }
});

module.exports = router;

