console.log("ADMIN SCRIPT LOADED");

document.addEventListener("DOMContentLoaded", loadBookings);


/* =========================================
   LOAD ALL BOOKINGS
========================================= */

async function loadBookings() {

    const container =
        document.getElementById("bookings");

    try {

        container.innerHTML =
            "Loading bookings...";


        const response =
            await fetch("/api/bookings");


        console.log(
            "API response status:",
            response.status
        );


        const data =
            await response.json();
        const lastUpdated =
    document.getElementById("lastUpdated");

if (lastUpdated) {

    lastUpdated.textContent =
        new Date().toLocaleString();

}

        console.log(
            "API data:",
            data
        );


        if (!data.success) {

            container.innerHTML =
                "<p>Unable to load bookings.</p>";

            return;
        }


        const bookings =
            data.bookings || [];


        updateDashboardStats(
            bookings
        );


        displayBookings(
            bookings
        );


    } catch (error) {

        console.error(
            "Admin booking error:",
            error
        );


        container.innerHTML =
            "<p>Error loading bookings.</p>";

    }

}


/* =========================================
   DISPLAY BOOKINGS
========================================= */

function displayBookings(bookings) {

    const container =
        document.getElementById("bookings");


    if (
        !bookings ||
        bookings.length === 0
    ) {

        container.innerHTML =
            "<p>No bookings found.</p>";

        return;
    }


    container.innerHTML = "";


    bookings.forEach(function(booking) {

        const card =
            document.createElement("div");


        /*
         * IMPORTANT:
         * Card gets a class according to status.
         */

        card.className =
            "booking-card status-" +
            booking.status;


        card.innerHTML = `

            <h2>
                ${booking.name}
            </h2>
        <p class="booking-meta">
    <strong>Booking ID:</strong>
    <span id="booking-id-${booking._id}">
        ${booking._id}
    </span>

    <button
    class="copy-id-button"
    onclick="copyBookingId('${booking._id}', this)"
>
    Copy
</button>
</p>

<p class="booking-meta">
    <strong>Created:</strong>
    ${new Date(booking.createdAt).toLocaleString()}
</p>

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


            <p class="status">

                <strong>Status:</strong>

                <span
                    class="status-badge status-${booking.status}"
                >
                    ${booking.status}
                </span>

            </p>


            <div class="booking-actions">

                <button
                    onclick="updateStatus(
                        '${booking._id}',
                        'confirmed'
                    )"
                >
                    Confirm
                </button>


                <button
                    onclick="updateStatus(
                        '${booking._id}',
                        'completed'
                    )"
                >
                    Complete
                </button>


                <button
                    onclick="updateStatus(
                        '${booking._id}',
                        'cancelled'
                    )"
                >
                    Cancel
                </button>


                <button
                    onclick="deleteBooking(
                        '${booking._id}'
                    )"
                >
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

async function updateStatus(
    bookingId,
    status
) {

    console.log(
        "Updating booking:",
        bookingId,
        status
    );


    try {

        const response =
            await fetch(
               `/api/bookings/${bookingId}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Status update:",
            data
        );


        if (!data.success) {

            alert(
                data.message ||
                "Unable to update booking status."
            );

            return;
        }


        alert(
            "Booking status updated to: " +
            status
        );


        loadBookings();


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );


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

    console.log("Deleting booking:", bookingId);

    try {

        const response = await fetch(
           `/api/bookings/${bookingId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        console.log("Delete response:", data);

        if (!data.success) {

            alert(
                data.message ||
                "Unable to delete booking."
            );

            return;
        }

        alert("Booking deleted successfully.");

        loadBookings();

    } catch (error) {

        console.error(
            "Delete booking error:",
            error
        );

        alert(
            "Unable to delete booking."
        );

    }
}


/* =========================================
   DASHBOARD STATISTICS
========================================= */

function updateDashboardStats(
    bookings
) {

    const total =
        bookings.length;


    const pending =
        bookings.filter(function(booking) {

            return booking.status === "pending";

        }).length;


    const confirmed =
        bookings.filter(function(booking) {

            return booking.status === "confirmed";

        }).length;


    const completed =
        bookings.filter(function(booking) {

            return booking.status === "completed";

        }).length;


    const cancelled =
        bookings.filter(function(booking) {

            return booking.status === "cancelled";

        }).length;


    document.getElementById(
        "totalBookings"
    ).textContent =
        total;


    document.getElementById(
        "pendingBookings"
    ).textContent =
        pending;


    document.getElementById(
        "confirmedBookings"
    ).textContent =
        confirmed;


    document.getElementById(
        "completedBookings"
    ).textContent =
        completed;


    document.getElementById(
        "cancelledBookings"
    ).textContent =
        cancelled;

}
/* =========================================
   SEARCH & FILTER
========================================= */

let allBookings = [];


/* Save all bookings when they load */

const originalDisplayBookings = displayBookings;

displayBookings = function(bookings) {

    allBookings = bookings;

    originalDisplayBookings(bookings);

};


/* Search */

document.addEventListener("input", function(event) {

    if (event.target.id !== "bookingSearch") {
        return;
    }

    filterBookings();

});


/* Status filter */

document.addEventListener("change", function(event) {

    if (event.target.id !== "statusFilter") {
        return;
    }

    filterBookings();

});


/* Filter bookings */

function filterBookings() {

    const searchInput =
        document.getElementById("bookingSearch");

    const statusInput =
        document.getElementById("statusFilter");


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusInput.value;


    const filteredBookings =
        allBookings.filter(function(booking) {

            const name =
                String(booking.name || "")
                    .toLowerCase();

            const phone =
                String(booking.phone || "")
                    .toLowerCase();


            const matchesSearch =
                name.includes(search) ||
                phone.includes(search);


            const matchesStatus =
                selectedStatus === "all" ||
                booking.status === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    displayBookingsOnly(
        filteredBookings
    );

}


/* Display filtered bookings without changing statistics */

function displayBookingsOnly(bookings) {

    const container =
        document.getElementById("bookings");


    if (
        !bookings ||
        bookings.length === 0
    ) {

        container.innerHTML =
            "<p>No matching bookings found.</p>";

        return;
    }


    container.innerHTML = "";


    bookings.forEach(function(booking) {

        const card =
            document.createElement("div");


        card.className =
            "booking-card status-" +
            booking.status;


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

            <p class="status">

                <strong>Status:</strong>

                <span class="status-badge status-${booking.status}">
                    ${booking.status}
                </span>

            </p>

            <div class="booking-actions">

                <button
                    onclick="updateStatus(
                        '${booking._id}',
                        'confirmed'
                    )"
                >
                    Confirm
                </button>

                <button
                    onclick="updateStatus(
                        '${booking._id}',
                        'completed'
                    )"
                >
                    Complete
                </button>

                <button
                    onclick="updateStatus(
                        '${booking._id}',
                        'cancelled'
                    )"
                >
                    Cancel
                </button>

                <button
                    onclick="deleteBooking(
                        '${booking._id}'
                    )"
                >
                    Delete
                </button>

            </div>

            <hr>

        `;


        container.appendChild(card);

    });

}
/* =========================================
   COPY BOOKING ID
========================================= */

function copyBookingId(bookingId, button) {

    navigator.clipboard.writeText(bookingId)
        .then(function () {

            const originalText = button.textContent;

            button.textContent = "Copied!";

            setTimeout(function () {
                button.textContent = originalText;
            }, 1500);

        })
        .catch(function (error) {

            console.error("Copy failed:", error);

            button.textContent = "Copy failed";

            setTimeout(function () {
                button.textContent = "Copy";
            }, 1500);

        });
}
