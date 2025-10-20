import { matchBestTrophy } from "./index.js";

const autoFillTrophySlots = (slots, trophyInventory) => {
  for (const mode in slots) {
    if (mode === "inventory") continue;
    const modeSlots = Object.keys(slots[mode]);
    modeSlots.forEach((slotID) => {
      const bestTrophy = matchBestTrophy(slots[mode][slotID], trophyInventory, mode);
      if (bestTrophy) {
        bestTrophy.slotID = slotID;
        bestTrophy.owned = true;
        slots[mode][slotID] = bestTrophy;
      }
    });
  }
  return slots;
};

export { autoFillTrophySlots };
