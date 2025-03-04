let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;
let direction = 1; // 1 = right, -1 = left
const speed = 5;
const ascii = document.getElementById("movingAscii");

// Idle Frame
const idleFrame = `<...>\n /|\\\n / \\`;

// Walking Frames
const framesRight = [
`<...>   
 /|\\
  >\\`, 

`<...>   
 /|\\
  |\\`,

`<...>   
 /|\\
  |>`
];

const framesLeft = [
`<...>   
 /|\\
 /<`,

`<...>   
 /|\\
 /|`,

`<...>   
 /|\\
 <|`
];

let frameIndex = 0;
let moving = { ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false };

// ✅ Set Idle at Start
ascii.innerText = idleFrame;

function updatePosition() {
    let moved = false;
    
    if (moving.ArrowUp) { 
        posY -= speed; 
        moved = true; 
    }
    if (moving.ArrowDown) { 
        posY += speed; 
        moved = true; 
    }
    if (moving.ArrowLeft) { 
        posX -= speed; 
        direction = -1; // Last faced left
        moved = true; 
    }
    if (moving.ArrowRight) { 
        posX += speed; 
        direction = 1; // Last faced right
        moved = true; 
    }

    ascii.style.left = `${posX}px`;
    ascii.style.top = `${posY}px`;

    // ✅ If no movement, go idle
    if (!moved) {
        ascii.innerText = idleFrame;
        frameIndex = 0;  // Reset animation
    }
}

function animateASCII() {
    if (moving.ArrowLeft || moving.ArrowRight || moving.ArrowUp || moving.ArrowDown) {
        const frames = direction === 1 ? framesRight : framesLeft;
        ascii.innerText = frames[frameIndex];
        frameIndex = (frameIndex + 1) % frames.length;
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key in moving) moving[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key in moving) moving[event.key] = false;
});

// ✅ Ensures Idle Mode Works
setInterval(() => {
    updatePosition();
    animateASCII();
}, 100);
