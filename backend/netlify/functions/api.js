const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDatabase = require("../../config/database");
const bookingRoutes = require("../../routes/bookingRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* =================================
   DATABASE CONNECTION
================================= */

app.use(async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        next(error);
    }
});

/* =================================
   TEST ROUTE
================================= */

app.get("/", (req, res) => {
    res.json({
        message: "Riviera Transfers API is running!",
        status: "success"
    });
});

/* =================================
   BOOKING ROUTES

   IMPORTANT:
   Netlify redirects:

   /api/bookings
        ↓
   /.netlify/functions/api/bookings

   Therefore Express must use /bookings,
   NOT /api/bookings.
================================= */

app.use("/bookings", bookingRoutes);

/* =================================
   NETLIFY FUNCTION
================================= */

exports.handler = serverless(app);