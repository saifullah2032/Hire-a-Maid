// Import Firebase Firestore modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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
// Function to handle search
async function searchBooking(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const searchInput = document.getElementById("searchInput").value.trim();
    if (!searchInput) {
        alert("Please enter a Booking ID or Name.");
        return;
    }

    console.log("Searching for:", searchInput);

    try {
        const bookingsRef = collection(db, "form-fill");

        // Check if search input is a booking ID
        let foundBooking = null;
        const docRef = doc(bookingsRef, searchInput);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            foundBooking = docSnap.data();
        } else {
            // If not found by booking ID, search by name
            const q = query(bookingsRef, where("name", "==", searchInput));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                foundBooking = querySnapshot.docs[0].data();
            }
        }

        if (foundBooking) {
            console.log("Booking Found:", foundBooking);
            window.location.href = `request-details.html?bookingid=${searchInput}`;
        } else {
            alert("No matching booking found.");
        }
    } catch (error) {
        console.error("Error searching booking:", error);
        alert("Error searching booking.");
    }
}

// Attach event listener to prevent form reload
document.getElementById("searchButton").addEventListener("click", searchBooking);
document.getElementById("searchForm").addEventListener("submit", searchBooking);
