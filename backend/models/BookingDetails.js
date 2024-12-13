const mongoose =require('mongoose');

const BookingsDetailsSchema1=new mongoose.Schema({
    checkInData:{
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
const BookingDetail=mongoose.model('BookingDetail',BookingsDetailsSchema1);
module.exports=BookingDetail;