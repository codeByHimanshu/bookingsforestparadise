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
    const {username,email,phoneNumber}=req.body;
    console.log(req.body);
    try {
        const newData=new Form({username,email,phoneNumber});
        await newData.save();
        res.status(201).json({
            msg: "user is created successfully"
        });        
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Server error');
    }
}

module.exports = migrate;
