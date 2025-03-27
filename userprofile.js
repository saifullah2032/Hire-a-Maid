import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { auth, db } from "./firebase.js"; // Make sure firebase.js correctly exports auth & db

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is logged in:", user.uid); // Debugging log

        // Fetch user profile details
        const userDocRef = doc(db, "users", user.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("User data retrieved:", userData); // Debugging log

                document.getElementById("name").textContent = userData.name || "N/A";
                document.getElementById("age").textContent = userData.age || "N/A";
                document.getElementById("email").textContent = userData.email || "N/A";

                // Fetch form requests filled by the user
                fetchUserRequests(user.uid);
            } else {
                console.error("No document found for user.");
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
        }
    } else {
        console.error("No user data found!");
        window.location.href = "loginpage.html"; // Redirect to login page if not logged in
    }
});

// Function to fetch and display user’s form requests
async function fetchUserRequests(userId) {
    try {
        const bookingsQuery = query(collection(db, "form-fill"), where("userId", "==", userId));
        const querySnapshot = await getDocs(bookingsQuery);
        
        const tableBody = document.querySelector("tbody");
        tableBody.innerHTML = ""; // Clear previous data

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${doc.id}</td>
                <td>${data.name || "N/A"}</td>
                <td>${data.mobile || "N/A"}</td>
                <td>${data.email || "N/A"}</td>
                <td>${data.date || "N/A"}</td>
                <td>${data.status || "Pending"}</td>
                <td>${data.assignedTo || "Unassigned"}</td>
                <td><a href="details.html?id=${doc.id}" class="btn btn-primary">View</a></td>
                <td><button class="btn btn-primary update-status" data-id="${doc.id}">Update Status</button></td>
            `;

            tableBody.appendChild(row);
        });

        // Attach event listeners for status update buttons
        document.querySelectorAll(".update-status").forEach(button => {
            button.addEventListener("click", updateStatus);
        });

    } catch (error) {
        console.error("Error fetching user requests:", error);
    }
}

// Function to update booking status
async function updateStatus(event) {
    const bookingId = event.target.getAttribute("data-id");
    const newStatus = prompt("Enter new status (Pending, Assigned, Canceled):");
    
    if (newStatus && ["Pending", "Assigned", "Canceled"].includes(newStatus)) {
        try {
            const bookingRef = doc(db, "form-fill", bookingId);
            await updateDoc(bookingRef, { status: newStatus });

            alert("Status updated successfully!");
            fetchUserRequests(auth.currentUser.uid); // Refresh the table
        } catch (error) {
            console.error("Error updating status:", error);
        }
    } else {
        alert("Invalid status entered.");
    }
}

// Logout function
document.getElementById("logout").addEventListener("click", () => {
    signOut(auth).then(() => {
        alert("Successfully Logged out.");
        window.location.href = "loginpage.html"; // Redirect to login page
    }).catch((error) => {
        console.error("Error logging out:", error);
    });
});
