// game.js
import { renderCharacter, updatePosition } from './character.js';
import { applyGravity, jump, checkCollision } from './physics.js';
import { platforms, renderPlatforms } from './environment.js';

let lastTime = 0;

// Game loop
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;

    applyGravity(deltaTime);
    checkCollision(platforms);
    updatePosition(deltaTime);
    renderPlatforms();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

// Initial Render
renderCharacter();
renderPlatforms();