import { updateProgressBar } from "./index.js";

const updateTrophyProgress = (slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR) => {
  if (mode === "inventory" || mode === "stats") {
    updateOverallTrophyProgress(slots, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    return;
  }
  const modeSlots = Object.values(slots[mode]);
  let owned = modeSlots.filter((slot) => slot.owned).length;
  let total = modeSlots.length;
  updateProgressBar(owned, total, PROGRESS_BAR_TEXT, PROGRESS_BAR);
};

const updateOverallTrophyProgress = (slots, PROGRESS_BAR_TEXT, PROGRESS_BAR) => {
  let owned = 0;
  let total = 0;
  for (const mode in slots) {
    if (mode === "inventory") continue;
    const modeSlots = Object.values(slots[mode]);
    owned += modeSlots.filter((slot) => slot.owned).length;
    total += modeSlots.length;
  }
  updateProgressBar(owned, total, PROGRESS_BAR_TEXT, PROGRESS_BAR);
};

export { updateTrophyProgress, updateOverallTrophyProgress };
