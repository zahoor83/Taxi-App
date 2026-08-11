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
   REQUEST LOG
================================= */

app.use((req, res, next) => {
    console.log("API REQUEST:", req.method, req.originalUrl);
    next();
});

/* =================================
   DATABASE
================================= */

app.use(async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch (error) {
        console.error("DATABASE ERROR:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed.",
            error: error.message
        });
    }
});

/* =================================
   TEST
================================= */

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Riviera Transfers API is running!",
        status: "success"
    });
});

/* =================================
   BOOKINGS
================================= */

app.use("/api/bookings", bookingRoutes);

/* =================================
   ERROR HANDLER
================================= */

app.use((err, req, res, next) => {
    console.error("API ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error."
    });
});

/* =================================
   NETLIFY HANDLER
================================= */

exports.handler = serverless(app);