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


        /* Get form values */

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const pickup = document.getElementById("pickup").value.trim();
        const dropoff = document.getElementById("dropoff").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const passengers = document.getElementById("passengers").value;
        const vehicle = document.getElementById("vehicle").value;


        /* Basic validation */

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


        /* Booking data */

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


        /* Show temporary message */

        bookingMessage.textContent =
            "Sending your booking request...";


        try {

            /* Send booking to backend */

            const response = await fetch(
                "http://localhost:5000/api/bookings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(bookingData)
                }
            );


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message || "Booking failed."
                );

            }


            /* Success */

            bookingMessage.textContent =
                result.message;


            bookingForm.reset();


        } catch (error) {

            console.error("Booking Error:", error);


            bookingMessage.textContent =
                "Unable to send booking. Please try again.";

        }

    });

}