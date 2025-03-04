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
