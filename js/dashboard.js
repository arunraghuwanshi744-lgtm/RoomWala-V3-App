import { getCurrentUser } from "./auth.js";
import { db } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const user = await getCurrentUser();

console.log("Dashboard User:", user);


if (!user) {
    window.location.href = "login.html";
    throw new Error("User not logged in.");
}


// =========================
// User Information
// =========================

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userRole = document.getElementById("userRole");


if (userName) {
    userName.textContent = user.name || "User";
}


if (userEmail) {
    userEmail.textContent = user.email || "-";
}


if (userRole) {

    userRole.textContent =
        user.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : "Customer";

}


// =========================
// Role Panels
// =========================

if (user.role === "customer") {

    document
        .getElementById("customerPanel")
        ?.classList.remove("d-none");

}


if (user.role === "owner") {

    document
        .getElementById("ownerPanel")
        ?.classList.remove("d-none");

}


if (user.role === "admin") {

    document
        .getElementById("adminPanel")
        ?.classList.remove("d-none");

}


// =========================
// Dashboard Stats
// =========================

loadDashboardStats(user);


async function loadDashboardStats(currentUser) {

    try {


        const totalRooms =
            document.getElementById("totalRooms");


        let roomsSnapshot;


        if (currentUser.role === "admin") {


            roomsSnapshot =
                await getDocs(
                    collection(db, "rooms")
                );


        }


        else if (currentUser.role === "owner") {


            const roomsQuery =
                query(
                    collection(db, "rooms"),
                    where(
                        "ownerId",
                        "==",
                        currentUser.uid
                    )
                );


            roomsSnapshot =
                await getDocs(roomsQuery);


        }


        else {


            roomsSnapshot = {
                size: 0
            };


        }


        if (totalRooms) {

            totalRooms.textContent =
                roomsSnapshot.size;

        }



        document.getElementById("totalViews").textContent = "0";
        document.getElementById("totalFavorites").textContent = "0";
        document.getElementById("totalRequests").textContent = "0";


    }


    catch(error) {

        console.error(
            "Dashboard Stats Error:",
            error
        );

    }

}
import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            alert("Logout successful");
            window.location.replace("splash.html");
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed");
        }
    });
}
