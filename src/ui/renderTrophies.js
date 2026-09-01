import { trophyImageManager } from "../trophyImageManager.js";
import { renderPaginationControls, getPaginationInfo, paginate } from "./pagination.js";
import { COLOR_LOOKUP } from "../data/index.js";
import { TROPHY_GRID, PAGINATION_CONTROLS, MODAL_PAGINATION_CONTROLS, SLOT_TROPHY_MODAL, SEARCH_BAR } from "../domRefs.js";
import { toastManager } from "../toastManager.js";
import { sortTrophies, sortTrophySlots } from "../core/trophySorting.js";
import { smartSearch } from "../core/search.js";
import { getMatchingTrophies } from "../core/trophyMatching.js";
import { parseSlotID } from "../core/trophyParsing.js";
import { sortHandler } from "../sortHandler.js";
import { animateCards } from "./animateCards.js";
import { disableDrag } from "./disableDrag.js";
import { modelToBrand } from "../data/index.js";

const PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuN4vW9zkAAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuNwADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAlR56NozS1xQAAAAxJREFUGFdj4BSQAAAAVwAyp9aragAAAABJRU5ErkJggg==";

let currentRenderToken = 0;
let currentModalRenderToken = 0;

const createCard = ({ cssClass, showMatchCount, text, brand, model, color, type, tokenContainer, onLoad }) => {
  const card = document.createElement("div");
  card.className = cssClass;
  if (type) card.style.setProperty("--color", COLOR_LOOKUP[type]);

  const innerWrapper = document.createElement("div");
  innerWrapper.className = "trophy-slot-inner-wrapper";

  const placeholder = document.createElement("img");
  placeholder.src = PLACEHOLDER;
  placeholder.className = "trophy-slot-img placeholder";
  placeholder.alt = "Loading...";
  innerWrapper.appendChild(placeholder);

  const overlay = document.createElement("div");
  overlay.className = "trophy-slot-overlay";
  const textEl = document.createElement("div");
  textEl.className = "trophy-slot-text";
  textEl.innerHTML = text;
  overlay.appendChild(textEl);

  if (showMatchCount) {
    const matchedNumber = document.createElement("div");
    matchedNumber.className = "trophy-slot-matched-number";
    matchedNumber.innerText = showMatchCount;
    overlay.appendChild(matchedNumber);
  }
  innerWrapper.appendChild(overlay);
  card.appendChild(innerWrapper);

  const imgColor = color ?? "Black";
  const imgType = type ?? "Common";
  trophyImageManager.getImage(brand, model, imgColor, imgType).then((image) => {
    if (tokenContainer.current() !== tokenContainer.token || !image) return;
    const loadedImg = image.cloneNode();
    loadedImg.className = "trophy-slot-img";
    loadedImg.alt = `${imgColor} ${imgType}`;
    innerWrapper.replaceChild(loadedImg, placeholder);
    onLoad?.();
  });

  return card;
};

const filterVehicleCollection = (collection, attribute, criteriaList) => {
  const validAttributes = ["brand", "model", "year", "color", "type", "owned"];
  if (!validAttributes.includes(attribute)) return {};

  const isNumeric = attribute === "year";
  const isBoolean = attribute === "owned";
  const criteriaSet = isNumeric
    ? new Set(criteriaList.map((c) => Number(c)))
    : isBoolean
      ? new Set(criteriaList.map((c) => c === "true"))
      : new Set(criteriaList.map((c) => String(c).toLowerCase().replace(/-/g, " ")));

  return Object.keys(collection).reduce((filtered, key) => {
    const value = collection[key][attribute];
    const matches = isNumeric
      ? criteriaSet.has(value)
      : isBoolean
        ? criteriaSet.has(Boolean(value))
        : criteriaSet.has(String(value).toLowerCase());
    if (matches) filtered[key] = collection[key];
    return filtered;
  }, {});
};

const getSlotFilters = () => {
  const ids = ["brand-filter-dropdown", "model-filter-dropdown", "year-filter-dropdown", "color-filter-dropdown", "type-filter-dropdown", "owned-filter-dropdown"];
  return Object.fromEntries(ids.map((id) => [id.split("-")[0], document.getElementById(id).getSelectedItems()]));
};

