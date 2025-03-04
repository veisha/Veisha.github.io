// ✅ Character Data Storage (Modular & Expandable)
const Characters = {
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
let activeCharacter = "Veisha";
let currentExpression = Characters[activeCharacter].expressions.normal;

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