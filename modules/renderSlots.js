import { sortTrophies, renderPaginationControls, displayModal, animateCards, disableDrag, getMatchingTrophies, parseSlotID } from "./index.js";
import { COLOR_LOOKUP, PAGE_SIZE } from "../utils/constants.js";
import { trophyImageManager } from "../utils/trophyImageManager.js";
import { toastManager } from "../utils/toastManager.js";
import { sortTrophySlots } from "./sortTrophySlots.js";
import { sortHandler } from "../utils/sortHandler.js";
import { PAGINATION_CONTROLS, TROPHY_GRID, SEARCH_BAR } from "../utils/domRefs.js";
import { smartSearch } from "../modules/search.js";

let currentRenderToken = 0;

const filterVehicleCollection = (collection, attribute, criteriaList) => {
  const validAttributes = ["brand", "model", "year", "color", "type", "owned"];
  if (!validAttributes.includes(attribute)) {
    return {};
  }

  const isNumericAttribute = attribute === "year";
  const isBooleanAttribute = attribute === "owned";

  let criteriaSet;

  if (isNumericAttribute) {
    criteriaSet = new Set(criteriaList.map((c) => Number(c)));
  } else if (isBooleanAttribute) {
    criteriaSet = new Set(criteriaList.map((c) => c === "true"));
  } else {
    criteriaSet = new Set(criteriaList.map((c) => String(c).toLowerCase().replace(/-/g, " ")));
  }

  return Object.keys(collection).reduce((filteredCollection, key) => {
    const vehicleData = collection[key];
    const vehicleAttributeValue = vehicleData[attribute];
    let matches = false;

    if (isNumericAttribute) {
      matches = criteriaSet.has(vehicleAttributeValue);
    } else if (isBooleanAttribute) {
      matches = criteriaSet.has(Boolean(vehicleAttributeValue));
    } else {
      const vehicleValueString = String(vehicleAttributeValue).toLowerCase();
      matches = criteriaSet.has(vehicleValueString);
    }

    if (matches) {
      filteredCollection[key] = vehicleData;
    }

    return filteredCollection;
  }, {});
};

const renderSlots = async (mode, currentPage, allSlots, trophyInventory) => {
  const myToken = ++currentRenderToken;

  if (mode === "inventory" && Object.keys(allSlots[mode]).length === 0) {
    TROPHY_GRID.innerHTML = "<p style='color: white; text-align: center; grid-column: span 6;'>No trophies in inventory. Load a save file or enable AutoUpdate to get started.</p>";
    renderPaginationControls(PAGINATION_CONTROLS, 1, 1, () => {});
    return;
  }

  TROPHY_GRID.innerHTML = "";

  const brandsDropdown = document.getElementById("brand-filter-dropdown");
  const modelsDropdown = document.getElementById("model-filter-dropdown");
  const yearsDropdown = document.getElementById("year-filter-dropdown");
  const colorsDropdown = document.getElementById("color-filter-dropdown");
  const typesDropdown = document.getElementById("type-filter-dropdown");
  const ownedDropdown = document.getElementById("owned-filter-dropdown");

  const filters = {
    brand: brandsDropdown.getSelectedItems(),
    model: modelsDropdown.getSelectedItems(),
    year: yearsDropdown.getSelectedItems(),
    color: colorsDropdown.getSelectedItems(),
    type: typesDropdown.getSelectedItems(),
    owned: ownedDropdown.getSelectedItems(),
  };

  let slots = allSlots[mode];
  for (const [attribute, criteriaList] of Object.entries(filters)) {
    if (criteriaList.length === 0) continue;
    slots = filterVehicleCollection(slots, attribute, criteriaList);
  }

  slots = smartSearch(SEARCH_BAR.value.trim(), slots);
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
    await renderSlots(mode, newPage, allSlots, trophyInventory);
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
};

export { renderSlots };
