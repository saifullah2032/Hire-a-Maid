// Import Firebase Firestore modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Function to fetch data from Firestore and display it in the table
async function loadRequests() {
    const tableBody = document.querySelector("tbody"); // Select the table body
    tableBody.innerHTML = ""; // Clear previous data

    try {
        const querySnapshot = await getDocs(collection(db, "form-fill")); // Get all form-fill documents

        if (querySnapshot.empty) {
            tableBody.innerHTML = "<tr><td colspan='9' style='text-align:center;'>No Requests Found</td></tr>";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data(); // Extract document data
            const bookingID = data.bookingID || "N/A";
            const name = data.name || "N/A";
            const contact = data.contact || "N/A";
            const email = data.email || "N/A";
            const date = data.start_date || "Not Provided";
            const status = data.status || "Pending";
            const assignTo = data.assignedTo || "Not Assigned"; // If not assigned, show "Not Assigned"

            // Define badge color based on status
            let statusClass = "badge-primary"; // Default Pending (Blue)
            if (status.toLowerCase() === "assigned") statusClass = "badge-warning"; // Yellow
            else if (status.toLowerCase() === "completed") statusClass = "badge-success"; // Green
            else if (status.toLowerCase() === "cancelled") statusClass = "badge-danger"; // Red

            // Create a new row
            const row = `
                <tr>
                    <td>${bookingID}</td>
                    <td>${name}</td>
                    <td>${contact}</td>
                    <td>${email}</td>
                    <td>${date}</td>
                    <td><span class="badge ${statusClass}">${status}</span></td>
                    <td>${assignTo}</td>
                    <td><a href="request-details.html?bookingid=${bookingID}" class="btn btn-primary">View</a></td>
                    <td><button class="status-btn btn btn-warning" data-id="${docSnap.id}" data-status="${status}">Change Status</button></td>
                </tr>
            `;

            // Append row to the table body
            tableBody.innerHTML += row;
        });

        // Attach event listeners to "Change Status" buttons
        document.querySelectorAll(".status-btn").forEach((button) => {
            button.addEventListener("click", async (event) => {
                const docID = event.target.dataset.id;
                const currentStatus = event.target.dataset.status;
                await updateStatus(docID, currentStatus);
            });
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        tableBody.innerHTML = "<tr><td colspan='9' style='text-align:center; color:red;'>Error loading requests</td></tr>";
    }
}

// Function to update status (Assign or Cancel)
async function updateStatus(docID, currentStatus) {
    if (currentStatus === "Assigned") {
        alert("This request is already assigned!");
        return;
    }

    const choice = confirm("Do you want to Assign this request? Click 'OK' for Assign, or 'Cancel' for Cancel.");

    let newStatus = "";
    if (choice) {
        newStatus = "Assigned";
    } else {
        newStatus = "Cancelled";
    }

    try {
        const requestRef = doc(db, "form-fill", docID);
        await updateDoc(requestRef, { status: newStatus });

        alert(`Status updated to ${newStatus}!`);
        loadRequests(); // Reload table to reflect changes
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status!");
    }
}

// Load data when the page is fully loaded
document.addEventListener("DOMContentLoaded", loadRequests);
