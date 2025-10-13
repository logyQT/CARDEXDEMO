import { sortTrophies, saveToLocalStorage, renderPaginationControls, getTrophyImage, displayModal, animateCards, disableDrag, createInternalSaveData, getMatchingTrophies } from "./index.js";
import { VERSION, COLOR_LOOKUP } from "../utils/constants.js";
/**
 *
 * @param {Object<string, Object>} slots
 * @param {*} container
 * @param {*} currentPage
 * @param {*} itemsPerPage
 * @param {*} PAGINATION_CONTROLS
 */
const renderSlots = (slots, container, currentPage, PAGE_SIZE, PAGINATION_CONTROLS, allSlots, trophyInventory) => {
    if (!slots || typeof slots !== "object") {
        container.innerHTML = "<p style='color: white; text-align: center; grid-column: span 6;'>No trophies in inventory. Add some using the random trophy button or by loading a save file.</p>";
        return;
    }
    container.innerHTML = "";
    let slotIDs = Object.keys(slots);
    let totalPages = Math.ceil(slotIDs.length / PAGE_SIZE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageSlots = slotIDs.slice(startIdx, endIdx);

    pageSlots.forEach((slotID) => {
        const slot = slots[slotID];
        const card = document.createElement("div");
        card.className = slot.owned ? "trophy-slot owned-true" : "trophy-slot owned-false";
        if (slot.owned) card.style.setProperty("--color", COLOR_LOOKUP[slot.type]);
        card.setAttribute("title", slot.owned ? "Owned - Click to change displayed trophy" : "Not Owned - Click to view matching trophies you can claim");
        if (slot.mode === "inventory") card.removeAttribute("title");
        card.setAttribute("data-owned", slot.owned);
        card.setAttribute("data-slot-id", slotID);

        const imgColor = slot.color ? slot.color : "Black";
        const imgType = slot.type ? slot.type : "Common";
        const imgSrc = getTrophyImage(slot.brand, slot.model, imgColor, imgType);

        const shortYear = slot.year ? `'${String(slot.year).slice(-2)}` : "";
        card.innerHTML = `
            <div class="trophy-slot-inner-wrapper">
                <img src="${imgSrc}" alt="${imgColor} ${imgType}" class="trophy-slot-img">
                <div class="trophy-slot-overlay">
                    <div class="trophy-slot-text">
                        <b>${shortYear} ${slot.name}</b><br>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    renderPaginationControls(PAGINATION_CONTROLS, currentPage, totalPages, (newPage) => {
        renderSlots(slots, container, newPage, PAGE_SIZE, PAGINATION_CONTROLS, allSlots, trophyInventory);
    });

    const NEW_TROPHY_ELEMENTS = document.querySelectorAll(".trophy-slot");

    NEW_TROPHY_ELEMENTS.forEach((el) => {
        const slotID = el.getAttribute("data-slot-id");
        if (slotID.split("+")[0] === "inventory") return; // Skip inventory slots
        el.addEventListener("click", () => {
            //console.log(slotID);
            displayModal(slots, allSlots, slotID, sortTrophies(getMatchingTrophies(slotID, trophyInventory), ["type", "model", "year", "color"]), trophyInventory, 1);
        });
    });

    animateCards(NEW_TROPHY_ELEMENTS);
    disableDrag(NEW_TROPHY_ELEMENTS);
    const internalSaveData = createInternalSaveData(VERSION, allSlots, trophyInventory);
    saveToLocalStorage("internalSaveData", internalSaveData);
};

export { renderSlots };
