// ✅ Equipment Data
const Equipment = {
    codingStaff: {
        head: "[·]",
        headShaft: "Ŧ",
        armShaft: "∂",
        legShaft: "⇂",
        equipped: false
    }
};

// ✅ Render Equipment
function renderEquipment() {
    if (Equipment.codingStaff.equipped) {
        // Add equipment to the DOM if not already added
        if (!document.getElementById("equipment-container")) {
            characterContainer.innerHTML += `
                <div id="equipment-container">
                    <div id="equipment-head"></div>
                    <div id="equipment-head-shaft"></div>
                    <div id="equipment-leg-shaft"></div>
                    <div id="particle"></div> <!-- Add particle element -->
                </div>
            `;
        }

        // Update equipment text
        document.getElementById("equipment-head").textContent = Equipment.codingStaff.head;
        document.getElementById("equipment-head-shaft").textContent = Equipment.codingStaff.headShaft;
        document.getElementById("equipment-leg-shaft").textContent = Equipment.codingStaff.legShaft;

        // Position the equipment relative to the character container
        const rightArm = document.getElementById("right-arm");
        if (rightArm) {
            const rect = rightArm.getBoundingClientRect();
            const characterRect = characterContainer.getBoundingClientRect();

            // Calculate relative positions
            const relativeTop = rect.top - characterRect.top;
            const relativeLeft = rect.left - characterRect.left;

            // Position the equipment head and shafts
            const equipmentHead = document.getElementById("equipment-head");
            const equipmentHeadShaft = document.getElementById("equipment-head-shaft");
            const equipmentLegShaft = document.getElementById("equipment-leg-shaft");

            equipmentHead.style.position = "absolute";
            equipmentHead.style.top = `${relativeTop - 40}px`; // Adjust this value as needed
            equipmentHead.style.left = `${relativeLeft + 0}px`; // Adjust this value as needed

            equipmentHeadShaft.style.position = "absolute";
            equipmentHeadShaft.style.top = `${relativeTop - 20}px`; // Adjust this value as needed
            equipmentHeadShaft.style.left = `${relativeLeft + 10}px`; // Adjust this value as needed

            equipmentLegShaft.style.position = "absolute";
            equipmentLegShaft.style.top = `${relativeTop + 20}px`; // Adjust this value as needed
            equipmentLegShaft.style.left = `${relativeLeft + 10}px`; // Adjust this value as needed

            // Position the particle at the bottom of the leg shaft
            const particle = document.getElementById("particle");
            particle.style.top = `${relativeTop + 34}px`; // Adjust this value as needed
            particle.style.left = `${relativeLeft + -10}px`; // Adjust this value as needed
        }

        // Trigger smash animation
        const equipmentHead = document.getElementById("equipment-head");
        const equipmentHeadShaft = document.getElementById("equipment-head-shaft");
        const equipmentLegShaft = document.getElementById("equipment-leg-shaft");
        equipmentHead.classList.add("smash");
        equipmentHeadShaft.classList.add("smash");
        equipmentLegShaft.classList.add("smash");

        // Trigger particle animation after the smash
        setTimeout(() => {
            const particle = document.getElementById("particle");
            if (particle) { // Check if the particle exists
                particle.style.opacity = 1;
                particle.textContent = "  -.    "; // Initial particle frame
                setTimeout(() => { particle.textContent = " *-.    "; }, 100);
                setTimeout(() => { particle.textContent = " *-.‾   "; }, 200);
                setTimeout(() => { particle.textContent = "     ,  "; }, 300);
                setTimeout(() => { particle.textContent = " *-.‾   "; }, 400);
                setTimeout(() => { particle.textContent = "·    ,·*"; }, 500);
                setTimeout(() => { particle.textContent = " *-.    "; }, 600);
                setTimeout(() => { particle.textContent = "      ·*"; }, 700);
                setTimeout(() => { particle.textContent = " *-.    "; }, 800);
                setTimeout(() => { particle.textContent = "      ·*"; }, 900);
                setTimeout(() => { particle.textContent = " *      "; }, 1000);
                setTimeout(() => { particle.style.opacity = 0; }, 1000); // Hide particle after animation
            }
        }, 400); // Delay particle animation until after the smash
    } else {
        // Remove equipment from the DOM
        if (document.getElementById("equipment-container")) {
            document.getElementById("equipment-container").remove();
        }
    }
}

// ✅ Toggle Equipment
function toggleEquipment(equipmentName) {
    Equipment[equipmentName].equipped = !Equipment[equipmentName].equipped;
    renderEquipment();
    renderCharacter();
}

// ✅ Toggle Equipment
function toggleEquipment(equipmentName) {
    Equipment[equipmentName].equipped = !Equipment[equipmentName].equipped;
    renderEquipment();
    renderCharacter();
}

// ✅ Toggle Equipment
function toggleEquipment(equipmentName) {
    Equipment[equipmentName].equipped = !Equipment[equipmentName].equipped;
    renderEquipment();
    renderCharacter();
}