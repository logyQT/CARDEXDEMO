import { sortTrophies, renderPaginationControls, displayModal, animateCards, disableDrag, getMatchingTrophies, parseSlotID } from "./index.js";
import { VERSION, COLOR_LOOKUP } from "../utils/constants.js";
import { trophyImageManager } from "../utils/trophyImageManager.js";
import { toastManager } from "../utils/toastManager.js";

let currentRenderToken = 0; // prevents race conditions between pages

const renderSlots = async (slots, container, currentPage, PAGE_SIZE, PAGINATION_CONTROLS, allSlots, trophyInventory) => {
  const myToken = ++currentRenderToken;

  if (!slots || typeof slots !== "object") {
    container.innerHTML = "<p style='color: white; text-align: center; grid-column: span 6;'>No trophies in inventory. Add some using the random trophy button or by loading a save file.</p>";
    renderPaginationControls(PAGINATION_CONTROLS, 1, 1, () => {});
    return;
  }

  container.innerHTML = "";

  const slotIDs = Object.keys(slots);
  const totalPages = Math.ceil(slotIDs.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pageSlots = slotIDs.slice(startIdx, endIdx);

  // render all cards instantly (with placeholders)
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

    // Placeholder first
    const placeholder = document.createElement("img");
    placeholder.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4DwQMBAADdQFcbW1XjAAAAABJRU5ErkJggg==";
    placeholder.className = "trophy-slot-img placeholder";
    placeholder.alt = "Loading...";
    cardInnerWrapper.appendChild(placeholder);

    // Overlay text
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

    // queue async image load but don't block render
    const imgColor = slot.color ?? "Black";
    const imgType = slot.type ?? "Common";

    trophyImageManager.getImage(slot.brand, slot.model, imgColor, imgType).then((image) => {
      // if page changed before load finished, skip
      if (myToken !== currentRenderToken || !image) return;

      const loadedImg = image.cloneNode();
      loadedImg.className = "trophy-slot-img";
      loadedImg.alt = `${imgColor} ${imgType}`;

      cardInnerWrapper.replaceChild(loadedImg, placeholder);
    });

    return card;
  });

  // bail early if outdated
  if (myToken !== currentRenderToken) return;

  // add cards instantly (with placeholders)
  cardElements.forEach((card) => container.appendChild(card));

  renderPaginationControls(PAGINATION_CONTROLS, currentPage, totalPages, async (newPage) => {
    await renderSlots(slots, container, newPage, PAGE_SIZE, PAGINATION_CONTROLS, allSlots, trophyInventory);
  });

  const NEW_TROPHY_ELEMENTS = container.querySelectorAll(".trophy-slot");

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
};

export { renderSlots };
