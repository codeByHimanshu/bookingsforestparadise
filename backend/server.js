
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
const migrate = require('./config/Migrate.js')
// Load environment variables
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/rooms', roomroute)

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
        const { amount, currency, receipt, name } = req.body;

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
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50; text-align: center;">🎉 Booking Confirmed! 🎉</h2>
        <p style="font-size: 16px; color: #555;">Dear ${order.name},</p>
        <p style="font-size: 16px; color: #555;">Thank you for choosing Ratana International. We're thrilled to host you!</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #4CAF50; color: white; text-align: left;">
                <th style="padding: 10px;">Details</th>
                <th style="padding: 10px;">Information</th>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Order ID:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.order_id}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Amount Paid:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${order.amount / 100}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Currency:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.currency}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Payment ID:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.payment_id}</td>
            </tr>
        </table>

        <p style="font-size: 14px; color: #777;">We can't wait to host you! For any questions, feel free to contact us at <a href="mailto:support@ratana.international" style="color: #4CAF50; text-decoration: none;">support@ratana.international</a>.</p>

        <p style="text-align: center; font-size: 14px; color: #777;">📍 Ratana International, Your Luxury Destination</p>
    </div>
`;

            const adminEmailBody = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f1f1f1;">
        <h2 style="color: #FF5722; text-align: center;">📬 New Booking Alert</h2>
        <p style="font-size: 16px; color: #555;">Dear Admin,</p>
        <p style="font-size: 16px; color: #555;">You have received a new booking. Here are the details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #FF5722; color: white; text-align: left;">
                <th style="padding: 10px;">Details</th>
                <th style="padding: 10px;">Information</th>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Order ID:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.order_id}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Amount Paid:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${order.amount / 100}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Currency:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.currency}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Payment ID:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.payment_id}</td>
            </tr>
        </table>

        <p style="font-size: 14px; color: #777;">Please log into the admin dashboard for more details. If you have any questions, contact the support team.</p>

        <p style="text-align: center; font-size: 14px; color: #777;">📍 Admin Dashboard - Ratana International</p>
    </div>
`;


            await sendEmail(process.env.EMAIL_USER, "Dear Guest your stay is confirmed", userEmailBody);
            await sendEmail(process.env.ADMIN_EMAIL, "New Booking Received", adminEmailBody);

            res.status(200).json({ status: "ok" });
            console.log("Payment verification successful and emails sent.");
        } else {
            // Payment verification failed email content
            const failureDetails = `
                <h3>Booking Failed</h3>
                <p>Order ID: ${razorpay_order_id}</p>
                <p>Reason: Payment verification failed.</p>
            `;
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