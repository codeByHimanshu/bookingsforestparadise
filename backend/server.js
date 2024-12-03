const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Routes
app.use("/api/rooms", roomRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Room Availability API is running.");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
 