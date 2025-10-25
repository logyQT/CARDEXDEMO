/**
 * Updates a progress bar fill and percentage label.
 * @param {number} owned - Number of collected items.
 * @param {number} total - Total number of items.
 * @param {HTMLElement} percentEl - Element to display percentage text.
 * @param {HTMLElement} barFillEl - Element to set width for bar fill.
 */
const updateProgressBar = (owned, total, percentEl, barFillEl) => {
  let pct = total === 0 ? 0 : (owned / total) * 100;
  pct = String(pct.toFixed(1)).replace(/\.0$/, "");
  percentEl.textContent = `${pct}% (${owned}/${total})`;
  barFillEl.style.width = pct + "%";
};
export { updateProgressBar };
