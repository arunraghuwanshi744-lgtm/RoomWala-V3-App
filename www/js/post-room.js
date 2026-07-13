import { auth, db } from "./firebase-config.js";

import { 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ===============================
// DOM ELEMENTS
// ===============================

const form = document.getElementById("roomForm");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const editNotice = document.getElementById("editNotice");

const imageFile = document.getElementById("imageFile");

const previewSection = document.getElementById("previewSection");
const imagePreview = document.getElementById("imagePreview");

const progressSection = document.getElementById("progressSection");
const uploadProgress = document.getElementById("uploadProgress");

const uploadStatus = document.getElementById("uploadStatus");
const phone = document.getElementById("phone");

// ===============================
// CLOUDINARY CONFIG
// ===============================

const CLOUDINARY_CLOUD_NAME = "eut2tjiw";
const CLOUDINARY_UPLOAD_PRESET = "roomwala";


// ===============================
// VARIABLES
// ===============================

let currentUser = null;

let editMode = false;

let oldImageUrl = "";

let selectedImageFile = null;


const params = new URLSearchParams(window.location.search);

const roomId = params.get("id");


// ===============================
// AUTH CHECK
// ===============================

onAuthStateChanged(auth, async (user)=>{

    if(!user){

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }


    currentUser = user;


    if(roomId){

        await loadRoom(roomId);

    }

});


// ===============================
// IMAGE VALIDATION
// ===============================

function validateImage(file){


    const allowedTypes = [

        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"

    ];


    if(!allowedTypes.includes(file.type)){

        alert(
            "Only JPG, JPEG, PNG and WEBP images are allowed."
        );

        return false;

    }


    const maxSize = 2 * 1024 * 1024;


    if(file.size > maxSize){

        alert(
            "Image size must be less than const maxSize = 5 * 1024 * 1024; "
        );

        return false;

    }


    return true;

}


// ===============================
// IMAGE PREVIEW
// ===============================

imageFile.addEventListener(
"change",
()=>{


    const file = imageFile.files[0];


    if(!file){

        return;

    }


    if(!validateImage(file)){

        imageFile.value="";

        return;

    }


    selectedImageFile = file;


    const reader = new FileReader();


    reader.onload = function(e){


        imagePreview.src = e.target.result;


        previewSection.classList.remove("d-none");


    };


    reader.readAsDataURL(file);


});
// ===============================
// CLOUDINARY UPLOAD FUNCTION
// ===============================

function uploadToCloudinary(file){


    return new Promise((resolve,reject)=>{


        const url = 
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


        const formData = new FormData();


        formData.append(
            "file",
            file
        );


        formData.append(
            "upload_preset",
            CLOUDINARY_UPLOAD_PRESET
        );


        const xhr = new XMLHttpRequest();


        xhr.open(
            "POST",
            url
        );



        xhr.upload.addEventListener(
            "progress",
            (event)=>{


                if(event.lengthComputable){


                    const percent = Math.round(
                        (event.loaded / event.total) * 100
                    );


                    progressSection.classList.remove("d-none");


                    uploadProgress.style.width =
                    percent + "%";


                    uploadProgress.textContent =
                    percent + "%";


                }


            }
        );



        xhr.onload = ()=>{


            if(xhr.status === 200){


    const response = JSON.parse(
        xhr.responseText
    );


    const optimizedUrl =
    response.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_1000/"
    );


    resolve(
        optimizedUrl
    );


            }
            else{


                reject(
                    "Cloudinary upload failed."
                );


            }


        };



        xhr.onerror = ()=>{


            reject(
                "Network error during upload."
            );


        };


        xhr.send(formData);


    });


}





// ===============================
// UPLOAD STATUS
// ===============================

function showStatus(message,type="info"){


    uploadStatus.className =
    `alert alert-${type}`;


    uploadStatus.textContent =
    message;


    uploadStatus.classList.remove(
        "d-none"
    );

}





// ===============================
// LOAD ROOM FOR EDIT
// ===============================

