console.log("ADMIN SCRIPT LOADED");


/* =========================================
   GLOBAL BOOKINGS
========================================= */

let allBookings = [];


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadBookings();


        const searchInput =
            document.getElementById(
                "bookingSearch"
            );


        const statusFilter =
            document.getElementById(
                "statusFilter"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterBookings
            );

        }


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                filterBookings
            );

        }

    }
);


/* =========================================
   LOAD BOOKINGS
========================================= */

async function loadBookings() {

    const container =
        document.getElementById(
            "bookings"
        );


    if (!container) {

        console.error(
            "Bookings container not found."
        );

        return;
    }


    try {

        container.innerHTML =
            "<p>Loading bookings...</p>";


        const response =
            await fetch(
                "/api/bookings"
            );


        console.log(
            "API response status:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "API data:",
            data
        );


        if (!data.success) {

            container.innerHTML =
                "<p>Unable to load bookings.</p>";

            return;
        }


        allBookings =
            data.bookings || [];


        updateDashboardStats(
            allBookings
        );


        displayBookings(
            allBookings
        );


        const lastUpdated =
            document.getElementById(
                "lastUpdated"
            );


        if (lastUpdated) {

            lastUpdated.textContent =
                new Date().toLocaleString();

        }


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
        document.getElementById(
            "bookings"
        );


    if (!container) {

        console.error(
            "Bookings container not found."
        );

        return;
    }


    if (
        !bookings ||
        bookings.length === 0
    ) {

        container.innerHTML =
            "<p>No bookings found.</p>";

        return;
    }


    container.innerHTML = "";


    bookings.forEach(
        function (booking) {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "booking-card status-" +
                (booking.status || "pending");


            card.innerHTML = `

                <h2>
                    ${escapeHTML(
                        booking.name
                    )}
                </h2>


                <p class="booking-meta">

                    <strong>
                        Booking ID:
                    </strong>

                    <span>
                        ${escapeHTML(
                            booking._id
                        )}
                    </span>

                    <button
                        type="button"
                        class="copy-id-button"
                        onclick="copyBookingId(
                            '${booking._id}',
                            this
                        )"
                    >
                        Copy
                    </button>

                </p>


                <p class="booking-meta">

                    <strong>
                        Created:
                    </strong>

                    ${new Date(
                        booking.createdAt
                    ).toLocaleString()}

                </p>


                <!-- =================================
                     BOOKING DETAIL BOXES
                ================================== -->

                <div class="booking-details">


                    <div class="booking-detail">

                        <strong>
                            Phone
                        </strong>

                        <span>
                            ${escapeHTML(
                                booking.phone
                            )}
                        </span>

                    </div>


                    <div class="booking-detail">

                        <strong>
                            Pickup
                        </strong>

                        <span>
                            ${escapeHTML(
                                booking.pickup
                            )}
                        </span>

                    </div>


                    <div class="booking-detail">

                        <strong>
                            Drop-off
                        </strong>

                        <span>
                            ${escapeHTML(
                                booking.dropoff
                            )}
                        </span>

                    </div>


                    <div class="booking-detail">

                        <strong>
                            Date
                        </strong>

                        <span>
                            ${escapeHTML(
                                booking.date
                            )}
                        </span>

                    </div>


                    <div class="booking-detail">

                        <strong>
                            Time
                        </strong>

                        <span>
                            ${escapeHTML(
                                booking.time
                            )}
                        </span>

                    </div>


                    <div class="booking-detail">

                        <strong>
                            Passengers
                        </strong>

                        <span>
                            ${escapeHTML(
                                String(
                                    booking.passengers
                                )
                            )}
                        </span>

                    </div>


                    <div class="booking-detail">

                        <strong>
                            Vehicle
                        </strong>

                        <span>
                            ${escapeHTML(
                                booking.vehicle
                            )}
                        </span>

                    </div>


                </div>


                <!-- =================================
                     STATUS
                ================================== -->

                <p class="status">

                    <strong>
                        Status:
                    </strong>

                    <span
                        class="status-badge status-${booking.status}"
                    >
                        ${escapeHTML(
                            booking.status
                        )}
                    </span>

                </p>


                <!-- =================================
                     ACTION BUTTONS
                ================================== -->

                <div class="booking-actions">

    ${
        booking.status === "pending"
            ? `
                <button
                    onclick="updateStatus('${booking._id}', 'confirmed')"
                >
                    Confirm
                </button>

                <button
                    onclick="updateStatus('${booking._id}', 'completed')"
                >
                    Complete
                </button>

                <button
                    onclick="updateStatus('${booking._id}', 'cancelled')"
                >
                    Cancel
                </button>
              `
            : ""
    }

    ${
        booking.status === "confirmed"
            ? `
                <button
                    onclick="updateStatus('${booking._id}', 'completed')"
                >
                    Complete
                </button>

                <button
                    onclick="updateStatus('${booking._id}', 'cancelled')"
                >
                    Cancel
                </button>
              `
            : ""
    }

    <button
        onclick="deleteBooking('${booking._id}')"
    >
        Delete
    </button>

</div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   SEARCH + STATUS FILTER
========================================= */

function filterBookings() {

    const searchInput =
        document.getElementById(
            "bookingSearch"
        );


    const statusInput =
        document.getElementById(
            "statusFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedStatus =
        statusInput
            ? statusInput.value
            : "all";


    const filteredBookings =
        allBookings.filter(
            function (booking) {


                const name =
                    String(
                        booking.name || ""
                    )
                    .toLowerCase();


                const phone =
                    String(
                        booking.phone || ""
                    )
                    .toLowerCase();


                const matchesSearch =
                    name.includes(search) ||
                    phone.includes(search);


                const matchesStatus =
                    selectedStatus === "all" ||
                    booking.status ===
                        selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    displayBookings(
        filteredBookings
    );

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


        await loadBookings();


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

async function deleteBooking(
    bookingId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this booking?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/bookings/${bookingId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        console.log(
            "Delete response:",
            data
        );


        if (!data.success) {

            alert(
                data.message ||
                "Unable to delete booking."
            );

            return;
        }


        await loadBookings();


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
        bookings.filter(
            function (booking) {
                return (
                    booking.status ===
                    "pending"
                );
            }
        ).length;


    const confirmed =
        bookings.filter(
            function (booking) {
                return (
                    booking.status ===
                    "confirmed"
                );
            }
        ).length;


    const completed =
        bookings.filter(
            function (booking) {
                return (
                    booking.status ===
                    "completed"
                );
            }
        ).length;


    const cancelled =
        bookings.filter(
            function (booking) {
                return (
                    booking.status ===
                    "cancelled"
                );
            }
        ).length;


    const totalElement =
        document.getElementById(
            "totalBookings"
        );


    const pendingElement =
        document.getElementById(
            "pendingBookings"
        );


    const confirmedElement =
        document.getElementById(
            "confirmedBookings"
        );


    const completedElement =
        document.getElementById(
            "completedBookings"
        );


    const cancelledElement =
        document.getElementById(
            "cancelledBookings"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (confirmedElement) {

        confirmedElement.textContent =
            confirmed;

    }


    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    if (cancelledElement) {

        cancelledElement.textContent =
            cancelled;

    }

}


/* =========================================
   COPY BOOKING ID
========================================= */

function copyBookingId(
    bookingId,
    button
) {

    navigator.clipboard
        .writeText(bookingId)

        .then(
            function () {

                const originalText =
                    button.textContent;


                button.textContent =
                    "Copied!";


                setTimeout(
                    function () {

                        button.textContent =
                            originalText;

                    },
                    1500
                );

            }
        )

        .catch(
            function (error) {

                console.error(
                    "Copy failed:",
                    error
                );


                button.textContent =
                    "Copy failed";


                setTimeout(
                    function () {

                        button.textContent =
                            "Copy";

                    },
                    1500
                );

            }
        );

}

/* =========================================
   SEARCH + STATUS FILTER
========================================= */

function filterBookings() {

    const searchInput =
        document.getElementById("bookingSearch");

    const statusFilter =
        document.getElementById("statusFilter");

    const searchText =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const filteredBookings =
        allBookings.filter(function (booking) {

            const name =
                String(booking.name || "").toLowerCase();

            const phone =
                String(booking.phone || "").toLowerCase();

            const matchesSearch =
                name.includes(searchText) ||
                phone.includes(searchText);

            const matchesStatus =
                selectedStatus === "all" ||
                booking.status === selectedStatus;

            return matchesSearch && matchesStatus;

        });


    displayBookings(filteredBookings);
}


/* =========================================
   SAFE HTML TEXT
========================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}