// Import Firebase Firestore modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch and display pending requests
async function loadPendingRequests() {
    const tableBody = document.querySelector("tbody"); // Select the table body
    tableBody.innerHTML = ""; // Clear previous data

    try {
        const querySnapshot = await getDocs(collection(db, "form-fill"));

        let found = false;
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.status && data.status.toLowerCase() === "Pending") {
                found = true;

                const row = `
                    <tr>
                        <td>${data.bookingID || "N/A"}</td>
                        <td>${data.name || "N/A"}</td>
                        <td>${data.contact || "N/A"}</td>
                        <td>${data.email || "N/A"}</td>
                        <td>${data.start_date || "Not Provided"}</td>
                        <td><span class="badge badge-secondary">Pending</span></td>
                        <td>${data.assignedTo || "Not Assigned"}</td>
                        <td><a href="request-details.html?bookingid=${data.bookingID}" class="btn btn-primary">View Details</a></td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            }
        });

        if (!found) {
            tableBody.innerHTML = "<tr><td colspan='8' style='text-align:center;'>No Pending Requests</td></tr>";
        }

    } catch (error) {
        console.error("Error fetching pending requests:", error);
        tableBody.innerHTML = "<tr><td colspan='8' style='text-align:center; color:red;'>Error loading requests</td></tr>";
    }
}

// Load pending requests on page load
document.addEventListener("DOMContentLoaded", loadPendingRequests);
