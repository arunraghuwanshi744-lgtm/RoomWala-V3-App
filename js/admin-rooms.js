import { getCurrentUser } from "./auth.js";
import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


let roomsData = [];
const user = await getCurrentUser();

if (!user) {
    window.location.href = "login.html";
    throw new Error("Login required.");
}

if (user.role !== "admin") {
    alert("Access Denied.");
    window.location.href = "dashboard.html";
    throw new Error("Unauthorized");
}

// Load Rooms

async function loadRooms() {

    const roomsList = document.getElementById("roomsList");

    try {

        const roomsSnap = await getDocs(
            collection(db, "rooms")
        );


        roomsData = [];

        roomsSnap.forEach((roomDoc)=>{

            roomsData.push({
                id: roomDoc.id,
                ...roomDoc.data()
            });

        });


        displayRooms(roomsData);


    } catch(error){

        console.error(error);

    }

}


// Display Rooms

function displayRooms(rooms){

    const roomsList = document.getElementById("roomsList");

    roomsList.innerHTML = "";


    if(rooms.length === 0){

        roomsList.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                No Rooms Found
            </td>
        </tr>
        `;

        return;
    }



    rooms.forEach((room)=>{


        roomsList.innerHTML += `

        <tr>

        <td>${room.title || "No Title"}</td>

        <td>${room.city || "No City"}</td>

        <td>₹${room.rent || 0}</td>

        <td>${room.ownerEmail || room.ownerId || "-"}</td>

        <td>${room.status || "pending"}</td>


        <td>


        <button
        class="btn btn-success btn-sm me-1"
        onclick="approveRoom('${room.id}')">
        Approve
        </button>


        <button
        class="btn btn-warning btn-sm me-1"
        onclick="rejectRoom('${room.id}')">
        Reject
        </button>


        <button
        class="btn btn-danger btn-sm"
        onclick="deleteRoom('${room.id}')">
        Delete
        </button>


        </td>


        </tr>

        `;


    });


}



// Search Room

document
.getElementById("searchRoom")
?.addEventListener("input",(e)=>{


    const value = e.target.value.toLowerCase();


    const filtered = roomsData.filter((room)=>{

        return (

            (room.title || "")
            .toLowerCase()
            .includes(value)

            ||

          (room.city || "")
            .toLowerCase()
            .includes(value)

        );

    });


    displayRooms(filtered);


});



// Approve
window.approveRoom = async function (roomId) {

    try {

        await updateDoc(
            doc(db, "rooms", roomId),
            {
                status: "approved"
            }
        );

        alert("Room Approved ✅");

        loadRooms();

    } catch (error) {

        console.error(error);

        alert("Failed to approve room.");

    }

};



// Reject

window.rejectRoom = async function (roomId) {

    try {

        await updateDoc(
            doc(db, "rooms", roomId),
            {
                status: "rejected"
            }
        );

        alert("Room Rejected ❌");

        loadRooms();

    } catch (error) {

        console.error(error);

        alert("Failed to reject room.");

    }

};


    
        
      
            
      
    


    

    





// Delete Room

window.deleteRoom = async function(roomId){


    if(!confirm("Delete this room permanently?"))
    return;


    try{


        await deleteDoc(
            doc(db,"rooms",roomId)
        );


        alert("Room Deleted 🗑️");


        loadRooms();



    }catch(error){

        console.error(error);

        alert("Delete Failed");

    }


};



loadRooms();
