// ==========================================
// RoomWala V3
// API Layer
// Version: 3.1.0
// ==========================================

const RoomAPI = (() => {

    const rooms = [

        {
            id: 1,
            title: "Single Room",
            city: "Nagpur",
            location: "Medical Square",
            price: 5500,
            image: "assets/images/room1.jpg"
        },

        {
            id: 2,
            title: "PG Room",
            city: "Bhopal",
            location: "MP Nagar",
            price: 4200,
            image: "assets/images/room2.jpg"
        },

        {
            id: 3,
            title: "2BHK Flat",
            city: "Indore",
            location: "Vijay Nagar",
            price: 9000,
            image: "assets/images/room3.jpg"
        }

    ];


    async function getRooms(){

        return [...rooms];

    }


    async function getRoomById(id){

        return rooms.find(
            room => room.id === Number(id)
        ) || null;

    }


    return {

        getRooms,
        getRoomById

    };


})();