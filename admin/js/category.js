// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Firebase Configuration (Updated)
const firebaseConfig = {
    apiKey: "AIzaSyDKHHmFhtcMsMj365jMcGGSU5UfoVKT3SY",
    authDomain: "maid-booking-4ec9e.firebaseapp.com",
    databaseURL: "https://maid-booking-4ec9e-default-rtdb.firebaseio.com",
    projectId: "maid-booking-4ec9e",
    storageBucket: "maid-booking-4ec9e.appspot.com", // Fixed storage bucket
    messagingSenderId: "59794486383",
    appId: "1:59794486383:web:a1de68abd7a9da4945099a",
    measurementId: "G-48143C3T7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form Submission
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("categoryForm");
    const categoryInput = document.getElementById("categoryName");

    // Ensure the form and input field exist
    if (!form || !categoryInput) {
        console.error("Form or input field not found!");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const categoryName = categoryInput.value.trim();
        if (!categoryName) {
            alert("Please enter a category name!");
            return;
        }

        try {
            await setDoc(doc(db, "category", categoryName), { name: categoryName });
            alert("Category added successfully!");
            form.reset();
        } catch (error) {
            console.error("Error adding category:", error);
            alert("Failed to add category!");
        }
    });
});

