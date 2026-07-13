import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const roomList = document.getElementById("roomList");
const featuredRoomList = document.getElementById("featuredRoomList");
const roomCount = document.getElementById("roomCount");
const noResult = document.getElementById("noResult");

const searchInput = document.getElementById("searchInput");
const priceFilter = document.getElementById("priceFilter");

let allRooms = [];

if (roomList) {
    loadRooms();
}

async function loadRooms() {

    roomList.innerHTML = `
        <div class="text-center py-5">
            <h5>Loading Rooms...</h5>
        </div>
    `;

    try {

        const q = query(
            collection(db, "rooms"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        roomList.innerHTML = "";

allRooms = [];

if (snapshot.empty) {

    roomList.innerHTML = "";

    if (roomCount) roomCount.textContent = "0 Rooms";
    if (noResult) noResult.classList.remove("d-none");

    return;
}

snapshot.forEach((doc) => {

    allRooms.push({
        id: doc.id,
        ...doc.data()
    });

});


// Featured Rooms First ⭐

allRooms.sort((a, b) => {

    return (b.featured === true) - (a.featured === true);

});

renderRooms(allRooms);

    } catch (error) {

        console.error("Load Rooms Error:", error);

        roomList.innerHTML = `
            <div class="alert alert-danger">
                Failed to load rooms.
            </div>
        `;
    }
}
function filterRooms() {

    const search = (searchInput?.value || "").trim().toLowerCase();
const maxPrice = priceFilter?.value || "all";

    const filteredRooms = allRooms.filter((room) => {

        const title = (room.title || "").toLowerCase();
        const city = (room.city || "").toLowerCase();
        const rent = Number(room.rent) || 0;

        const searchMatch =
            title.includes(search) ||
            city.includes(search);

        const priceMatch =
            maxPrice === "all" ||
            rent <= Number(maxPrice);

        return searchMatch && priceMatch;
    });

    renderRooms(filteredRooms);
}

if (searchInput) {
    searchInput.addEventListener("input", filterRooms);
}

if (priceFilter) {
    priceFilter.addEventListener("change", filterRooms);
}
function createFeaturedRoomCard(id, room) {

    const image =
        typeof room.image === "string" && room.image.trim() !== ""
            ? room.image
            : "images/no-image.png";

    const title = room.title || "Untitled Room";
    const city = room.city || "Unknown";
    const category = room.category || "Room";
    const rent = Number(room.rent) || 0;

    const card = document.createElement("div");

    card.className = "col-lg-4 col-md-6 mb-4";

    card.innerHTML = `
        <div class="card h-100 shadow border-warning">

            <img
                src="${image}"
                class="card-img-top"
                style="height:220px;object-fit:cover;"
                alt="${title}"
                loading="lazy"
                decoding="async">

            <div class="card-body">

                <span class="badge bg-warning text-dark mb-2">
                    ⭐ Featured
                </span>

                <span class="badge bg-primary mb-2">
                    ${category}
                </span>

                <h5 class="card-title">
                    ${title}
                </h5>

                <p class="text-muted">
                    📍 ${city}
                </p>

                <h4 class="text-success">
                    ₹${rent}/month
                </h4>

                <a
                    href="room-details.html?id=${id}"
                    class="btn btn-primary w-100">
                    View Details
                </a>

            </div>

        </div>
    `;


    featuredRoomList.appendChild(card);

}
function createRoomCard(id, room) {

    const image =
        typeof room.image === "string" && room.image.trim() !== ""
            ? room.image
            : "images/no-image.png";

    const title = room.title || "Untitled Room";
    const city = room.city || "Unknown";
    const category = room.category || "Room";
    const rent = Number(room.rent) || 0;
    const description = room.description || "No description available.";

    const card = document.createElement("div");

    card.className = "col-lg-4 col-md-6 mb-4";

    card.innerHTML = `
        <div class="card h-100 shadow-sm">

            <img
                src="${image}"
                class="card-img-top"
                style="height:220px;object-fit:cover;"
                alt="${title}"
loading="lazy"
decoding="async">
            <div class="card-body">

                <span class="badge bg-primary mb-2">
                    ${category}
                </span>
                ${room.featured ? 
`
<span class="badge bg-warning text-dark mb-2">
⭐ Featured
</span>
`
: ""}

                <h5 class="card-title">
                    ${title}
                </h5>

                <p class="text-muted mb-2">
                    📍 ${city}
                </p>

                <h4 class="text-success mb-3">
                    ₹${rent}/month
                </h4>

                <p class="card-text">
              ${description.length > 80
    ? description.substring(0, 80) + "..."
    : description}
                </p>

                <a
                    href="room-details.html?id=${id}"
                    class="btn btn-primary w-100">
                    View Details
                </a>

            </div>

        </div>
    `;

    roomList.appendChild(card);
}
function renderRooms(rooms) {

    roomList.innerHTML = "";

    if (featuredRoomList) {
        featuredRoomList.innerHTML = "";
    }


    const featuredRooms =
        rooms.filter(room => room.featured === true);


    const normalRooms =
        rooms.filter(room => room.featured !== true);


    if (rooms.length === 0) {

        roomCount.textContent = "0 Rooms";
        noResult.classList.remove("d-none");

        return;
    }


    noResult.classList.add("d-none");


    roomCount.textContent =
        `${rooms.length} Rooms`;


    // Featured Rooms

    featuredRooms.forEach(room => {

        createFeaturedRoomCard(
            room.id,
            room
        );

    });


    // Normal Rooms

    normalRooms.forEach(room => {

        createRoomCard(
            room.id,
            room
        );

    });

}