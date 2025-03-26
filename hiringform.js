// Import Firebase Firestore and Auth modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

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
const auth = getAuth(app);

// Select form and fields
const hiringForm = document.querySelector("form");
const emailField = document.getElementById("email");
const serviceDropdown = document.getElementById("service");
const submitButton = document.querySelector("button[type='submit']");

// Disable form by default
submitButton.disabled = true;

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is logged in:", user.email);
        emailField.value = user.email; // Auto-fill email field
        submitButton.disabled = false; // Enable submit button

        // Fetch categories for the service dropdown
        fetchCategories();
    } else {
        console.log("User is not logged in. Submit button disabled.");
        emailField.value = "You must be logged in to book a service";
        emailField.disabled = true;
        submitButton.disabled = true;
        alert("You must be logged in to submit a request.");
    }
});

// Function to fetch service categories from Firestore
async function fetchCategories() {
    try {
        const categoryCollection = collection(db, "category");
        const querySnapshot = await getDocs(categoryCollection);
        serviceDropdown.innerHTML = '<option value="">Select a Service</option>'; // Clear and add default option

        querySnapshot.forEach((doc) => {
            const category = doc.data().name;
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            serviceDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Function to generate the next Booking ID
async function getNextBookingID() {
    const bookingCollection = collection(db, "form-fill");
    const q = query(bookingCollection, orderBy("bookingID", "desc"), limit(1)); // Get last booking ID
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        let lastID = querySnapshot.docs[0].id; // e.g., "BK002"
        let lastNumber = parseInt(lastID.replace("BK", ""), 10); // Extract number part (2)
        let nextNumber = lastNumber + 1; // Increment by 1
        return `BK${String(nextNumber).padStart(3, "0")}`; // Format as "BK003"
    } else {
        return "BK001"; // If no documents exist, start with BK001
    }
}

// Event listener for form submission
hiringForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevents page refresh

    // Ensure user is logged in before allowing submission
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to submit a request.");
        return;
    }

    try {
        // Get the next Booking ID
        const newBookingID = await getNextBookingID();

        // Capture form data
        const formData = {
            bookingID: newBookingID,
            userId: user.uid, // Store user ID
            name: document.getElementById("name").value.trim(),
            contact: document.getElementById("contact").value.trim(),
            address: document.getElementById("address").value.trim(),
            gender: document.getElementById("gender").value,
            email: user.email, // Use logged-in user's email
            service: document.getElementById("service").value,
            shift_from: document.getElementById("shift_from").value || "Not Provided",
            shift_to: document.getElementById("shift_to").value || "Not Provided",
            start_date: document.getElementById("start_date").value || "Not Provided",
            notes: document.getElementById("notes").value.trim() || "No additional notes",
            payment_method: document.getElementById("payment_method").value,
            payment_code: document.getElementById("payment_code").value.trim() || "No Code",
            timestamp: new Date(),
            status: "Pending"
        };

        // Store in Firestore with the custom ID
        await setDoc(doc(db, "form-fill", newBookingID), formData);

        alert(`Form submitted successfully! Booking ID: ${newBookingID}`);
        hiringForm.reset();
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit. Check console for errors.");
    }
});