const slotMessage = (mode, brand, model, year, color, type) => {
  switch (mode) {
    case "model":
      return `${brand} ${model}`;
    case "year":
      return `${year} ${brand} ${model}`;
    case "color":
      return `${color} ${brand} ${model}`;
    case "type":
      return `${type} ${brand} ${model}`;
    default:
      return "";
  }
};

const renderSlots = async (mode, currentPage, allSlots, trophyInventory) => {
  const myToken = ++currentRenderToken;

  if (mode === "inventory" && Object.keys(allSlots[mode]).length === 0) {
    TROPHY_GRID.innerHTML = "<p style='color: white; text-align: center; grid-column: span 6;'>No trophies in inventory. Load a save file or enable AutoUpdate to get started.</p>";
    renderPaginationControls(PAGINATION_CONTROLS, 1, 1, () => {});
    return;
  }

  TROPHY_GRID.innerHTML = "";

  let filtered = allSlots[mode];
  for (const [attribute, criteriaList] of Object.entries(getSlotFilters())) {
    if (criteriaList.length === 0) continue;
    filtered = filterVehicleCollection(filtered, attribute, criteriaList);
  }
  filtered = smartSearch(SEARCH_BAR.value.trim(), filtered);
  filtered = sortTrophySlots(filtered, sortHandler.getSortParams());

  const { items: pageSlots, totalPages, currentPage: clampedPage } = paginate(Object.keys(filtered), currentPage);
  const renderToken = { token: myToken, current: () => currentRenderToken };

  const cardElements = pageSlots.map((slotID) => {
    const slot = filtered[slotID];
    const matches = getMatchingTrophies(slotID, trophyInventory);
    const shortYear = slot.year ? `'${String(slot.year).slice(-2)}` : "";
    const card = createCard({
      cssClass: slot.owned ? "trophy-slot owned-true" : "trophy-slot owned-false",
      showMatchCount: slotID.includes("inventory") ? null : String(matches.length),
      text: `<b>${shortYear} ${slot.name}</b><br>`,
      brand: slot.brand,
      model: slot.model,
      color: slot.color,
      type: slot.type,
      tokenContainer: renderToken,
    });
    card.setAttribute("data-owned", slot.owned);
    card.setAttribute("data-slot-id", slotID);
    if (!slotID.includes("inventory")) {
      card.setAttribute("title", slot.owned ? "Owned - Click to change displayed trophy" : "Not Owned - Click to view matching trophies you can claim");
    }

    const [_m, _b, _mo, _y, _c, _t] = parseSlotID(slotID);
    if (_m !== "inventory") {
      card.addEventListener("click", () => {
        if (matches.length === 0) return toastManager.push(`No matching trophies found for ${slotMessage(_m, _b, _mo, _y, _c, _t)}`, 3000, "warning");
        displayModal(allSlots, slotID, sortTrophies(getMatchingTrophies(slotID, trophyInventory), ["type", "model", "year", "color"]), trophyInventory, 1);
      });
    }
    return card;
  });

  if (myToken !== currentRenderToken) return;
  cardElements.forEach((card) => TROPHY_GRID.appendChild(card));
  renderPaginationControls(PAGINATION_CONTROLS, clampedPage, totalPages, async (newPage) => {
    await renderSlots(mode, newPage, allSlots, trophyInventory);
  });

  const rendered = TROPHY_GRID.querySelectorAll(".trophy-slot");
  animateCards(rendered);
  disableDrag(rendered);
};

const capitalizeString = (string) => {
  if (!string) return "";
  return string
    .split(" ")
    .map((word) => String(word[0]).toUpperCase() + word.slice(1))
    .join(" ");
};

