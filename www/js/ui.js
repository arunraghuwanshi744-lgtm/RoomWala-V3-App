// ==========================================
// RoomWala V3
// UI Component Loader
// Version: 3.3.0
// ==========================================


async function loadComponent(selector, file){


    const element = document.querySelector(selector);


    if(!element){

        return;

    }


    try{


        const response = await fetch(file);


        const html = await response.text();


        element.innerHTML = html;


    }
    catch(error){


        console.error(
            "Component Load Error:",
            error
        );


    }


}



// Load Navbar

document.addEventListener(
"DOMContentLoaded",
()=>{


    loadComponent(
        "#navbar",
        "components/navbar.html"
    );


});