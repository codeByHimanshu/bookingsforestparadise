
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils.js");
const Order = require("./models/Order.js");
const nodemailer = require("nodemailer");
const path = require("path");
const connectDB = require("./config/db");
const roomroute = require('./routes/roomRoutes.js')
const migrate=require('./config/Migrate.js')
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/rooms',roomroute)

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const sendEmail = async (to, subject, body) => {
    if (!to) {
        console.log("No recipient email defined. Skipping email notification.");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // Use 587 for TLS or 465 for SSL
        secure: true, // Set to true if using port 465
        auth: {
            user: "himanshusingh993567@gmail.com", // Your email
            pass: "mywa wdyu lweu pltg", // Your app password
        },
        tls: {
            rejectUnauthorized: false, // Allow self-signed certificates if necessary
        },
    });

    // Email for the user
    const mailOptions = {
        from: "himanshusingh993567@gmail.com", // Replace with a verified email
        to: to, // Send to the user
        subject: subject,
        html: body,
    };
      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", to);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};





app.post("/create-order", async (req, res) => {

    try {
        const { amount, currency, receipt, notes } = req.body;

        const options = {
            amount: amount * 100,
            currency,
            receipt,
          
        };

        const order = await razorpay.orders.create(options);

        // Save order to MongoDB
        const newOrder = new Order({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
            status: order.status,
        });
        await newOrder.save();

        res.json(order);
    } catch (error) {
        console.log("Error creating order:", error);
        res.status(500).send("Error creating order");
    }
});

// Verify payment and send emails
app.post("/verify-payment", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = razorpay.key_secret;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    try {
        const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);

        // Find the order in MongoDB
        const order = await Order.findOne({ order_id: razorpay_order_id });

        if (isValidSignature && order) {
            // Update order status to 'paid'
            order.status = "paid";
            order.payment_id = razorpay_payment_id;
            await order.save();
            const userEmailBody = `
            <h3>Your Booking is Confirmed</h3>
            <p>Order ID: ${order.order_id}</p>
            <p>Amount Paid: ₹${order.amount / 100}</p>
            <p>Currency: ${order.currency}</p>
            <p>Payment ID: ${order.payment_id}</p>
        `;

            const adminEmailBody = `
            <h3>New Booking Received</h3>
            <p>Order ID: ${order.order_id}</p>
            <p>Amount Paid: ₹${order.amount / 100}</p>
            <p>Currency: ${order.currency}</p>
            <p>Payment ID: ${order.payment_id}</p>
        `;
            await sendEmail(process.env.EMAIL_USER, "Dear ..... your stay is confirmed", userEmailBody);
            await sendEmail(process.env.ADMIN_EMAIL, "New Booking Received",adminEmailBody);

            res.status(200).json({ status: "ok" });
            console.log("Payment verification successful and emails sent.");
        } else {
            // Payment verification failed email content
            const failureDetails = `
                <h3>Booking Failed</h3>
                <p>Order ID: ${razorpay_order_id}</p>
                <p>Reason: Payment verification failed.</p>
            `;

            // Notify user and admin
            if (order) {
                await sendEmail(order.notes.EMAIL_USER, "Booking Failed", failureDetails);
            }
            await sendEmail(process.env.ADMIN_EMAIL, "Booking Payment Failed", failureDetails);

            res.status(400).json({ status: "verification_failed" });
            console.log("Payment verification failed and emails sent.");
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ status: "error", message: "Error verifying payment" });
    }
});

app.get("/fetch-payment-details", async (req, res) => {
    const { order_id } = req.query;

    if (!order_id) {
        return res.status(400).json({ error: "Order ID is required" });
    }

    try {
        const order = await Order.findOne({ order_id });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const paymentDetails = {
            order_id: order.order_id,
            amount: order.amount / 100,
            currency: order.currency,
            payment_id: order.payment_id || null,
            status: order.status,
        };

        res.json(paymentDetails);
    } catch (error) {
        console.error("Error fetching payment details:", error);
        res.status(500).json({ error: "Error fetching payment details" });
    }
});
app.post('/form',migrate);

// Static files for frontend
app.get("/payment-success", (req, res) => {
    res.sendFile(path.join(__dirname, "payment.html"));
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'))