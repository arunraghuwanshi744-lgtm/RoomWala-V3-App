document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("navbar", "navbar.html");
    await loadComponent("footer", "footer.html");
});

async function loadComponent(elementId, fileName) {
    const element = document.getElementById(elementId);

    if (!element) return;

    try {
        const response = await fetch(fileName);

        if (!response.ok) {
            throw new Error(`Failed to load ${fileName}`);
        }

        element.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
        element.innerHTML = `
            <div class="text-center text-danger py-3">
                Failed to load ${fileName}
            </div>
        `;
    }
}