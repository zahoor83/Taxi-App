alert("ADMIN SCRIPT LOADED");
document.addEventListener("DOMContentLoaded", loadBookings);


/* =========================================
   LOAD ALL BOOKINGS
========================================= */

async function loadBookings() {

    const container = document.getElementById("bookings");

    try {

        container.innerHTML = "Loading bookings...";

        const response = await fetch("/api/bookings");

        console.log("API response status:", response.status);

        const data = await response.json();

        console.log("API data:", data);

        if (!data.success) {

            container.innerHTML = "Unable to load bookings.";

            return;
        }

        displayBookings(data.bookings);

    } catch (error) {

        console.error("Admin booking error:", error);

        container.innerHTML =
            "Error loading bookings.";

    }
}


/* =========================================
   DISPLAY BOOKINGS
========================================= */

function displayBookings(bookings) {

    const container = document.getElementById("bookings");

    if (!bookings || bookings.length === 0) {

        container.innerHTML = "<p>No bookings found.</p>";

        return;
    }

    container.innerHTML = "";

    bookings.forEach(booking => {

        const card = document.createElement("div");

        card.className = "booking-card";

        card.innerHTML = `

            <h2>${booking.name}</h2>

            <p>
                <strong>Phone:</strong>
                ${booking.phone}
            </p>

            <p>
                <strong>Pickup:</strong>
                ${booking.pickup}
            </p>

            <p>
                <strong>Drop-off:</strong>
                ${booking.dropoff}
            </p>

            <p>
                <strong>Date:</strong>
                ${booking.date}
            </p>

            <p>
                <strong>Time:</strong>
                ${booking.time}
            </p>

            <p>
                <strong>Passengers:</strong>
                ${booking.passengers}
            </p>

            <p>
                <strong>Vehicle:</strong>
                ${booking.vehicle}
            </p>

            <p>
                <strong>Status:</strong>
                <span class="booking-status">
                    ${booking.status}
                </span>
            </p>

            <div class="booking-actions">

                <button
                    onclick="updateStatus('${booking._id}', 'confirmed')">
                    Confirm
                </button>

                <button
                    onclick="updateStatus('${booking._id}', 'completed')">
                    Complete
                </button>

                <button
                    onclick="updateStatus('${booking._id}', 'cancelled')">
                    Cancel
                </button>

                <button
                    onclick="deleteBooking('${booking._id}')">
                    Delete
                </button>

            </div>

            <hr>

        `;

        container.appendChild(card);

    });
}


/* =========================================
   UPDATE BOOKING STATUS
========================================= */

async function updateStatus(bookingId, status) {

    try {

        const response = await fetch(
            /api/bookings/${bookingId}/status,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data = await response.json();

        console.log("Status update:", data);

        if (!data.success) {

            alert(
                data.message || "Unable to update booking status."
            );

            return;
        }

        alert(
            "Booking status updated to: " + status
        );

        loadBookings();

    } catch (error) {

        console.error("Status update error:", error);

        alert(
            "Unable to update booking status."
        );

    }
}


/* =========================================
   DELETE BOOKING
========================================= */

async function deleteBooking(bookingId) {

    const confirmed = confirm(
        "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {

        return;
    }

    try {

        const response = await fetch(
            /api/bookings/${bookingId},
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        console.log("Delete response:", data);

        if (!data.success) {

            alert(
                data.message || "Unable to delete booking."
            );

            return;
        }

        alert("Booking deleted successfully.");

        loadBookings();

    } catch (error) {

        console.error("Delete booking error:", error);

        alert(
            "Unable to delete booking."
        );

    }
}