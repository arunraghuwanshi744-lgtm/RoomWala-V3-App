import { getCurrentUser } from "./auth.js";
import { db } from "./firebase-config.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const user = await getCurrentUser();

if (!user) {
    window.location.href = "login.html";
    throw new Error("User not logged in.");
}


// =====================
// Elements
// =====================

const form = document.getElementById("editProfileForm");

const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const role = document.getElementById("role");


// =====================
// Load User
// =====================

name.value = user.name || "";
email.value = user.email || "";
phone.value = user.phone || "";
role.value = user.role || "customer";


// =====================
// Save Profile
// =====================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const newName = name.value.trim();
    const newPhone = phone.value.trim();

    if (newName.length < 2) {
        alert("Please enter a valid name.");
        return;
    }

    if (
        newPhone &&
        !/^[6-9]\d{9}$/.test(newPhone)
    ) {
        alert("Enter a valid 10-digit mobile number.");
        return;
    }

    try {

        await updateDoc(
            doc(db, "users", user.uid),
            {
                name: newName,
                phone: newPhone
            }
        );

        alert("Profile updated successfully.");

        window.location.href = "profile.html";

    }

    catch (error) {

        console.error(error);

        alert("Failed to update profile.");

    }

});