const express = require("express");
const app = express();
const mongoose = require("mongoose");
const print = console.log;
const cors = require("cors");

const shoppingRoutes = require("./api/shopping");
const port = process.env.PORT || 8003; // Ensure that the port is correctly set to an environment variable or default to 8003

app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Define the allowed origins
const allowedOrigins = [
  'https://multivendorapp-frontend.onrender.com', 
  'https://multivendorapp-user-microservice.onrender.com'
]; // Replace with your actual domains

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  credentials: true, // Allow credentials (cookies, Authorization headers)
};

app.use(cors(corsOptions)); // Apply the CORS middleware with the custom options

const { CreateChannel } = require("./utils");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));

async function startApp() {
  try {
    await mongoose.connect(process.env.DB_URI);
    print("Connection successful");

    const channel = await CreateChannel();

    shoppingRoutes(app, channel);

    // Ensure the app listens on all network interfaces
    app.listen(port, '0.0.0.0', () => {  // Listen on '0.0.0.0' to make the app publicly accessible
      console.log(`Order Service is listening on Port ${port}`);
    });
  } catch (err) {
    console.log("Failed to start app:", err);
  }
}

startApp();
