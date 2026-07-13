import { getCurrentUser } from "./auth.js";
import { auth } from "./firebase-config.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const user = await getCurrentUser();

if (!user) {
    window.location.href = "login.html";
    throw new Error("User not logged in.");
}


// ===========================
// Elements
// ===========================

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileRole = document.getElementById("profileRole");
const profileJoined = document.getElementById("profileJoined");
const profilePhoto = document.getElementById("profilePhoto");
const logoutBtn = document.getElementById("logoutBtn");


// ===========================
// Profile Information
// ===========================

profileName.textContent = user.name || "User";

profileEmail.textContent = user.email || "-";

profilePhone.textContent =
    user.phone ||
    user.mobile ||
    "Not Added";

profileRole.textContent =
    user.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "Customer";


// ===========================
// Profile Avatar
// ===========================

const avatarName = encodeURIComponent(
    user.name || "User"
);

profilePhoto.src =
`https://ui-avatars.com/api/?name=${avatarName}&background=0D6EFD&color=fff&size=200`;


// ===========================
// Join Date
// ===========================

if (user.createdAt?.toDate) {

    profileJoined.textContent =
        user.createdAt
            .toDate()
            .toLocaleDateString();

}
else {

    profileJoined.textContent = "-";

}


// ===========================
// Logout
// ===========================

logoutBtn.addEventListener(
    "click",
    async () => {

        if (!confirm("Logout from RoomWala?"))
            return;

        try {

            await signOut(auth);

            window.location.href = "login.html";

        }

        catch (error) {

            console.error(error);

            alert("Logout failed.");

        }

    }
);