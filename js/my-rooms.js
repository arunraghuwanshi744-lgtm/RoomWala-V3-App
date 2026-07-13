import { auth, db } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    doc,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const container = document.getElementById("myRoomsContainer");

if (!container) {
    throw new Error("myRoomsContainer not found.");
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadMyRooms(user.uid);
});

async function loadMyRooms(uid) {

    container.innerHTML = `
        <div class="text-center py-5">
            <h5>Loading...</h5>
        </div>
    `;

    try {

        const q = query(
            collection(db, "rooms"),
            where("ownerId", "==", uid),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h4>No Rooms Posted Yet</h4>
                    <p>Click "Post New Room" to add your first room.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        snapshot.forEach((roomDoc) => {

            const room = roomDoc.data();

            const image =
                typeof room.image === "string" && room.image.trim() !== ""
                    ? room.image
                    : "images/no-image.png";

            const title = room.title || "Untitled Room";
            const city = room.city || "Unknown";
            const category = room.category || "Room";
            const rent = room.rent || "0";

          const featuredBadge = room.featured
    ? `<span class="badge bg-warning text-dark ms-2">
        ⭐ Featured
       </span>`
    : "";

            container.insertAdjacentHTML("beforeend", `
                <div class="col-lg-4 mb-4">

                    <div class="card h-100 shadow-sm">

                      <img
    src="${image}"
    class="card-img-top"
    style="height:220px;object-fit:cover;"
    alt="${title}"
    onerror="this.src='images/no-image.png'">
                          

                        <div class="card-body">

                            <span class="badge bg-primary">
    ${category}
</span>

${featuredBadge}

                            <h5 class="mt-2">${title}</h5>

                            <p>📍 ${city}</p>

                            <h4 class="text-success">
                                ₹${rent}/month
                            </h4>

                            <div class="d-grid gap-2 mt-3">

                              <button
    class="btn btn-warning edit-room"
    data-id="${roomDoc.id}">
    Edit Room
</button>   

<button
    class="btn btn-info featured-room"
    data-id="${roomDoc.id}">
    ⭐ Make Featured
</button>
                                <button
                                    class="btn btn-danger delete-room"
                                    data-id="${roomDoc.id}">
                                    Delete Room
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            `);
        });

// Edit Button
document.querySelectorAll(".edit-room").forEach((button) => {

    button.addEventListener("click", () => {

        const roomId = button.dataset.id;

        window.location.href = `post-room.html?id=${roomId}`;

    });

});

      // Featured Button

document.querySelectorAll(".featured-room").forEach((button) => {

    button.addEventListener("click", async () => {

        const roomId = button.dataset.id;

        button.disabled = true;
        button.textContent = "Updating...";

        try {

            await updateDoc(
                doc(db, "rooms", roomId),
                {
                    featured: true
                }
            );

            alert("Room featured successfully ⭐");

            loadMyRooms(uid);

        } catch (error) {

            console.error(error);

            alert("Failed to feature room.");

            button.disabled = false;
            button.textContent = "⭐ Make Featured";

        }

    });

});

// Delete Button
document.querySelectorAll(".delete-room").forEach((button) => {

    button.addEventListener("click", async () => {

        const roomId = button.dataset.id;

        if (!confirm("Are you sure you want to delete this room?")) {
            return;
        }

        button.disabled = true;
        button.textContent = "Deleting...";

        try {

            await deleteDoc(doc(db, "rooms", roomId));

            alert("Room deleted successfully.");

            loadMyRooms(uid);

        } catch (error) {

            console.error(error);

            alert("Failed to delete room.");

            button.disabled = false;
            button.textContent = "Delete Room";
        }

    });

});


    } catch (error) {

        console.error(error);

alert("Failed to load rooms. Please try again.");

        container.innerHTML = `
            <div class="alert alert-danger">
                Failed to load rooms.
            </div>
        `;
    }
}