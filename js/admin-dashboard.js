import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ==========================
// Dashboard Live Stats
// ==========================

async function loadDashboardStats() {

    try {

        // Total Users
        const usersSnap = await getDocs(collection(db, "users"));
        document.getElementById("totalUsers").textContent = usersSnap.size;

        // Total Rooms
        const roomsSnap = await getDocs(collection(db, "rooms"));
        document.getElementById("totalRooms").textContent = roomsSnap.size;

        // Pending Rooms
        const pendingQuery = query(
            collection(db, "rooms"),
            where("status", "==", "pending")
        );

        const pendingSnap = await getDocs(pendingQuery);

        document.getElementById("pendingRooms").textContent =
            pendingSnap.size;

    } catch (error) {

        console.error("Admin Dashboard Error:", error);

    }

}

loadDashboardStats();