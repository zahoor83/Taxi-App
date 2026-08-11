const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDatabase = require("./config/database");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


/* ================================
   MIDDLEWARE
================================ */

app.use(cors());

app.use(express.json());

app.use("/admin", express.static(path.join(__dirname, "../admin")));

/* ================================
   ROUTES
================================ */

app.use("/api/bookings", bookingRoutes);


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
   START SERVER
================================ */

const startServer = async () => {

    await connectDatabase();

    app.listen(PORT, "0.0.0.0", () => {

        console.log(
            "Riviera Transfers server running on http://localhost:" + PORT
        );

    });

};


startServer();