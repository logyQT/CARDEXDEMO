import { sortTrophies, filterTrophies } from "./index.js";
/**
 * @param {*} slot trophy slot to match the trophy for
 * @param {[]} trophies array of trophies to match from
 * @param {"model" | "year" | "color" | "type"} mode matching mode
 * @returns {Object | null} best matching trophy or null if none found
 */
const matchBestTrophy = (slot, trophies, mode) => {
    switch (mode) {
        case "model":
            return sortTrophies(filterTrophies(trophies, { brand: slot.brand, model: slot.model }), ["type", "year"])[0] || null;
        case "year":
            return sortTrophies(filterTrophies(trophies, { brand: slot.brand, model: slot.model, year: slot.year }), ["type"])[0] || null;
        case "color":
            return sortTrophies(filterTrophies(trophies, { brand: slot.brand, model: slot.model, color: slot.color, type: "Common" }), ["year"])[0] || null;
        case "type":
            return sortTrophies(filterTrophies(trophies, { brand: slot.brand, model: slot.model, type: slot.type }), ["year"])[0] || null;
        default:
            return null;
    }
};

export { matchBestTrophy };
