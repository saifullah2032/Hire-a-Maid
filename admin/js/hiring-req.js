       // Import Firebase Firestore modules
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

        async function fetchHiringRequests() {
            const querySnapshot = await getDocs(collection(db, "form-fill"));
            let totalRequests = 0, assignedRequests = 0, newRequests = 0, canceledRequests = 0;

            querySnapshot.forEach((doc) => {
                totalRequests++;
                const status = doc.data().status.toLowerCase();
                if (status === "pending") newRequests++;
                else if (status === "assigned") assignedRequests++;
                else if (status.toLowerCase() === "cancelled" ) canceledRequests++;
            });

            document.getElementById("totalRequests").textContent = totalRequests;
            document.getElementById("assignedRequests").textContent = assignedRequests;
            document.getElementById("newRequests").textContent = newRequests;
            document.getElementById("canceledRequests").textContent = canceledRequests;
        }

        window.onload = fetchHiringRequests;