/* ===================================
   ROOMWALA V3
   SCRIPT PART 1
=================================== */

let rooms = [
{
title:"1 BHK Room",
city:"Seoni",
rent:"3500",
phone:"9876543210",
image:"images/room1.jpg"
},
{
title:"PG For Boys",
city:"Bhopal",
rent:"4500",
phone:"9876500000",
image:"images/room2.jpg"
},
{
title:"2 BHK Flat",
city:"Nagpur",
rent:"8000",
phone:"9876511111",
image:"images/room3.jpg"
}
];

displayRooms(rooms);

function displayRooms(data){

let html="";

data.forEach(room=>{

html+=`

<div class="col-lg-4 col-md-6 mb-4">

<div class="card shadow">

<img src="${room.image}" class="card-img-top">

<div class="card-body">

<h5>${room.title}</h5>

<p>📍 ${room.city}</p>

<h4 class="text-primary">

₹${room.rent}/Month

</h4>

<a href="tel:${room.phone}"

class="btn btn-success w-100">

Contact Owner

</a>

</div>

</div>

</div>

`;

});

document.getElementById("roomList").innerHTML=html;

}
/* ===================================
   ROOMWALA V3
   SCRIPT PART 2
=================================== */

// Search Room
const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
    searchBtn.addEventListener("click", searchRoom);
}

function searchRoom() {

    let city = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    if(city===""){
        displayRooms(rooms);
        return;
    }

    let result = rooms.filter(room =>
        room.city.toLowerCase().includes(city)
    );

    displayRooms(result);

}


// Post Room
function postRoom(){

    let owner=document.getElementById("owner").value.trim();
    let city=document.getElementById("city").value.trim();
    let rent=document.getElementById("rent").value.trim();

    if(owner==="" || city==="" || rent===""){

        alert("Please fill all fields");

        return;

    }

    let newRoom={

        title:"New Room",

        city:city,

        rent:rent,

        phone:"9999999999",

        image:"images/room1.jpg"

    };

    rooms.unshift(newRoom);

    displayRooms(rooms);

    document.getElementById("owner").value="";
    document.getElementById("city").value="";
    document.getElementById("rent").value="";

    alert("Room Posted Successfully");

}
/* ===================================
   ROOMWALA V3
   SCRIPT PART 3
=================================== */

// Save Rooms
function saveRooms() {
    localStorage.setItem("roomwalaRooms", JSON.stringify(rooms));
}

// Load Rooms
function loadRooms() {
    let saved = localStorage.getItem("roomwalaRooms");

    if (saved) {
        rooms = JSON.parse(saved);
    }

    displayRooms(rooms);
}

// Existing postRoom ko upgrade karo:
// postRoom() ke andar rooms.unshift(newRoom);
// ke turant baad ye line add karna:
//
// saveRooms();


// Existing displayRooms() ko replace karo:

function displayRooms(data){

let html="";

data.forEach((room,index)=>{

html+=`

<div class="col-lg-4 col-md-6 mb-4">

<div class="card shadow">

<img src="${room.image}" class="card-img-top" alt="Room">

<div class="card-body">

<h5>${room.title}</h5>

<p>📍 ${room.city}</p>

<h4 class="text-primary">
₹${room.rent}/Month
</h4>

<a href="tel:${room.phone}" class="btn btn-success w-100 mb-2">
Contact Owner
</a>

<button
class="btn btn-danger w-100"
onclick="deleteRoom(${index})">

Delete

</button>

</div>

</div>

</div>

`;

});

document.getElementById("roomList").innerHTML = html;

}

// Delete Room

function deleteRoom(index){

if(confirm("Delete this room?")){

rooms.splice(index,1);

saveRooms();

displayRooms(rooms);

}

}

// Load saved rooms on startup
loadRooms();