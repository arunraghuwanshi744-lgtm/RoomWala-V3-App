document.addEventListener("DOMContentLoaded", async () => {

    const navbar = document.getElementById("navbar");
    const footer = document.getElementById("footer");

    if (navbar) {
        const res = await fetch("navbar.html");
        navbar.innerHTML = await res.text();
    }

    if (footer) {
        const res = await fetch("footer.html");
        footer.innerHTML = await res.text();
    }

});