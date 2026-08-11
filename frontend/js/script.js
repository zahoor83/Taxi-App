/* =========================================
   RIVIERA TRANSFERS
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuButton = document.getElementById("menuButton");
const mainNav = document.querySelector(".main-nav");

if (menuButton && mainNav) {

    menuButton.addEventListener("click", function () {

        mainNav.classList.toggle("active");

    });

}


/* =========================================
   CLOSE MOBILE MENU
========================================= */

const navLinks = document.querySelectorAll(".main-nav a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (mainNav) {
            mainNav.classList.remove("active");
        }

    });

});


/* =========================================
   BOOKING FORM
========================================= */

const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");


if (bookingForm) {

    bookingForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        /* =====================================
           GET FORM VALUES
        ===================================== */

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const pickup = document.getElementById("pickup").value.trim();
        const dropoff = document.getElementById("dropoff").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const passengers = document.getElementById("passengers").value;
        const vehicle = document.getElementById("vehicle").value;


        /* =====================================
           BASIC VALIDATION
        ===================================== */

        if (
            !name ||
            !phone ||
            !pickup ||
            !dropoff ||
            !date ||
            !time ||
            !passengers ||
            !vehicle
        ) {

            bookingMessage.textContent =
                "Please complete all booking fields.";

            return;

        }


        /* =====================================
           BOOKING DATA
        ===================================== */

        const bookingData = {

            name: name,
            phone: phone,
            pickup: pickup,
            dropoff: dropoff,
            date: date,
            time: time,
            passengers: passengers,
            vehicle: vehicle

        };


        /* =====================================
           SHOW SENDING MESSAGE
        ===================================== */

        bookingMessage.textContent =
            "Sending your booking request...";


        try {

            /* =================================
               SEND BOOKING TO PRODUCTION API

               IMPORTANT:
               Do NOT use localhost here.
            ================================= */

            const response = await fetch(
                "/api/bookings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(bookingData)
                }
            );


            /* =================================
               READ SERVER RESPONSE
            ================================= */

            const result = await response.json();


            /* =================================
               CHECK RESPONSE
            ================================= */

            if (!response.ok) {

                throw new Error(
                    result.message || "Booking failed."
                );

            }


            /* =================================
               SUCCESS
            ================================= */

            bookingMessage.textContent =
                result.message || "Booking submitted successfully!";


            bookingForm.reset();


        } catch (error) {

            console.error("Booking Error:", error);


            /* =================================
               ERROR
            ================================= */

            bookingMessage.textContent =
                "Unable to send booking. Please try again.";

        }

    });

}