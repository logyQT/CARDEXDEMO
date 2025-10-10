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

export { matchTrophy };
