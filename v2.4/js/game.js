// ✅ Global Variables
const characterContainer = document.getElementById("character-container");

let lastTime = 0; // Track the last frame time

// ✅ Game Loop using requestAnimationFrame
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;

    updatePosition(deltaTime); // Pass deltaTime to updatePosition
    requestAnimationFrame(gameLoop); // Continuously call the game loop
}

// ✅ Start the game loop
requestAnimationFrame(gameLoop);

// ✅ Initial Render
renderCharacter();
renderEquipment();