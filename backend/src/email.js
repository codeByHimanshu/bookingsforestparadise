const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route to handle form submissions
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  // Nodemailer Transport
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Use 587 for TLS or 465 for SSL
    secure: true, // Set to true if using port 465
    auth: {
      user: "himanshusingh993567@gmail.com",
      pass: "mywa wdyu lweu pltg",
    },
  });
  

  // Email to the application owner
  const ownerMailOptions = {
    from: email,
    to: "himanshusingh993567@gmail.com", // Replace with the owner's email
    subject: `New Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Email to the user
  const userMailOptions = {
    from:"himanshusingh993567@gmail.com", // Replace with your email
    to: email,
    subject: "Thank You for Your Submission",
    text: `Hello ${name},\n\nThank you for reaching out to us. Here is a copy of your message:\n\n${message}\n\nWe will get back to you shortly!\n\nBest Regards,\n DigiPants`,
  };

  // Send emails
  Promise.all([
    transporter.sendMail(ownerMailOptions),
    transporter.sendMail(userMailOptions),
  ])
    .then(() => res.status(200).send("Emails sent successfully!"))
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Failed to send emails.");
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
