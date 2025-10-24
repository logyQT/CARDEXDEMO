import { matchBestTrophy } from "./index.js";

const autoFillTrophySlots = (slots, trophyInventory) => {
  for (const mode in slots) {
    if (mode === "inventory") continue;
    for (const slotID of Object.keys(slots[mode])) {
      if (slots[mode][slotID].owned) continue;
      const bestTrophy = matchBestTrophy(slots[mode][slotID], trophyInventory, mode);
      if (bestTrophy) {
        slots[mode][slotID] = bestTrophy;
        slots[mode][slotID].owned = true;
      }
    }
  }
  return slots;
};

export { autoFillTrophySlots };
