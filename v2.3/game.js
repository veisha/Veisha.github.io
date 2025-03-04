const characterContainer = document.getElementById("character-container");

let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;
const speed = 5;
let moving = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let frameIndex = 0;
let direction = 1; // 1 = right, -1 = left
let expressionTimeout = null;

// ✅ Walking Frames for Legs (adds spacing)
const legFramesRight = [
    { left: " ", right: " >\\" },
    { left: " ", right: " |\\" },
    { left: " ", right: "|>" }
];

const legFramesLeft = [
    { left: "/< ", right: " " },
    { left: "/| ", right: " " },
    { left: "<| ", right: " " }
];

// ✅ Handle Key Events
document.addEventListener("keydown", (event) => {
    if (event.key in moving) moving[event.key] = true;
    if (event.key === "q") changeExpression("questioning");
    if (event.key === "a") changeExpression("alert");
    if (event.key === "e") toggleEquipment("codingStaff"); // Toggle Coding Staff
});

document.addEventListener("keyup", (event) => {
    if (event.key in moving) moving[event.key] = false;
});

// ✅ Updates Character Position & Animation
function updatePosition() {
    let moved = false;

    if (moving.ArrowUp) { posY -= speed; moved = true; }
    if (moving.ArrowDown) { posY += speed; moved = true; }
    if (moving.ArrowLeft) { posX -= speed; direction = -1; moved = true; }
    if (moving.ArrowRight) { posX += speed; direction = 1; moved = true; }

    characterContainer.style.left = `${posX}px`;
    characterContainer.style.top = `${posY}px`;

    if (moved) {
        characterContainer.classList.add("walking");

        // ✅ Use correct walking frames based on direction
        const frames = direction === 1 ? legFramesRight : legFramesLeft;
        Characters[activeCharacter].body.leftLeg = frames[frameIndex].left;
        Characters[activeCharacter].body.rightLeg = frames[frameIndex].right;
        frameIndex = (frameIndex + 1) % frames.length;
    } else {
        characterContainer.classList.remove("walking");

        // ✅ Reset Legs to Default
        Characters[activeCharacter].body.leftLeg = "/";
        Characters[activeCharacter].body.rightLeg = "\\";
        frameIndex = 0;
    }

    renderCharacter();
}

// ✅ Game Loop (Runs Every 100ms)
setInterval(updatePosition, 100);

// ✅ Initial Render
renderCharacter();
renderEquipment();