const displayModal = (allSlots, slotID, matches, trophyInventory, currentPage) => {
  const myToken = ++currentModalRenderToken;
  renderPaginationControls(MODAL_PAGINATION_CONTROLS, 1, 1, () => {});

  const MODAL_TITLE_EL = document.getElementById("slot-trophy-title");
  const MODAL_BODY = document.getElementById("modal-grid");

  const closeModal = () => SLOT_TROPHY_MODAL.classList.remove("active");
  SLOT_TROPHY_MODAL.addEventListener("click", (event) => {
    if (event.target === SLOT_TROPHY_MODAL) closeModal();
  });
  const onKeydown = (event) => {
    if (event.key === "Escape") closeModal();
  };
  window.addEventListener("keydown", onKeydown);

  const [mode, brand, model, year, color, type] = slotID.replace(/_/g, " ").split("+");
  const name = slotMessage(mode, capitalizeString(brand), capitalizeString(model), year, capitalizeString(color), capitalizeString(type));

  MODAL_TITLE_EL.innerText = `Found ${matches.length} matching ${matches.length === 1 ? "trophy" : "trophies"} for ${name}`;
  MODAL_BODY.innerHTML = "";

  const { items: pageSlots, totalPages, currentPage: clampedPage } = paginate(matches, currentPage);
  const renderToken = { token: myToken, current: () => currentModalRenderToken };

  pageSlots.forEach((trophy) => {
    const shortYear = trophy.year ? `'${String(trophy.year).slice(-2)}` : "";
    const card = createCard({
      cssClass: "modal-card",
      text: `<b>${shortYear} ${trophy.brand} ${trophy.model}</b><br>`,
      brand: trophy.brand,
      model: trophy.model,
      color: trophy.color,
      type: trophy.type,
      tokenContainer: renderToken,
    });
    card.addEventListener("click", () => {
      allSlots[mode][slotID] = trophy;
      allSlots[mode][slotID].owned = true;
      const { currentPage: cp } = getPaginationInfo(PAGINATION_CONTROLS);
      renderSlots(mode, cp, allSlots, trophyInventory);
      closeModal();
      MODAL_BODY.innerHTML = "";
    });
    MODAL_BODY.appendChild(card);
  });

  renderPaginationControls(MODAL_PAGINATION_CONTROLS, clampedPage, totalPages, (newPage) => {
    displayModal(allSlots, slotID, matches, trophyInventory, newPage);
  });
  SLOT_TROPHY_MODAL.classList.toggle("active", true);
};

const typeLookup = (n) => {
  if (n == null) return "Common";
  if (n < 10) return "Common";
  else if (n < 25) return "Silver";
  else if (n < 50) return "Gold";
  else return "Diamond";
};

const renderStats = async (stats, currentPage) => {
  const myToken = ++currentRenderToken;
  TROPHY_GRID.innerHTML = "";
  const renderToken = { token: myToken, current: () => currentRenderToken };

  const modelList = Array.from(modelToBrand.keys());
  const { items: pageSlots, totalPages, currentPage: clampedPage } = paginate(modelList, currentPage);

  const cardElements = pageSlots.map((model) => {
    const brand = modelToBrand.get(model);
    const type = typeLookup(stats?.totalTrophies?.[model]);
    const card = createCard({
      cssClass: "stat-slot owned-true",
      text: `<b>${brand} ${model}</b>`,
      brand,
      model,
      color: null,
      type,
      tokenContainer: renderToken,
    });
    const missingColors = stats?.carDex?.color?.missing?.[model]?.map((car) => car.color);
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.innerHTML = `${brand} ${model}<br>Car crushed: ${stats?.totalTrophies?.[model] ?? 0}<br><p>Missing Colors: ${missingColors || "None"}</p>`;
    card.appendChild(tooltip);
    ["mouseenter", "focusin"].forEach((ev) => card.addEventListener(ev, () => tooltip.classList.add("show")));
    ["mouseleave", "focusout"].forEach((ev) => card.addEventListener(ev, () => tooltip.classList.remove("show")));
    return card;
  });

  if (myToken !== currentRenderToken) return;
  cardElements.forEach((card) => TROPHY_GRID.appendChild(card));
  renderPaginationControls(PAGINATION_CONTROLS, clampedPage, totalPages, async (newPage) => {
    await renderStats(stats, newPage);
  });
  disableDrag(TROPHY_GRID.querySelectorAll(".trophy-slot"));
};

export { renderSlots, displayModal, renderStats };
