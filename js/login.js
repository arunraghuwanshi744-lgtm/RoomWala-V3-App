import { auth } from "./firebase-config.js";
import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    loginMessage.innerHTML = "";

    try {

        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        loginMessage.innerHTML =
            `<div class="alert alert-success">
                Login Successful...
            </div>`;

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {

        loginMessage.innerHTML =
            `<div class="alert alert-danger">
                ${error.message}
            </div>`;

    }

    loginBtn.disabled = false;
    loginBtn.textContent = "Login";

});