import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// URL se Room ID nikalna
const params = new URLSearchParams(window.location.search);

const roomId = params.get("id");

console.log("Room ID from URL:", roomId);

let cachedOwnerPhone = "";

async function loadRoomDetails() {
    console.log("loadRoomDetails() function started...");

    // Agar URL me ID nahi hai to user ko wapas list page par bhejein
        // अगर URL में Room ID नहीं है, तो बिना अलर्ट के सीधे लिस्ट पेज पर भेजें
    if (!roomId) {
        window.location.replace("room.html"); 
        return;
    }

    try {
        // Firebase se Data lana
        const roomRef = doc(db, "rooms", roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            // अगर डेटाबेस में रूम नहीं मिला, तब भी बिना अलर्ट के लिस्ट पेज पर भेजें
            window.location.replace("room.html");
            return;
        }

        const roomData = roomSnap.data();
        console.log("Firebase Room Data:", roomData);
        // Phone number save karna aur UI update karna
        cachedOwnerPhone = roomData.phone || "";

        displayRoomDetails(roomData);

        // Agar Owner ID maujood hai to uski details lana
        if (roomData.ownerId) {
            await loadOwnerDetails(roomData.ownerId);
        }

        setupContactButtons();

    } catch (error) {
        console.error("Firebase Fetch Error:", error);
        alert("Failed to load room details. Check console.");
    }
}

function displayRoomDetails(roomData) {
    document.getElementById("roomTitle").textContent = roomData.title || "No Title";
    document.getElementById("roomRent").textContent = `₹${Number(roomData.rent || 0)} / Month`;
    document.getElementById("roomImage").src = roomData.image || "assets/images/room1.jpg"; // Fallback image path sahi karein
    document.getElementById("roomDescription").textContent = roomData.description || "No Description";
    document.getElementById("roomLocation").textContent = roomData.city || "Not Available";
    document.getElementById("roomCategory").textContent = roomData.category || "Not Available";

    // Facilities List setup
    const list = document.getElementById("roomFacilities");
    if (!list) return;

    list.innerHTML = "";

    if (Array.isArray(roomData.facilities) && roomData.facilities.length > 0) {
        roomData.facilities.forEach(item => {
            const li = document.createElement("li");
            li.textContent = "✅ " + item;
            list.appendChild(li);
        });
    } else {
        list.innerHTML = "<li>No facilities available</li>";
    }
}

async function loadOwnerDetails(ownerId) {
    try {
        const userRef = doc(db, "users", ownerId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            document.getElementById("ownerName").textContent = userData.name || "Owner";
        } else {
            document.getElementById("ownerName").textContent = "Owner Not Found";
        }
    } catch (error) {
        console.error("Owner Load Error:", error);
    }
}
function setupContactButtons() {

    const callBtn = document.getElementById("callBtn");
    const whatsappBtn = document.getElementById("whatsappBtn");
    const ownerPhoneSpan = document.getElementById("ownerPhone");

    if (!cachedOwnerPhone) {

        if (ownerPhoneSpan) {
            ownerPhoneSpan.textContent = "Phone Number Not Available";
        }

        if (callBtn) callBtn.style.display = "none";
        if (whatsappBtn) whatsappBtn.style.display = "none";

        return;
    }

    const cleanPhone = String(cachedOwnerPhone).replace(/\D/g, "");

    if (ownerPhoneSpan) {
        ownerPhoneSpan.innerHTML =
            `<a href="tel:${cleanPhone}">${cachedOwnerPhone}</a>`;
    }

    if (callBtn) {
        callBtn.href = `tel:${cleanPhone}`;
    }

    if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/91${cleanPhone}`;
    }

}
// Function ko trigger karna
loadRoomDetails();