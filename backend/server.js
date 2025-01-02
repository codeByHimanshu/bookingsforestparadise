const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils.js");
const Order = require("./models/Order.js");
const BookinDetails = require("./models/BookingDetails.js");
const Room = require("./models/Room.js");
const nodemailer = require("nodemailer");
const path = require("path");
const connectDB = require("./config/db");
const roomroute = require("./routes/roomRoutes.js");
const migrate = require("./config/Migrate.js");
const Book = require("./models/BookingDetails.js");
const crypto = require("crypto");

// Load environment variables

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/rooms", roomroute);

var razorpay = new Razorpay({
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
    const { amount, currency, receipt, order_id, email } = req.body;
    const options = {
      amount: amount * 100,
      currency,
      receipt,
      order_id,
    };
    const order = await razorpay.orders.create(options);
    const newOrder = new Order({
      amount: order.amount / 100,
      currency: order.currency,
      receipt: order.receipt,
      order_id: order.id,
      email: email,
    });
    await newOrder.save();
    console.log(newOrder, "new order from server.js");

    res.json({
      success: true,
      order,
      message: "Order created and saved successfully!",
    });
    console.log(order.id + "order id from server.js");
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
});

app.get('/get-email',async(req,res)=>{
    try{
        const email=req.body.email
        const data=await Book.findOne({email});
        if(email){
             res.status(200).json({data} );
        }
    }catch(error){
        res.status(404).json({
            error:error.message
        })
    }
})

app.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const secret = razorpay.key_secret;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  try {
    const isValidSignature = validateWebhookSignature(
      body,
      razorpay_signature,
      secret
    );
    const order = await Order.findOne({ order_id: razorpay_order_id });
    console.log(order, "order from the verify");
    if (isValidSignature && order) {
      order.status = "paid";
      order.payment_id = razorpay_payment_id;
      await order.save();

      const bookings = await Book.findOne({ email: order.email });
      const userEmailBody = `            
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50; text-align: center;">🎉 Booking Confirmed! 🎉</h2>
        <p style="font-size: 16px; color: #555;">Dear ${bookings.username},</p>
        <p style="font-size: 16px; color: #555;">Thank you for choosing Ratana International. We're thrilled to host you!</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #4CAF50; color: white; text-align: left;">
                <th style="padding: 10px;">Details</th>
                <th style="padding: 10px;">Information</th>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.username}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Contact:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.phoneNumber}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.email}</td>
            </tr>
             <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Check-in Date:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.checkInDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Check-out Date:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.checkOutDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Rooms:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.rooms}</td>
                        </tr>
                      
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Guests:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Adults: ${bookings.adults}, Children: ${bookings.children}</td>
                        </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Order ID:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.order_id}</td>
            </tr>
    
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Amount Paid:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${order.amount}</td>
            </tr>
         
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Payment ID:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.payment_id}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Payment Status:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.status}</td>
            </tr>
        </table>

        <p style="font-size: 14px; color: #777;">We can't wait to host you! For any questions, feel free to contact us at <a href="mailto:support@ratana.international" style="color: #4CAF50; text-decoration: none;">support@ratana.international</a>.</p>

        <p style="text-align: center; font-size: 14px; color: #777;">📍 Ratana International, Your Luxury Destination</p>
    </div>
`;
      const adminEmailBody = `
            <h3>New Booking Received</h3>

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
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.username}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Email_id:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.email}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">contact details:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.phoneNumber}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Order ID:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.order_id}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Amount Paid:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${order.amount}</td>
            </tr>
           
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Payment ID:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.payment_id}</td>
            </tr>
             <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Check-in Date:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.checkInDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Check-out Date:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.checkOutDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Rooms:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.rooms}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">roomType:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookings.roomType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Email:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Guests:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Adults: ${bookings.adults}, Children: ${bookings.children}</td>
                        </tr>
        </table>
        <p style="font-size: 14px; color: #777;">Please log into the admin dashboard for more details. If you have any questions, contact the support team.</p>
        <p style="text-align: center; font-size: 14px; color: #777;">📍 Admin Dashboard - Ratana International</p>
    </div>
        `;

      if (bookings.email === order.email) {
        await sendEmail(
          order.email,
          "Dear ..... your stay is confirmed",
          userEmailBody
        );
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "New Booking Received",
          adminEmailBody
        );
      }
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
        await sendEmail(
          order.notes.EMAIL_USER,
          "Booking Failed",
          failureDetails
        );
      }
      await sendEmail(
        process.env.ADMIN_EMAIL,
        "Booking Payment Failed",
        failureDetails
      );

      res.status(400).json({ status: "verification_failed" });
      console.log("Payment verification failed and emails sent.");
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error verifying payment" });
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
      amount: order.amount,
      currency: order.currency,
      payment_id: order.payment_id,
      status: order.status,
    };

    res.json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ error: "Error fetching payment details" });
  }
});
app.post("/form", migrate);

// test

app.get("/order-detail", (req, res) => {
  res.json(Order);
});
app.get("/booking-detail", (req, res) => {
  res.json(BookinDetails);
});

// Static files for frontend
app.get("/payment-success", (req, res) => {
  res.sendFile(path.join(__dirname, "payment.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port ${PORT}"));
