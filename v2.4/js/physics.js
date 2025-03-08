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
        if (posX + 50 > platform.x + 35 && // Check if the character's right edge is to the right of the platform's left edge
            posX < platform.x + platform.width + 15 && // Check if the character's left edge is to the left of the platform's right edge
            posY + 50 > platform.y && // Check if the character's bottom edge is below the platform's top edge
            posY < platform.y + platform.height) { // Check if the character's top edge is above the platform's bottom edge
            if (velocityY > 0) { // Falling
                setPosY(platform.y - 35); // Adjust 50 to the height of your character
                velocityY = 0;
                onPlatform = true;
            }
        }
    });
    isOnGround = onPlatform; // Update isOnGround based on collision
}

export { applyGravity, checkCollision, isOnGround };