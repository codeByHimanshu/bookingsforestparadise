const mongoose = require('mongoose');
const Form = require('../models/Form');
const Room = require('../models/Room');
const Order = require('../models/Order');

async function fetchId1(filter) {
    try {
        const document = await Room.findOne(filter);
        // console.log("room document",document);
        if (document) {
            return document._id;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

async function fetchId2(filter) {
    try {
        const document = await Order.findOne(filter);
        // console.log("order document",document);
        if (document) {
            return document._id;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error.message);
        throw error;
    }
} 
async function migrate(req, res) {
    const filter1 = { name: req.body.name };
    const filter2 = { order_id: req.body.order_id };
    const {username,email,phoneNumber}=req.body;

    try {
        const id1 = await fetchId1(filter1);
        const id2 = await fetchId2(filter2);
        if (!id1) {
            return res.status(404).send('No document found with this room id.');
        }
        if(!id2){
            return res.status(404).send('No document found with this order id');
        }
        const RoomData = await Room.find({ _id: id1 });
        const OrderData = await Order.find({ _id: id2 });
        if ((!RoomData || RoomData.length === 0) || (!OrderData || OrderData.length === 0)) {
            res.status(404).send('No matching Room or Order data found.');
            return;
        }
        const newData = RoomData.map(doc => ({
            name:doc.name,
            order_id: OrderData[0].order_id,
            username:username,
            email:email,
            phoneNumber:phoneNumber
        }));
        console.log(newData)
        await Form.insertMany(newData);
        res.status(200).send('Data migrated successfully.');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Server error');
    }
}

module.exports = migrate;
