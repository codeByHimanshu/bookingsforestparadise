const mongoose =require('mongoose');

const BookingsDetailsSchema1=new mongoose.Schema({
    checkInDate:{
        type:Date,
        required:true,
    },checkOutDate:{
        type:Date,
        required:true
    },
    NoOfAdults:{
        type:Number,
        required:true
    },
    NoOfChildren:{
        type:Number,
        required:true
    },
    NoOfRooms:{
        type:Number,
        required:true
    }

});
const BookingSchema=mongoose.model('BookingDetails',BookingsDetailsSchema1);
module.exports=BookingSchema;