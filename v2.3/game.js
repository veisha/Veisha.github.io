// ✅ Global Variables
const characterContainer = document.getElementById("character-container");

// ✅ Game Loop (Runs Every 100ms)
setInterval(updatePosition, 100);

// ✅ Initial Render
renderCharacter();
renderEquipment();