const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils.js')
const Order = require('./models/Order.js')
const migrate=require('./config/Migrate.js')
const path = 'path'
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/rooms", roomRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Room Availability API is running.");
});
//Payment
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Razorpay setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
});


// Handle creating an order
app.post("/create-order", async (req, res) => {
    try {
        const { amount, currency, receipt, notes,contact,method,email,vpa } = req.body;
        console.log("Contact:", contact);
        const options = {
            amount: amount * 100,
            currency,
            receipt,
            notes,
        };
        const order = await razorpay.orders.create(options);
        const newOrder = new Order({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            contact,
            method,
            email,
            vpa,
            status: order.status,
        });
        await newOrder.save();
        console.log("New Order:", newOrder);

        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in creating order");
    }
});

// Handle payment verification
app.post("/verify-payment", async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    const secret = razorpay.key_secret;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    try {
        const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
        if (isValidSignature) {
            // Find the order in MongoDB
            const order = await Order.findOne({ order_id: razorpay_order_id });
            if (order) {
                order.status = 'paid';
                order.payment_id = razorpay_payment_id;
                await order.save();  // Update order status in MongoDB
            }
            res.status(200).json({ status: "ok" });
            console.log("Payment verification successful");
        } else {
            res.status(400).json({ status: "verification_failed" });
            console.log("Payment verification failed");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error verifying payment" });
    }
});
app.get('/fetch-payment-details', async (req, res) => {
    const { order_id } = req.query;
    if (!order_id) {
        return res.status(400).json({ error: "Order ID is required" });
    }
    try {
        const order = await Order.findOne({ order_id });
        console.log(order.contact);
        console.log(order.order_id)
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

// Static file route for frontend (index.html)
app.get("/payment-success", (req, res) => {
    res.sendFile(path.join(__dirname, "payment.html"));
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/verification', (req, res) => {
	// do a validation
	const secret = '123456789'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
 