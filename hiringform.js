// Import Firebase Firestore and Auth modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
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

//Nav-Links
const navLinks = document.getElementById("nav-links");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      navLinks.innerHTML = `
        <li><a href="index.html">Home</a></li>
        <li><a href="hiringform.html">Find a Maid</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="userprofile.html">User Profile</a></li>
        <li><a href="#" id="logoutBtn">Logout</a></li>
      `;
    } else {
      navLinks.innerHTML = `
        <li><a href="index.html">Home</a></li>
        <li><a href="hiringform.html">Find a Maid</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="loginpage.html">Login</a></li>
      `;
    }

    document.addEventListener("click", function (e) {
      if (e.target && e.target.id === "logoutBtn") {
        localStorage.setItem("isLoggedIn", "false");
        window.location.reload();
      }
    });

// Elements
const hiringForm = document.querySelector("form");
const emailField = document.getElementById("email");
const serviceDropdown = document.getElementById("service");
const submitButton = document.querySelector("button[type='submit']");
const qrContainer = document.getElementById("qrContainer");
const qrCodeDiv = document.getElementById("qrcode");
const confirmPaymentBtn = document.getElementById("confirmPayment");
const txnIdInput = document.getElementById("txnIdInput");

// Disable submit by default
submitButton.disabled = true;

// Auth state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        emailField.value = user.email;
        submitButton.disabled = false;
        fetchCategories();
    } else {
        emailField.value = "Login required to book a service";
        emailField.disabled = true;
        submitButton.disabled = true;
        alert("Please login to submit a request.");
    }
});

// Fetch service categories
async function fetchCategories() {
    try {
        const categoryCollection = collection(db, "category");
        const querySnapshot = await getDocs(categoryCollection);
        serviceDropdown.innerHTML = '<option value="">Select a Service</option>';
        querySnapshot.forEach((docSnap) => {
            const category = docSnap.data().name;
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            serviceDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Generate next booking ID
async function getNextBookingID() {
    const bookingCollection = collection(db, "form-fill");
    const q = query(bookingCollection, orderBy("bookingID", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        let lastID = querySnapshot.docs[0].id;
        let lastNumber = parseInt(lastID.replace("BK", ""), 10);
        let nextNumber = lastNumber + 1;
        return `BK${String(nextNumber).padStart(3, "0")}`;
    } else {
        return "BK001";
    }
}

// Check if transaction ID exists
async function isTxnIdUsed(txnId) {
    const bookingsRef = collection(db, "form-fill");
    const q = query(bookingsRef, where("payment_code", "==", txnId));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
}

// Show QR code after form fill
hiringForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("Login required.");
        return;
    }

    const paymentMethod = document.getElementById("payment_method").value;
    if (!paymentMethod) {
        alert("Select a payment method first.");
        return;
    }

    // Temporarily store form data
    window.tempBookingData = {
        name: document.getElementById("name").value.trim(),
        contact: document.getElementById("contact").value.trim(),
        address: document.getElementById("address").value.trim(),
        gender: document.getElementById("gender").value,
        email: user.email,
        service: document.getElementById("service").value,
        shift_from: document.getElementById("shift_from").value || "Not Provided",
        shift_to: document.getElementById("shift_to").value || "Not Provided",
        start_date: document.getElementById("start_date").value || "Not Provided",
        notes: document.getElementById("notes").value.trim() || "No additional notes",
        payment_method: paymentMethod
    };

    // Show QR Code
    qrContainer.style.display = "block";
    qrCodeDiv.innerHTML = "";
    const upiLink = `upi://pay?pa=test@upi&pn=HouseMaid&am=500&cu=INR&tn=Booking-${Date.now()}`;
    new QRCode(qrCodeDiv, {
        text: upiLink,
        width: 200,
        height: 200
    });

    alert("Scan the QR code and enter your Transaction ID.");
});

// Confirm payment
confirmPaymentBtn.addEventListener("click", async () => {
    const txnId = txnIdInput.value.trim();
    if (!txnId) {
        alert("Enter transaction ID.");
        return;
    }

    if (await isTxnIdUsed(txnId)) {
        alert("This Transaction ID has already been used. Please enter a valid one.");
        return;
    }

    try {
        const newBookingID = await getNextBookingID();
        const user = auth.currentUser;

        const bookingData = {
            bookingID: newBookingID,
            userId: user.uid,
            ...window.tempBookingData,
            payment_code: txnId,
            timestamp: new Date(),
            status: "Pending Verification"
        };

        await setDoc(doc(db, "form-fill", newBookingID), bookingData);

        alert(`Booking submitted! ID: ${newBookingID}`);
        hiringForm.reset();
        txnIdInput.value = "";
        qrContainer.style.display = "none";
    } catch (error) {
        console.error("Error saving booking:", error);
        alert("Failed to save booking.");
    }
});

