let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;
const speed = 5;
const character = document.getElementById("character");
const head = document.getElementById("head");
const leftLeg = document.getElementById("left-leg");
const rightLeg = document.getElementById("right-leg");

let moving = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let frameIndex = 0;
let direction = 1; // 1 = right, -1 = left
let expressionTimeout = null; // Stores timeout for resetting face
let isExpressionLocked = false; // Prevents resetExpression from overriding special expressions

// ✅ Walking Frames for Legs (with spacing)
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

// ✅ Facial Expressions
const expressions = {
    normal: "<.·.>",
    thinking: "<...>",
    questioning: "< ? >",
    alert: "< ! >"
};

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
        
        if (!isExpressionLocked) resetExpression(); // Reset face to thinking while moving

        // ✅ Use correct walking frames based on direction
        const frames = direction === 1 ? legFramesRight : legFramesLeft;
        leftLeg.innerText = frames[frameIndex].left;
        rightLeg.innerText = frames[frameIndex].right;
        frameIndex = (frameIndex + 1) % frames.length;

    } else {
        character.classList.remove("walking");
        
        if (!isExpressionLocked) resetExpression(); // Reset to normal when idle

        // ✅ Reset Legs to Default (with spacing)
        leftLeg.innerText = "/";
        rightLeg.innerText = "\\";
        frameIndex = 0;
    }
}

// ✅ Function to Set Expression Temporarily (with Lock)
function setExpression(expression, duration = 2000) {
    clearTimeout(expressionTimeout);
    isExpressionLocked = true; // Lock expression changes
    head.innerText = expressions[expression];

    expressionTimeout = setTimeout(() => {
        isExpressionLocked = false; // Unlock after duration
        resetExpression();
    }, duration);
}

// ✅ Function to Reset Face Based on Movement (Only if Not Locked)
function resetExpression() {
    if (!isExpressionLocked) {
        if (moving.ArrowUp || moving.ArrowDown || moving.ArrowLeft || moving.ArrowRight) {
            head.innerText = expressions.thinking;
        } else {
            head.innerText = expressions.normal;
        }
    }
}

// ✅ Change Expression on Key Press
document.addEventListener("keydown", (event) => {
    if (event.key === "q") setExpression("questioning", 2000);
    if (event.key === "a") setExpression("alert", 2000);
});

setInterval(updatePosition, 100);
