const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();


/* =========================================
   CREATE BOOKING
   POST /api/bookings
========================================= */

router.post("/", async (req, res) => {

    try {

        const bookingData = req.body;

        console.log("New Booking Received:");
        console.log(bookingData);

        console.log("Trying to save booking to MongoDB...");

        const newBooking = await Booking.create({

            name: bookingData.name,
            phone: bookingData.phone,
            pickup: bookingData.pickup,
            dropoff: bookingData.dropoff,
            date: bookingData.date,
            time: bookingData.time,
            passengers: Number(bookingData.passengers),
            vehicle: bookingData.vehicle

        });

        console.log("Booking successfully saved!");
        console.log("Booking ID:", newBooking._id);

        res.status(201).json({

            success: true,
            message: "Your transfer request has been received successfully.",
            bookingId: newBooking._id

        });

    } catch (error) {

        console.error("Booking save error:");
        console.error(error.message);

        res.status(500).json({

            success: false,
            message: "Unable to save your booking. Please try again."

        });

    }

});


/* =========================================
   GET ALL BOOKINGS
   GET /api/bookings
========================================= */

router.get("/", async (req, res) => {

    try {

        const bookings = await Booking
            .find()
            .sort({ createdAt: -1 });

        res.json({

            success: true,
            count: bookings.length,
            bookings

        });

    } catch (error) {

        console.error("Fetch bookings error:");
        console.error(error.message);

        res.status(500).json({

            success: false,
            message: "Unable to fetch bookings."

        });

    }

});


/* =========================================
   UPDATE BOOKING STATUS
   PATCH /api/bookings/:id/status
========================================= */

router.patch("/:id/status", async (req, res) => {

    try {

        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,
                message: "Invalid booking status."

            });

        }

        const booking = await Booking.findByIdAndUpdate(

            req.params.id,

            { status },

            {
                new: true,
                runValidators: true
            }

        );

        if (!booking) {

            return res.status(404).json({

                success: false,
                message: "Booking not found."

            });

        }

        res.json({

            success: true,
            message: "Booking status updated successfully.",
            booking

        });

    } catch (error) {

        console.error("Update status error:");
        console.error(error.message);

        res.status(500).json({

            success: false,
            message: "Unable to update booking status."

        });

    }

});


/* =========================================
   DELETE BOOKING
   DELETE /api/bookings/:id
========================================= */

router.delete("/:id", async (req, res) => {

    try {

        const booking = await Booking.findByIdAndDelete(
            req.params.id
        );

        if (!booking) {

            return res.status(404).json({

                success: false,
                message: "Booking not found."

            });

        }

        res.json({

            success: true,
            message: "Booking deleted successfully."

        });

    } catch (error) {

        console.error("Delete booking error:");
        console.error(error.message);

        res.status(500).json({

            success: false,
            message: "Unable to delete booking."

        });

    }

});


module.exports = router;