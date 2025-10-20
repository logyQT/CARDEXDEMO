/**
 * Updates a progress bar fill and percentage label.
 * @param {number} owned - Number of collected items.
 * @param {number} total - Total number of items.
 * @param {HTMLElement} percentEl - Element to display percentage text.
 * @param {HTMLElement} barFillEl - Element to set width for bar fill.
 */
const updateProgressBar = (owned, total, percentEl, barFillEl) => {
  const pct = total === 0 ? 0 : Math.round((owned / total) * 100);
  percentEl.textContent = `${pct}% (${owned}/${total})`;
  barFillEl.style.width = pct + "%";
};
export { updateProgressBar };
