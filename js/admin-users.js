import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


let usersData = [];


// Load Users

async function loadUsers() {

    const usersTable = document.getElementById("usersList");

    try {

        const usersSnap = await getDocs(
            collection(db,"users")
        );


        usersData = [];


        usersSnap.forEach((userDoc)=>{

            usersData.push({

                id:userDoc.id,
                ...userDoc.data()

            });

        });


        displayUsers(usersData);


    } catch(error){

        console.error("Users Load Error:",error);

    }

}



// Display Users

function displayUsers(users){


    const usersTable =
    document.getElementById("usersList");


    usersTable.innerHTML="";


    if(users.length===0){

        usersTable.innerHTML=`

        <tr>

        <td colspan="5" class="text-center">

        No Users Found

        </td>

        </tr>

        `;

        return;

    }



    users.forEach((user)=>{


        usersTable.innerHTML += `


        <tr>

        <td>${user.name || "No Name"}</td>

        <td>${user.email || "No Email"}</td>

        <td>${user.phone || "No Phone"}</td>


        <td>

        <select 
        class="form-select form-select-sm"
        onchange="changeRole('${user.id}',this.value)">

        <option ${user.role==="customer"?"selected":""}>
        customer
        </option>

        <option ${user.role==="owner"?"selected":""}>
        owner
        </option>

        <option ${user.role==="admin"?"selected":""}>
        admin
        </option>

        </select>

        </td>


        <td>

        <button
        class="btn btn-sm ${user.status==="blocked"?"btn-success":"btn-danger"}"
        onclick="toggleUser('${user.id}','${user.status}')">

        ${user.status==="blocked"?"Unblock":"Block"}

        </button>


        </td>


        </tr>


        `;


    });


}




// Search User

document
.getElementById("searchUser")
?.addEventListener("input",(e)=>{


    const value =
    e.target.value.toLowerCase();



    const filtered =
    usersData.filter((user)=>{


        return (

        (user.name || "")
        .toLowerCase()
        .includes(value)

        ||

        (user.email || "")
        .toLowerCase()
        .includes(value)

        );


    });



    displayUsers(filtered);



});





// Change Role

window.changeRole = async function(userId,role){


    try{


        await updateDoc(

            doc(db,"users",userId),

            {
                role:role
            }

        );


        alert("Role Updated ✅");


    }catch(error){

        console.error(error);

    }


};





// Block / Unblock

window.toggleUser = async function(userId,status){


    try{


        await updateDoc(

            doc(db,"users",userId),

            {

            status:
            status==="blocked"
            ?
            "active"
            :
            "blocked"

            }

        );


        alert("User Status Updated");


        loadUsers();



    }catch(error){

        console.error(error);

    }


};



loadUsers();