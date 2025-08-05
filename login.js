// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDKHHmFhtcMsMj365jMcGGSU5UfoVKT3SY",
    authDomain: "maid-booking-4ec9e.firebaseapp.com",
    databaseURL: "https://maid-booking-4ec9e-default-rtdb.firebaseio.com",
    projectId: "maid-booking-4ec9e",
    storageBucket: "maid-booking-4ec9e.firebasestorage.app",
    messagingSenderId: "59794486383",
    appId: "1:59794486383:web:a1de68abd7a9da4945099a",
    measurementId: "G-48143C3T7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginForm = document.getElementById("loginForm");
const roleSelect = document.getElementById("role");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitButton = document.querySelector("button");
const errorMessage = document.getElementById("error-message");

// Enable inputs when role is selected
roleSelect.addEventListener("change", () => {
    const isRoleSelected = roleSelect.value !== "";
    usernameInput.disabled = !isRoleSelected;
    passwordInput.disabled = !isRoleSelected;
    submitButton.disabled = !isRoleSelected;
});

// Login logic
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = usernameInput.value.trim();
    const password = passwordInput.value;
    const role = roleSelect.value;

    errorMessage.textContent = ""; // Reset error message

    if (role === "Admin") {
        // Admin hardcoded login
        if (email === "admin@example.com" && password === "admin@123") {
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = "admin/index.html";
        } else {
            errorMessage.textContent = "Invalid admin credentials!";
        }
        return;
    }

    // Firebase Auth for normal users
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            errorMessage.textContent = "User data not found in Firestore!";
            return;
        }

        const userData = userDoc.data();

        // Store session data
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect to user profile
        window.location.href = "userprofile.html";
    } catch (err) {
        console.error("Login Error:", err);
        errorMessage.textContent = "Invalid credentials. Please try again.";
    }
});
