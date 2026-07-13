import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("User data not found");
            window.location.href = "index.html";
            return;
        }

        const userData = userSnap.data();

        if (userData.role !== "admin") {
            alert("Access Denied - Admin Only");
            window.location.href = "index.html";
            return;
        }

        // Admin Verified
        document.getElementById("adminContent").style.display = "block";

        console.log("✅ Admin Verified:", userData.email);

    } catch (error) {

        console.error("Admin Check Error:", error);
        alert("Something went wrong.");

        window.location.href = "index.html";
    }

});