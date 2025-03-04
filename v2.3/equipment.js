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
        }
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