async function loadRoom(id){


    try{


        const roomRef =
        doc(
            db,
            "rooms",
            id
        );


        const roomSnap =
        await getDoc(roomRef);



        if(!roomSnap.exists()){


            alert(
                "Room not found."
            );


            window.location.href =
            "my-rooms.html";


            return;


        }



        const room =
        roomSnap.data();



        if(room.ownerId !== currentUser.uid){


            alert(
                "Unauthorized access."
            );


            window.location.href =
            "my-rooms.html";


            return;


        }




        editMode = true;


        oldImageUrl =
        room.image || "";



        formTitle.textContent =
        "Edit Room";


        submitBtn.textContent =
        "Save Changes";


        editNotice.classList.remove(
            "d-none"
        );



        document.getElementById("title").value =
        room.title || "";



        document.getElementById("city").value =
        room.city || "";



        document.getElementById("rent").value =
        room.rent || "";



        document.getElementById("category").value =
        room.category || "";



        document.getElementById("description").value =
        room.description || "";
      document.getElementById("phone").value =
room.phone || "";
      if (room.facilities) {

    room.facilities.forEach((facility) => {

        const checkbox = document.querySelector(
            `.facility[value="${facility}"]`
        );

        if (checkbox) {
            checkbox.checked = true;
        }

    });

      }




        if(oldImageUrl){


            imagePreview.src =
            oldImageUrl;


            previewSection.classList.remove(
                "d-none"
            );


        }



    }
    catch(error){


        console.error(error);


        alert(
            error.message
        );


    }


}
// ===============================
// FORM SUBMIT & SAVE TO FIREBASE
// ===============================

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const city = document.getElementById("city").value.trim();
    const rent = Number(document.getElementById("rent").value);
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const facilities = [];

document.querySelectorAll(".facility:checked").forEach((item) => {
    facilities.push(item.value);
});

    if (!title || !city || !category || !description) {
        alert("Please fill all required fields.");
        return;
    }

    if (rent <= 0) {
        alert("Enter a valid rent.");
        return;
    }
if (!/^[6-9]\d{9}$/.test(phone)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
}
    if (!editMode && !selectedImageFile) {
        alert("Please select an image for the room.");
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Please wait...";

        let imageUrl = oldImageUrl;

        // ===============================
        // CLOUDINARY IMAGE UPLOAD
        // ===============================
        if (selectedImageFile) {
            showStatus("Uploading image...", "info");
            imageUrl = await uploadToCloudinary(selectedImageFile);
            showStatus("Image uploaded successfully.", "success");
        }

        // ===============================
        // FIREBASE DATA STRUCTURE
        // ===============================
        const roomData = {
    title,
    city,
    rent,
    category,
    description,
     phone,
    facilities,
    image: imageUrl,
    updatedAt: serverTimestamp()
};


if (!editMode) {
    roomData.ownerId = currentUser.uid;
}
        // ===============================
        // SAVE OR UPDATE IN FIRESTORE
        // ===============================
        if (editMode) {
            // रूम को अपडेट करने के लिए
            const roomRef = doc(db, "rooms", roomId);
            await updateDoc(roomRef, roomData);
            alert("Room updated successfully!");
        } else {
            // नया रूम डेटाबेस में डालने के लिए
            roomData.featured = false;
            roomData.status = "active";
      roomData.createdAt = serverTimestamp();

          
            await addDoc(collection(db, "rooms"), roomData);
            alert("Room posted successfully!");
            form.reset();
          selectedImageFile = null;

oldImageUrl = "";

previewSection.classList.add("d-none");

imagePreview.src = "";

progressSection.classList.add("d-none");

uploadProgress.style.width = "0%";

uploadProgress.textContent = "0%";

uploadStatus.classList.add("d-none");
        }

        // सफलता के बाद दूसरे पेज पर भेजें
        window.location.href = "my-rooms.html";

    } catch (error) {
        console.error("Error saving room:", error);
alert("Something went wrong. Please try again.");
console.error(error);
      
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = editMode ? "Save Changes" : "Post Room";
    }
});
