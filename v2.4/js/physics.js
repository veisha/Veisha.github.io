// physics.js
import { posX, posY, setPosY } from './character.js';

const gravity = 500; // Gravity strength
const jumpStrength = 300; // Jump strength
let velocityY = 0; // Vertical velocity
let isOnGround = false; // Track if the character is on the ground

// Apply gravity
function applyGravity(deltaTime) {
    velocityY += gravity * deltaTime;
    setPosY(posY + velocityY * deltaTime); // Update posY using the setter function
}

// Jump function
export function jump() {
    if (isOnGround) {
        velocityY = -jumpStrength;
        isOnGround = false;
    }
}

// Check for collisions with platforms
function checkCollision(platforms) {
    let onPlatform = false;
    platforms.forEach(platform => {
        if (posX < platform.x + platform.width &&
            posX + 50 > platform.x &&
            posY < platform.y + platform.height &&
            posY + 50 > platform.y) {
            if (velocityY > 0) { // Falling
                setPosY(platform.y - 50); // Adjust 50 to the height of your character
                velocityY = 0;
                onPlatform = true;
            }
        }
    });
    isOnGround = onPlatform || posY >= window.innerHeight - 50;
}

export { applyGravity, checkCollision, isOnGround };