// Import Firebase Firestore modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDKHHmFhtcMsMj365jMcGGSU5UfoVKT3SY",
    authDomain: "maid-booking-4ec9e.firebaseapp.com",
    projectId: "maid-booking-4ec9e",
    storageBucket: "maid-booking-4ec9e.appspot.com",
    messagingSenderId: "59794486383",
    appId: "1:59794486383:web:a1de68abd7a9da4945099a",
    measurementId: "G-48143C3T7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get Booking ID from URL
const urlParams = new URLSearchParams(window.location.search);
let bookingId = urlParams.get("bookingid");

// Ensure correct format (prepend "BK" if missing)
if (bookingId && !bookingId.startsWith("BK")) {
    bookingId = "BK" + bookingId;
}

console.log("Fetching details for:", bookingId);

// Function to fetch booking details from Firestore
async function fetchBookingDetails() {
    if (!bookingId) {
        console.error("No booking ID found in URL.");
        document.querySelector(".details-container").innerHTML = "<h2>Invalid Booking ID</h2>";
        return;
    }

    try {
        const docRef = doc(db, "form-fill", bookingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Booking Data:", data);

            // Update UI with fetched data
            document.getElementById("bookingId").textContent = bookingId;
            document.getElementById("customerName").textContent = data.name || "N/A";
            document.getElementById("customerMobile").textContent = data.contact || "N/A";
            document.getElementById("customerEmail").textContent = data.email || "N/A";
            document.getElementById("bookingDate").textContent = data.start_date || "N/A";
            document.getElementById("bookingStatus").textContent = data.status || "N/A";
            document.getElementById("assignedMaid").textContent = data.assignedTo || "Not Assigned";

            // Set back button URL based on status
            let backUrl = "all-requests.html";
            if (data.status === "Assigned") backUrl = "assign-request.html";
            else if (data.status === "Pending") backUrl = "new-request.html";
            else if (data.status === "Cancelled") backUrl = "cancel-request.html";

            document.getElementById("backButton").setAttribute("href", backUrl);
        } else {
            console.warn("Booking ID not found in Firestore.");
            document.querySelector(".details-container").innerHTML = "<h2>Booking Not Found</h2>";
        }
    } catch (error) {
        console.error("Error fetching booking details:", error);
        document.querySelector(".details-container").innerHTML = "<h2>Error Fetching Data</h2>";
    }
}

// Run fetch function on page load
window.onload = fetchBookingDetails;
