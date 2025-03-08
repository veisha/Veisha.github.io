// game.js
import { renderCharacter, updatePosition, savePosition, restorePosition } from './character.js';
import { applyGravity, jump, checkCollision } from './physics.js';
import { platforms, renderPlatforms } from './environment.js';

let lastTime = Date.now();
let gameLoopId = null;
let fps = 0;
let frameCount = 0;
let fpsLastUpdated = Date.now();

// Game loop
function gameLoop() {
    const currentTime = Date.now();
    let deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds

    // Clamp deltaTime to prevent extremely large values
    if (deltaTime > 0.1) deltaTime = 0.1; // Limit deltaTime to 100ms (10 FPS)

    lastTime = currentTime;

    applyGravity(deltaTime); // Apply gravity
    checkCollision(platforms); // Check for collisions
    updatePosition(deltaTime); // Update character position
    renderPlatforms(); // Render platforms

    // Update FPS counter
    frameCount++;
    if (currentTime - fpsLastUpdated >= 1000) { // Update FPS every second
        fps = frameCount;
        frameCount = 0;
        fpsLastUpdated = currentTime;
        document.getElementById("fps-display").textContent = `FPS: ${fps}`; // Update FPS display
    }

    gameLoopId = setTimeout(gameLoop, 16); // Run the game loop at ~60 FPS (16ms per frame)
}

// Start the game loop
gameLoop();

// Pause/resume game when tab visibility changes
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // Tab is hidden, pause the game
        clearTimeout(gameLoopId);
        savePosition(); // Save the character's position
    } else {
        // Tab is visible, resume the game
        lastTime = Date.now(); // Reset lastTime to avoid large deltaTime
        restorePosition(); // Restore the character's position
        gameLoop();
    }
});

// Initial Render
renderCharacter();
renderPlatforms();