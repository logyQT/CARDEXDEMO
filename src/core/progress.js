const updateProgressBar = (owned, total, percentEl, barFillEl) => {
  let pct = total === 0 ? 0 : (owned / total) * 100;
  pct = String(pct.toFixed(1)).replace(/\.0$/, "");
  percentEl.textContent = `${pct}% (${owned}/${total})`;
  barFillEl.style.width = pct + "%";
};

const updateTrophyProgress = (slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR) => {
  if (mode === "inventory" || mode === "stats") {
    updateOverallTrophyProgress(slots, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    return;
  }
  const modeSlots = Object.values(slots[mode]);
  const owned = modeSlots.filter((slot) => slot.owned).length;
  updateProgressBar(owned, modeSlots.length, PROGRESS_BAR_TEXT, PROGRESS_BAR);
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
