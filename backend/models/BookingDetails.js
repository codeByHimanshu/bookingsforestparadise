
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
    rooms: { type: Number, required: true },
    roomType: { type: String, required: true },
    totalAmount: { type: Number, required: true },
});

const Book = mongoose.model('Book', BookingSchema);

module.exports = Book;
