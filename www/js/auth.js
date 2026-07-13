import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


export async function getCurrentUser() {

  return new Promise((resolve) => {


    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {

        unsubscribe();


        if (!user) {

          resolve(null);
          return;

        }


        try {


          const userRef =
          doc(
            db,
            "users",
            user.uid
          );


          const snap =
          await getDoc(userRef);



          if (!snap.exists()) {

            resolve(null);
            return;

          }



          resolve({

            uid: user.uid,
            ...snap.data()

          });



        } catch(error) {


          console.error(
            "User Load Error:",
            error
          );


          resolve(null);


        }


      }
    );


  });

}