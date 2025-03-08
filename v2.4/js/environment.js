// environment.js
export const platforms = [
    { x: 100, y: 400, width: 200, height: 20 }, // Ground/platform at y = 400
    { x: 400, y: 300, width: 150, height: 20 }, // Another platform at y = 300
    { x: 700, y: 200, width: 200, height: 20 }  // Another platform at y = 200
];

// Render platforms
export function renderPlatforms() {
    const platformContainer = document.getElementById("platform-container");
    if (!platformContainer) {
        const container = document.createElement("div");
        container.id = "platform-container";
        document.body.appendChild(container);
    }

    platformContainer.innerHTML = "";

    platforms.forEach(platform => {
        const platformElement = document.createElement("div");
        platformElement.className = "platform";
        platformElement.style.left = `${platform.x}px`;
        platformElement.style.top = `${platform.y}px`;
        platformElement.style.width = `${platform.width}px`;
        platformElement.style.height = `${platform.height}px`;
        platformContainer.appendChild(platformElement);
    });
}