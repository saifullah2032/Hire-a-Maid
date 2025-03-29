// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", function () {
    const maidForm = document.getElementById("maidForm");

    if (!maidForm) {
        console.error("❌ Form not found! Ensure it has the correct ID.");
        return;
    }

    maidForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Get form values safely
        const maidIdInput = document.getElementById("maidId");
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const genderInput = document.getElementById("gender");
        const contactInput = document.getElementById("contactNumber");
        const experienceInput = document.getElementById("experience");

        if (!maidIdInput || !nameInput || !emailInput || !genderInput || !contactInput || !experienceInput) {
            console.error("❌ Some form fields are missing! Check your HTML.");
            return;
        }

        const maidId = maidIdInput.value.trim();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const gender = genderInput.value;
        const contactNumber = contactInput.value.trim();
        const experience = experienceInput.value.trim();

        if (!maidId) {
            alert("Maid ID is required!");
            return;
        }

        try {
            // Save data in Firestore
            const maidData = {
                name,
                email,
                gender,
                contactNumber,
                experience,
                timestamp: new Date()
            };

            await setDoc(doc(db, "maid", maidId), maidData);

            alert("✅ Maid details added successfully!");
            maidForm.reset();
        } catch (error) {
            console.error("❌ Error adding maid:", error);
            alert("Failed to add maid!");
        }
    });
});
