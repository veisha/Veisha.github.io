// character.js
import { Equipment, toggleEquipment } from './equipment.js';
import { jump } from './physics.js';

// Rest of your character.js code...
// character.js
export const characterContainer = document.getElementById("character-container");

if (!characterContainer) {
    console.error("characterContainer not found in the DOM!");
}

export const Characters = {
    Veisha: {
        expressions: {
            normal: "<.·.>",
            thinking: "<...>",
            questioning: "< ? >",
            alert: "< ! >"
        },
        body: {
            leftArm: "/",
            torso: "|",
            rightArm: "\\",
            leftLeg: "/",
            rightLeg: "\\"
        }
    }
};

// ✅ Default Character Setup
export let activeCharacter = "Veisha";
export let currentExpression = Characters[activeCharacter].expressions.normal;

// ✅ Character Movement and Position
export let posX = 150; // Use `let` instead of `const`
export let posY = 350; // Use `let` instead of `const`

// Setter function for posY
export function setPosY(value) {
    posY = value;
}
export const speed = 200; // Pixels per second (adjust as needed)
export let moving = { ArrowLeft: false, ArrowRight: false }; // Export moving
export let frameIndex = 0;
export let direction = 1; // 1 = right, -1 = left, export direction
export let expressionTimeout = null;

// ✅ Walking Frames for Legs (adds spacing)
export const legFramesRight = [
    { left: " ", right: " >\\" },
    { left: " ", right: " |\\" },
    { left: " ", right: "|>" }
];

export const legFramesLeft = [
    { left: "/< ", right: " " },
    { left: "/| ", right: " " },
    { left: "<| ", right: " " }
];

// ✅ Frame Animation Control
export const frameDelay = 0.1; // Time (in seconds) between frame updates
export let frameTimer = 0; // Tracks time since the last frame update

// ✅ Generates Character
export function renderCharacter() {
    if (!characterContainer.innerHTML) {
        // ✅ First-time setup: Only create elements once
        characterContainer.innerHTML = `
            <div id="head"></div>
            <div id="upper-body">
                <div id="left-arm"></div>
                <div id="torso"></div>
                <div id="right-arm"></div>
            </div>
            <div id="lower-body">
                <div id="left-leg"></div>
                <div>&nbsp;</div>  <!-- Space between legs -->
                <div id="right-leg"></div>
            </div>
        `;

        // ✅ Apply animation class ONCE
        document.getElementById("head").classList.add("idle");
    }

    // ✅ Update only the text (preserves animations)
    document.getElementById("head").textContent = currentExpression;
    document.getElementById("left-arm").textContent = Characters[activeCharacter].body.leftArm;
    document.getElementById("torso").textContent = Characters[activeCharacter].body.torso;

    // ✅ Update Right Arm (with or without equipment)
    if (Equipment.codingStaff.equipped) {
        document.getElementById("right-arm").textContent = "‾`∂"; // Combined arm and arm shaft
    } else {
        document.getElementById("right-arm").textContent = Characters[activeCharacter].body.rightArm;
    }

    document.getElementById("left-leg").textContent = Characters[activeCharacter].body.leftLeg;
    document.getElementById("right-leg").textContent = Characters[activeCharacter].body.rightLeg;
}

// ✅ Changes Expression with Timer
export function changeExpression(expression) {
    if (expressionTimeout) clearTimeout(expressionTimeout);
    
    currentExpression = Characters[activeCharacter].expressions[expression];
    renderCharacter();
    
    expressionTimeout = setTimeout(() => {
        currentExpression = Characters[activeCharacter].expressions.thinking;
        renderCharacter();

        setTimeout(() => {
            currentExpression = Characters[activeCharacter].expressions.normal;
            renderCharacter();
        }, 1000);
    }, 1000);
}

// ✅ Updates Character Position & Animation
export function updatePosition(deltaTime) {
    let moved = false;

    if (moving.ArrowLeft) { posX -= speed * deltaTime; direction = -1; moved = true; }
    if (moving.ArrowRight) { posX += speed * deltaTime; direction = 1; moved = true; }

    characterContainer.style.left = `${posX}px`;
    characterContainer.style.top = `${posY}px`;

    if (moved) {
        characterContainer.classList.add("walking");

        // ✅ Update frameTimer
        frameTimer += deltaTime;

        // ✅ Update leg frames only after frameDelay has passed
        if (frameTimer >= frameDelay) {
            frameTimer = 0; // Reset the timer

            // ✅ Use correct walking frames based on direction
            const frames = direction === 1 ? legFramesRight : legFramesLeft;
            Characters[activeCharacter].body.leftLeg = frames[frameIndex].left;
            Characters[activeCharacter].body.rightLeg = frames[frameIndex].right;
            frameIndex = (frameIndex + 1) % frames.length;
        }
    } else {
        characterContainer.classList.remove("walking");

        // ✅ Reset Legs to Default
        Characters[activeCharacter].body.leftLeg = "/";
        Characters[activeCharacter].body.rightLeg = "\\";
        frameIndex = 0;
        frameTimer = 0; // Reset the timer when not moving
    }

    renderCharacter();
}

// ✅ Handle Key Events
document.addEventListener("keydown", (event) => {
    if (event.key in moving) moving[event.key] = true;
    if (event.key === "q") changeExpression("questioning");
    if (event.key === "a") changeExpression("alert");
    if (event.key === "e") toggleEquipment("codingStaff"); // Toggle Coding Staff
    if (event.key === " ") jump(); // Spacebar to jump
});

document.addEventListener("keyup", (event) => {
    if (event.key in moving) moving[event.key] = false;
});