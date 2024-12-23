const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    checkinDate: { type: String, required: true },
    checkoutDate: { type: String, required: true },
    noofadults: { type: Number, required: true },
    noofchildren: { type: Number, required: true },
    noofroom: { type: Number, required: true },
    amount: { type: Number, required: true }

});
const Book = mongoose.model('Book',BookingSchema)
module.exports = Book;