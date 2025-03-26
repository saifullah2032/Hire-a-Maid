// Import Firebase Firestore
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch and update dashboard stats
async function updateDashboard() {
    try {
        // References to collections
        const categoryRef = collection(db, "category");
        const maidsRef = collection(db, "maid");
        const formFillRef = collection(db, "form-fill");

        // Fetch all data
        const [categorySnap, maidsSnap, formFillSnap] = await Promise.all([
            getDocs(categoryRef),
            getDocs(maidsRef),
            getDocs(formFillRef),
        ]);

        // Initialize Counters
        let totalCategories = categorySnap.size;
        let totalMaids = maidsSnap.size;
        let totalRequests = 0;
        let newRequests = 0;
        let assignedRequests = 0;
        let canceledRequests = 0;

        formFillSnap.forEach(doc => {
            totalRequests++;
            const status = doc.data().status.toLowerCase();

            if (status === "pending") newRequests++;
            else if (status === "assigned") assignedRequests++;
            else if (status.toLowerCase() === "cancelled") canceledRequests++;
        });

        // Update Dashboard UI
        document.getElementById("totalCategory").textContent = totalCategories;
        document.getElementById("totalMaids").textContent = totalMaids;
        document.getElementById("newRequest").textContent = newRequests;
        document.getElementById("assignRequest").textContent = assignedRequests;
        document.getElementById("cancelRequest").textContent = canceledRequests;
        document.getElementById("totalRequests").textContent = totalRequests;

    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
}

// Load dashboard stats on page load
document.addEventListener("DOMContentLoaded", updateDashboard);
