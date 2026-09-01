import { PROGRESS_BAR, PROGRESS_BAR_TEXT } from "../domRefs.js";

const updateProgressBar = ({ owned, total }) => {
  let pct = total === 0 ? 0 : (owned / total) * 100;
  pct = String(pct.toFixed(1)).replace(/\.0$/, "");
  PROGRESS_BAR_TEXT.textContent = `${pct}% (${owned}/${total})`;
  PROGRESS_BAR.style.width = pct + "%";
};

const updateTrophyProgress = ({ slots, mode }) => {
  if (mode === "inventory" || mode === "stats") {
    updateOverallTrophyProgress({ slots });
    return;
  }
  const modeSlots = Object.values(slots[mode]);
  const owned = modeSlots.filter((slot) => slot.owned).length;
  updateProgressBar({ owned, total: modeSlots.length });
};

const updateOverallTrophyProgress = ({ slots }) => {
  let owned = 0;
  let total = 0;
  for (const mode in slots) {
    if (mode === "inventory") continue;
    const modeSlots = Object.values(slots[mode]);
    owned += modeSlots.filter((slot) => slot.owned).length;
    total += modeSlots.length;
  }
  updateProgressBar({ owned, total });
};

export { updateTrophyProgress, updateOverallTrophyProgress };
