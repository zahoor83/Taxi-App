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

/* ================================
   DATABASE CONNECTION
================================ */

app.use(async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch (error) {
        next(error);
    }
});

/* ================================
   TEST ROUTE
================================ */

app.get("/", (req, res) => {
    res.json({
        message: "Riviera Transfers API is running!",
        status: "success"
    });
});

/* ================================
   BOOKING ROUTES
================================ */

app.use("/api/bookings", bookingRoutes);

/* ================================
   EXPORT NETLIFY FUNCTION
================================ */

module.exports = serverless(app);