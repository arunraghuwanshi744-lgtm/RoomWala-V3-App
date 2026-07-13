// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCdfJ3UHnjLxOGon-_GeXkibwEQm_W3nsg",
  authDomain: "roomwala-4c89b.firebaseapp.com",
  projectId: "roomwala-4c89b",
  storageBucket: "roomwala-4c89b.firebasestorage.app",
  messagingSenderId: "641957600090",
  appId: "1:641957600090:web:5d17342a4ddd5c97807163"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export
export {
  app,
  auth,
  db,
  storage
};