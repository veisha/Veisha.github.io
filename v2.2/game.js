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

// ✅ Generates Character
function renderCharacter() {
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
    document.getElementById("right-arm").textContent = Characters[activeCharacter].body.rightArm;
    document.getElementById("left-leg").textContent = Characters[activeCharacter].body.leftLeg;
    document.getElementById("right-leg").textContent = Characters[activeCharacter].body.rightLeg;
}


// ✅ Handle Key Events
document.addEventListener("keydown", (event) => {
    if (event.key in moving) moving[event.key] = true;
    if (event.key === "q") changeExpression("questioning");
    if (event.key === "a") changeExpression("alert");
});

document.addEventListener("keyup", (event) => {
    if (event.key in moving) moving[event.key] = false;
});

// ✅ Changes Expression with Timer
function changeExpression(expression) {
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
