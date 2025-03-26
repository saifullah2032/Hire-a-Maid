// Import Firebase modules (only needed for normal users)
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

// Initialize Firebase (only for normal users)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get form elements
const loginForm = document.getElementById("loginForm");
const roleSelect = document.getElementById("role");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitButton = document.querySelector("button");
const errorMessage = document.getElementById("error-message");

// Enable/disable login fields based on role selection
roleSelect.addEventListener("change", function () {
    const isRoleSelected = roleSelect.value !== "";
    usernameInput.disabled = !isRoleSelected;
    passwordInput.disabled = !isRoleSelected;
    submitButton.disabled = !isRoleSelected;
});

// Login event listener
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = usernameInput.value.trim();
    const password = passwordInput.value;
    const role = roleSelect.value;

    errorMessage.textContent = ""; // Clear previous errors

    // 🔹 **Admin Login - No Firebase**
    if (role === "Admin") {
        if (email === "admin@example.com" && password === "admin@123") {
            // ✅ Redirect to Admin Dashboard without any alert
            window.location.href = "admin/index.html";
            return;
        } else {
            // ❌ Show error if admin credentials are wrong
            errorMessage.textContent = "Invalid admin credentials!";
            return;
        }
    }

    else{
    // 🔹 **Authenticate Normal Users Using Firebase Auth**
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user data from Firestore using **user UID**
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            errorMessage.textContent = "User data not found in Firestore!";
            return;
        }

        const userData = userDoc.data();
        localStorage.setItem("user", JSON.stringify(userData));

        // ✅ Redirect to Profile page for normal users
        window.location.href = "userprofile.html";
    } catch (error) {
        console.error("Login Error:", error);
        errorMessage.textContent = "Invalid credentials. Please try again.";
    }
    }
});
