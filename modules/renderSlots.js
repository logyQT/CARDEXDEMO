import { sortTrophies, renderPaginationControls, displayModal, animateCards, disableDrag, getMatchingTrophies, parseSlotID } from "./index.js";
import { COLOR_LOOKUP, PAGE_SIZE } from "../utils/constants.js";
import { trophyImageManager } from "../utils/trophyImageManager.js";
import { toastManager } from "../utils/toastManager.js";
import { sortTrophySlots } from "./sortTrophySlots.js";
import { sortHandler } from "../utils/sortHandler.js";
import { PAGINATION_CONTROLS, TROPHY_GRID } from "../utils/domRefs.js";

let currentRenderToken = 0;

const renderSlots = async (slots, currentPage, allSlots, trophyInventory) => {
  const start = performance.now();
  const myToken = ++currentRenderToken;

  if (!slots || typeof slots !== "object") {
    TROPHY_GRID.innerHTML = "<p style='color: white; text-align: center; grid-column: span 6;'>No trophies in inventory. Add some using the random trophy button or by loading a save file.</p>";
    renderPaginationControls(PAGINATION_CONTROLS, 1, 1, () => {});
    return;
  }

  TROPHY_GRID.innerHTML = "";

  slots = sortTrophySlots(slots, sortHandler.getSortParams());
  const slotIDs = Object.keys(slots);
  const totalPages = Math.ceil(slotIDs.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pageSlots = slotIDs.slice(startIdx, endIdx);

  const cardElements = pageSlots.map((slotID) => {
    const matches = getMatchingTrophies(slotID, trophyInventory);
    const slot = slots[slotID];
    const card = document.createElement("div");
    card.className = slot.owned ? "trophy-slot owned-true" : "trophy-slot owned-false";
    if (slot.owned) card.style.setProperty("--color", COLOR_LOOKUP[slot.type]);
    card.setAttribute("data-owned", slot.owned);
    card.setAttribute("data-slot-id", slotID);
    if (!slotID.includes("inventory")) card.setAttribute("title", slot.owned ? "Owned - Click to change displayed trophy" : "Not Owned - Click to view matching trophies you can claim");

    const cardInnerWrapper = document.createElement("div");
    cardInnerWrapper.className = "trophy-slot-inner-wrapper";

    const placeholder = document.createElement("img");
    placeholder.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuN4vW9zkAAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuNwADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAlR56NozS1xQAAAAxJREFUGFdj4BSQAAAAVwAyp9aragAAAABJRU5ErkJggg==";
    placeholder.className = "trophy-slot-img placeholder";
    placeholder.alt = "Loading...";
    cardInnerWrapper.appendChild(placeholder);

    const cardOverlay = document.createElement("div");
    cardOverlay.className = "trophy-slot-overlay";
    const cardText = document.createElement("div");
    cardText.className = "trophy-slot-text";
    const shortYear = slot.year ? `'${String(slot.year).slice(-2)}` : "";
    cardText.innerHTML = `<b>${shortYear} ${slot.name}</b><br>`;

    if (!slotID.includes("inventory")) {
      const cardMatchedNumber = document.createElement("div");
      cardMatchedNumber.className = "trophy-slot-matched-number";
      cardMatchedNumber.innerText = `${matches.length}`;
      cardOverlay.appendChild(cardMatchedNumber);
    }

    cardOverlay.appendChild(cardText);
    cardInnerWrapper.appendChild(cardOverlay);
    card.appendChild(cardInnerWrapper);

    const imgColor = slot.color ?? "Black";
    const imgType = slot.type ?? "Common";

    trophyImageManager.getImage(slot.brand, slot.model, imgColor, imgType).then((image) => {
      if (myToken !== currentRenderToken || !image) return;

      const loadedImg = image.cloneNode();
      loadedImg.className = "trophy-slot-img";
      loadedImg.alt = `${imgColor} ${imgType}`;

      cardInnerWrapper.replaceChild(loadedImg, placeholder);
    });

    return card;
  });

  if (myToken !== currentRenderToken) return;

  cardElements.forEach((card) => TROPHY_GRID.appendChild(card));

  renderPaginationControls(PAGINATION_CONTROLS, currentPage, totalPages, async (newPage) => {
    await renderSlots(slots, newPage, allSlots, trophyInventory);
  });

  const NEW_TROPHY_ELEMENTS = TROPHY_GRID.querySelectorAll(".trophy-slot");

  NEW_TROPHY_ELEMENTS.forEach((el) => {
    const slotID = el.getAttribute("data-slot-id");
    let [_mode, _brand, _model, _year, _color, _type] = parseSlotID(slotID);
    if (_mode === "inventory") return;
    const matches = getMatchingTrophies(slotID, trophyInventory);
    let message = "";
    if (_mode === "model") {
      message = `${_brand} ${_model}`;
    } else if (_mode === "year") {
      message = `${_year} ${_brand} ${_model}`;
    } else if (_mode === "color") {
      message = `${_color} ${_brand} ${_model}`;
    } else if (_mode === "type") {
      message = `${_type} ${_brand} ${_model}`;
    }
    el.addEventListener("click", () => {
      if (matches.length === 0) return toastManager.push(`No matching trophies found for ${message}`, 3000, "warning");
      displayModal(slots, allSlots, slotID, sortTrophies(getMatchingTrophies(slotID, trophyInventory), ["type", "model", "year", "color"]), trophyInventory, 1);
    });
  });

  animateCards(NEW_TROPHY_ELEMENTS);
  disableDrag(NEW_TROPHY_ELEMENTS);
  const end = performance.now();
  console.log(`Rendered page ${currentPage} with ${pageSlots.length} trophies in ${(end - start).toFixed(2)} ms`);
};

export { renderSlots };
