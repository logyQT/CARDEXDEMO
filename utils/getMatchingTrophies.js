/**
 * Gets the matching trophies from the inventory based on the specified mode and slot.
 * @param {*} trophyInventory - The inventory of trophies.
 * @param {*} mode - The mode of matching (e.g., "model", "year", "color", "type").
 * @param {*} slot - The slot to match against.
 * @returns {Array} - An array of matching trophies.
 */

import { matchTrophy } from "./index.js";

const getMatchingTrophies = (slot, mode, trophyInventory) => {
    return trophyInventory.filter((trophy) => {
        return matchTrophy(slot, trophy, mode, trophyInventory);
    });
};

export { getMatchingTrophies };
