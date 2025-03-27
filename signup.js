// Import Firebase modules
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { auth, db } from "./firebase.js"; // Ensure firebase.js is correctly configured

// Get the signup form
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form input values
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Firestore with UID as document ID
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name,
            age: age,
            email: email
        });

        alert("Signup successful! Redirecting...");
        window.location.href = "index.html"; // Redirect to profile page
    } catch (error) {
        console.error("Signup Error:", error);
        
    }
});
