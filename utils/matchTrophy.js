/**
 * Matches a trophy with a slot based on the specified mode.
 * @param {*} slot - The slot to match against.
 * @param {*} trophy - The trophy to match.
 * @param {*} mode - The mode of matching (e.g., "model", "year", "color", "type").
 * @returns {boolean} - True if the trophy matches the slot, false otherwise.
 */

const matchTrophy = (slot, trophy, mode) => {
    if (mode === "model") {
        return slot.brand === trophy.brand && slot.model === trophy.model;
    } else if (mode === "year") {
        return slot.brand === trophy.brand && slot.model === trophy.model && slot.year === trophy.year;
    } else if (mode === "color") {
        return slot.brand === trophy.brand && slot.model === trophy.model && slot.color === trophy.color && trophy.type === "Common";
    } else if (mode === "type") {
        return slot.brand === trophy.brand && slot.model === trophy.model && slot.type === trophy.type;
    }
    return false;
};

// const matchTrophy = (slot, trophy, mode, trophyInventory) => {
//     const trophyPriority = ["Common", "Rust", "Silver", "Gold", "Diamond"];
//     if (mode === "model") {
//         if (slot.brand === trophy.brand && slot.model === trophy.model) {
//             if (!slot.owned) {
//                 return true;
//             } else {
//                 const currentTypeIdx = trophyPriority.indexOf(slot.type || "Common");
//                 const newTypeIdx = trophyPriority.indexOf(trophy.type || "Common");

//                 if (newTypeIdx > currentTypeIdx || (newTypeIdx === currentTypeIdx && (trophy.year || 0) > (slot.year || 0))) {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     } else if (mode === "year") {
//         return slot.brand === trophy.brand && slot.model === trophy.model && slot.year === trophy.year;
//     } else if (mode === "color") {
//         if (slot.brand === trophy.brand && slot.model === trophy.model && slot.color === trophy.color && trophy.type === "Common") {
//             const allYears = trophyInventory.filter((t) => t.brand === slot.brand && t.model === slot.model && t.color === slot.color && t.type === "Common").map((t) => t.year || 0);
//             const maxYear = Math.max(...allYears);
//             return trophy.year === maxYear;
//         }
//         return false;
//     } else if (mode === "type") {
//         return slot.brand === trophy.brand && slot.model === trophy.model && slot.type === trophy.type;
//     }
//     return false;
// };

export { matchTrophy };
