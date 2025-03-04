let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;
const speed = 5;
const character = document.getElementById("character");
const leftLeg = document.getElementById("left-leg");
const rightLeg = document.getElementById("right-leg");

let moving = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let frameIndex = 0;
let direction = 1; // 1 = right, -1 = left

// ✅ Walking Frames for Legs (with spacing)
const legFramesRight = [
    { left: " ", right: " >\\" },  // Step 1
    { left: " ", right: " |\\" },  // Step 2
    { left: " ", right: " |>" }    // Step 3
];

const legFramesLeft = [
    { left: "/< ", right: " " },  // Step 1
    { left: "/| ", right: " " },  // Step 2
    { left: "<| ", right: " " }   // Step 3
];

document.addEventListener("keydown", (event) => {
    if (event.key in moving) moving[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key in moving) moving[event.key] = false;
});

function updatePosition() {
    let moved = false;

    if (moving.ArrowUp) { posY -= speed; moved = true; }
    if (moving.ArrowDown) { posY += speed; moved = true; }
    if (moving.ArrowLeft) { posX -= speed; direction = -1; moved = true; }
    if (moving.ArrowRight) { posX += speed; direction = 1; moved = true; }

    character.style.left = `${posX}px`;
    character.style.top = `${posY}px`;

    if (moved) {
        character.classList.add("walking");

        // ✅ Use correct walking frames based on direction
        const frames = direction === 1 ? legFramesRight : legFramesLeft;
        leftLeg.innerText = frames[frameIndex].left;
        rightLeg.innerText = frames[frameIndex].right;
        frameIndex = (frameIndex + 1) % frames.length;

    } else {
        character.classList.remove("walking");

        // ✅ Reset Legs to Default (with spacing)
        leftLeg.innerText = "/";
        rightLeg.innerText = "\\";
        frameIndex = 0;
    }
}

setInterval(updatePosition, 100);
