import { matchBestTrophy, generateAllTrophySlots } from "./index.js";

const autoFillTrophySlots = (carDex, trophyInventory) => {
    for (const mode in carDex) {
        carDex[mode] = [];
        const slots = generateAllTrophySlots(mode);
        slots.forEach((slot) => {
            const bestTrophy = matchBestTrophy(slot, trophyInventory, mode);
            if (bestTrophy) {
                bestTrophy.slotID = slot.slotID;
                carDex[mode].push(bestTrophy);
            }
        });
    }
    return carDex;
};

export { autoFillTrophySlots };
