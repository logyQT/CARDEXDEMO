import { getTrophyImage, renderPaginationControls, getPaginationInfo, renderSlots } from "./index.js";
import { PAGE_SIZE, COLOR_LOOKUP } from "../utils/constants.js";
import { MODAL_PAGINATION_CONTROLS, PAGINATION_CONTROLS, TROPHY_GRID } from "../utils/domRefs.js";

const capitalizeString = (string) => {
    if (string === "" || typeof string !== "string" || string === undefined || string === null) return "";
    return string
        .split(" ")
        .map((word) => String(word[0]).toUpperCase() + word.slice(1))
        .join(" ");
};

const displayModal = (slots, allSlots, slotID, matches, trophyInventory, currentPage) => {
    const MODAL_EL = document.getElementById("slot-trophy-modal");
    const MODAL_TITLE_EL = document.getElementById("slot-trophy-title");
    const MODAL_BODY = document.getElementById("modal-grid");
    const [mode, brand, model, year, color, type] = slotID.replace(/_/g, " ").split("+"); // Assuming slotID format is "mode-brand-model-year-color-type"
    let name = "";
    if (mode === "model") {
        name = `${capitalizeString(brand)} ${capitalizeString(model)}`;
    } else if (mode === "year") {
        name = `${year} ${capitalizeString(brand)} ${capitalizeString(model)}`;
    } else if (mode === "color") {
        name = `${capitalizeString(color)} ${capitalizeString(brand)} ${capitalizeString(model)}`;
    } else if (mode === "type") {
        name = `${capitalizeString(type)} ${capitalizeString(brand)} ${capitalizeString(model)}`;
    }
    MODAL_TITLE_EL.innerText = `Found ${matches.length} matching ${matches.length === 1 ? "trophy" : "trophies"} for ${name}`;
    MODAL_BODY.innerHTML = "";
    if (matches.length === 0) {
        //console.log(matches);
        MODAL_BODY.innerHTML = "<p>No matching trophies found.</p>";
    } else {
        let totalPages = 1;
        totalPages = Math.ceil(matches.length / PAGE_SIZE) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        const startIdx = (currentPage - 1) * PAGE_SIZE;
        const endIdx = startIdx + PAGE_SIZE;
        const pageSlots = matches.slice(startIdx, endIdx);

        for (const trophy of pageSlots) {
            const card = document.createElement("div");
            card.style.setProperty("--color", COLOR_LOOKUP[trophy.type]);
            card.className = "modal-card";

            const imgColor = trophy.color ? trophy.color : "Black";
            const imgType = trophy.type ? trophy.type : "Common";
            const imgSrc = getTrophyImage(trophy.brand, trophy.model, imgColor, imgType);

            const shortYear = trophy.year ? `'${String(trophy.year).slice(-2)}` : "";
            card.innerHTML = `
            <div class="trophy-slot-inner-wrapper">
                <img src="${imgSrc}" alt="${imgColor} ${imgType}" class="trophy-slot-img">
                <div class="trophy-slot-overlay">
                    <div class="trophy-slot-text">
                        <b>${shortYear} ${trophy.name}</b><br>
                    </div>
                </div>
            </div>
        `;
            card.addEventListener("click", () => {
                trophy.owned = true;
                slots[slotID] = trophy;
                const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
                renderSlots(slots, TROPHY_GRID, _CurrentPage, PAGE_SIZE, PAGINATION_CONTROLS, allSlots, trophyInventory);
                MODAL_EL.style.display = "none";
                MODAL_BODY.innerHTML = "";
            });
            MODAL_BODY.appendChild(card);
        }

        renderPaginationControls(MODAL_PAGINATION_CONTROLS, currentPage, totalPages, (newPage) => {
            displayModal(slots, allSlots, slotID, matches, trophyInventory, newPage);
        });
    }
    MODAL_EL.style.display = "flex";

    window.onclick = function (event) {
        if (event.target == MODAL_EL) {
            MODAL_EL.style.display = "none";
            MODAL_BODY.innerHTML = "";
        }
    };
    window.onkeydown = function (event) {
        if (event.key === "Escape") {
            MODAL_EL.style.display = "none";
            MODAL_BODY.innerHTML = "";
        }
    };
};

export { displayModal };
