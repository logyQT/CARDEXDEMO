import { sortTrophies, renderPaginationControls, displayModal, animateCards, disableDrag, getMatchingTrophies } from "./index.js";
import { VERSION, COLOR_LOOKUP, PAGE_SIZE } from "../utils/constants.js";
import { trophyImageManager } from "../utils/trophyImageManager.js";
import { E_CarModel } from "../utils/mappings.js";
import { TROPHY_GRID, PAGINATION_CONTROLS } from "../utils/domRefs.js";
import { modelToBrandMap, allCarModels } from "../carData.js";

let currentRenderToken = 0;

const typeLookup = (n) => {
  if (n < 10) return "Common";
  else if (n < 25) return "Silver";
  else if (n < 50) return "Gold";
  else if (n > 50) return "Diamond";
};

const renderStats = async (stats, currentPage) => {
  const myToken = ++currentRenderToken;
  console.log(stats);
  TROPHY_GRID.innerHTML = "";
  const models = Object.fromEntries(allCarModels.map((item, i) => [i, item]));
  const slotIDs = Object.keys(models);
  const totalPages = Math.ceil(slotIDs.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pageSlots = slotIDs.slice(startIdx, endIdx);

  const cardElements = pageSlots.map((slotID) => {
    const model = models[slotID];
    const slot = {
      name: `${modelToBrandMap.get(model)} ${model}`,
      type: typeLookup(stats?.totalTrophies?.[model]),
    };
    const card = document.createElement("div");
    card.className = "stat-slot owned-true";
    card.style.setProperty("--color", COLOR_LOOKUP[slot.type]);

    const cardInnerWrapper = document.createElement("div");
    cardInnerWrapper.className = "trophy-slot-inner-wrapper";

    const placeholder = document.createElement("img");
    placeholder.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4DwQMBAADdQFcbW1XjAAAAABJRU5ErkJggg==";
    placeholder.className = "trophy-slot-img placeholder";
    placeholder.alt = "Loading...";
    cardInnerWrapper.appendChild(placeholder);

    const cardOverlay = document.createElement("div");
    cardOverlay.className = "trophy-slot-overlay";
    const cardText = document.createElement("div");
    cardText.className = "trophy-slot-text";
    cardText.innerHTML = `<b>${slot.name}</b>`;

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    const missingColors = stats?.carDex?.color?.missing?.[model]?.map((car) => car.color);
    console.log("Missing colors for", model, ":", missingColors);
    tooltip.innerHTML = `${slot.name}
      <br>Car crushed: ${stats?.totalTrophies?.[model] ?? 0}
      <br><p>Missing Colors: ${missingColors || "None"}</p>
      
      `;

    card.appendChild(tooltip);
    cardOverlay.appendChild(cardText);
    cardInnerWrapper.appendChild(cardOverlay);
    card.appendChild(cardInnerWrapper);

    card.addEventListener("mouseenter", () => {
      tooltip.classList.add("show");
    });
    card.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });
    card.addEventListener("focusin", () => {
      tooltip.classList.add("show");
    });
    card.addEventListener("focusout", () => {
      tooltip.classList.remove("show");
    });

    const imgColor = slot.color ?? "Black";
    const imgType = slot.type ?? "Common";

    trophyImageManager.getImage(modelToBrandMap.get(model), model, imgColor, imgType).then((image) => {
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
    await renderStats(stats, newPage);
  });

  const NEW_TROPHY_ELEMENTS = TROPHY_GRID.querySelectorAll(".trophy-slot");

  disableDrag(NEW_TROPHY_ELEMENTS);
};

export { renderStats };
