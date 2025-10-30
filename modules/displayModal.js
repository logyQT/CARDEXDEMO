import { trophyImageManager } from "../utils/trophyImageManager.js";
import { renderPaginationControls, getPaginationInfo, renderSlots } from "./index.js";
import { PAGE_SIZE, COLOR_LOOKUP } from "../utils/constants.js";
import { MODAL_PAGINATION_CONTROLS, PAGINATION_CONTROLS, SLOT_TROPHY_MODAL } from "../utils/domRefs.js";

const capitalizeString = (string) => {
  if (!string) return "";
  return string
    .split(" ")
    .map((word) => String(word[0]).toUpperCase() + word.slice(1))
    .join(" ");
};

let currentModalRenderToken = 0;

const displayModal = (slots, allSlots, slotID, matches, trophyInventory, currentPage) => {
  // const start = performance.now();
  const myToken = ++currentModalRenderToken;
  renderPaginationControls(MODAL_PAGINATION_CONTROLS, 1, 1, () => {});

  const MODAL_TITLE_EL = document.getElementById("slot-trophy-title");
  const MODAL_BODY = document.getElementById("modal-grid");

  const closeModal = () => {
    SLOT_TROPHY_MODAL.classList.remove("active");
  };

  window.onclick = (event) => {
    if (event.target === SLOT_TROPHY_MODAL) closeModal();
  };
  window.onkeydown = (event) => {
    if (event.key === "Escape") closeModal();
  };

  // Generate name for title
  const [mode, brand, model, year, color, type] = slotID.replace(/_/g, " ").split("+");
  let name = "";
  switch (mode) {
    case "model":
      name = `${capitalizeString(brand)} ${capitalizeString(model)}`;
      break;
    case "year":
      name = `${year} ${capitalizeString(brand)} ${capitalizeString(model)}`;
      break;
    case "color":
      name = `${capitalizeString(color)} ${capitalizeString(brand)} ${capitalizeString(model)}`;
      break;
    case "type":
      name = `${capitalizeString(type)} ${capitalizeString(brand)} ${capitalizeString(model)}`;
      break;
  }

  MODAL_TITLE_EL.innerText = `Found ${matches.length} matching ${matches.length === 1 ? "trophy" : "trophies"} for ${name}`;
  MODAL_BODY.innerHTML = "";

  const totalPages = Math.ceil(matches.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pageSlots = matches.slice(startIdx, endIdx);

  pageSlots.forEach((trophy) => {
    const card = document.createElement("div");
    card.style.setProperty("--color", COLOR_LOOKUP[trophy.type]);
    card.className = "modal-card";

    const cardInnerWrapper = document.createElement("div");
    cardInnerWrapper.className = "trophy-slot-inner-wrapper";

    const placeholder = document.createElement("img");
    placeholder.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuN4vW9zkAAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuNwADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAlR56NozS1xQAAAAxJREFUGFdj4BSQAAAAVwAyp9aragAAAABJRU5ErkJggg==";
    placeholder.className = "trophy-slot-img placeholder";
    placeholder.alt = "Loading trophy...";
    cardInnerWrapper.appendChild(placeholder);

    const cardOverlay = document.createElement("div");
    cardOverlay.className = "trophy-slot-overlay";
    const cardText = document.createElement("div");
    cardText.className = "trophy-slot-text";
    const shortYear = trophy.year ? `'${String(trophy.year).slice(-2)}` : "";
    cardText.innerHTML = `<b>${shortYear} ${trophy.brand} ${trophy.model}</b><br>`;
    cardOverlay.appendChild(cardText);
    cardInnerWrapper.appendChild(cardOverlay);
    card.appendChild(cardInnerWrapper);
    MODAL_BODY.appendChild(card);

    const imgColor = trophy.color ?? "Black";
    const imgType = trophy.type ?? "Common";

    trophyImageManager.getImage(trophy.brand, trophy.model, imgColor, imgType).then((image) => {
      if (!image || myToken !== currentModalRenderToken) return;

      const loadedImg = image.cloneNode();
      loadedImg.className = "trophy-slot-img";
      loadedImg.alt = `${imgColor} ${imgType}`;

      cardInnerWrapper.replaceChild(loadedImg, placeholder);
    });

    card.addEventListener("click", () => {
      allSlots[mode][slotID] = trophy;
      allSlots[mode][slotID].owned = true;
      const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
      renderSlots(mode, _CurrentPage, allSlots, trophyInventory);
      closeModal();
      MODAL_BODY.innerHTML = "";
    });
  });

  renderPaginationControls(MODAL_PAGINATION_CONTROLS, currentPage, totalPages, (newPage) => {
    displayModal(slots, allSlots, slotID, matches, trophyInventory, newPage);
  });

  SLOT_TROPHY_MODAL.classList.toggle("active", true);
};

export { displayModal };
