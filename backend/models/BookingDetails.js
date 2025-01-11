
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    NoOfPeople:{type:Number,required:true},
    NoOfRooms:{type:Number,required:true},
    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },
    room: { type: Object, required: true },
    totalAmount: { type: Number, required: true },
});

const Book = mongoose.model('Book', BookingSchema);

module.exports = Book;
