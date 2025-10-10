import {
    createInternalSaveData,
    getPaginationInfo,
    sortTrophies,
    generateRandomTrophy,
    generateAllInventorySlots,
    getMatchingTrophies,
    matchTrophy,
    getSaveObject,
    getDatabase,
    disableDrag,
    getTrophyImage,
    animateCards,
    renderPaginationControls,
    generateAllTrophySlots,
    saveToLocalStorage,
    loadFromLocalStorage,
    validateInternalSaveData,
    generateID,
    removeFromLocalStorage,
    exportToJSON,
    importFromJSON,
    updateTrophyProgress,
    getAllTrophies,
    resetPaginationControls,
    updateOverallTrophyProgress,
    autoFillTrophySlots,
} from "./utils/index.js";

import { MEDIA_INPUT, PROGRESS_BAR, PROGRESS_BAR_TEXT, PAGINATION_CONTROLS, MODAL_PAGINATION_CONTROLS, VERSION_TEXT, RESET_BUTTON, IMPORT_JSON_BUTTON, DOWNLOAD_JSON_BUTTON, TROPHY_AUTOFILL_BUTTON, ADD_TROPHY_BUTTON } from "./utils/domRefs.js";

import { GAME_VERSION, VERSION, PAGE_SIZE } from "./utils/constants.js";

/**
 * @type {import("./utils/types.js").SaveObjectRoot}
 */
let SaveObject = {};
let trophyInventory = [];
let carDex = {
    model: [],
    year: [],
    color: [],
    type: [],
};
let mode = "model"; // Default mode

const colorLookup = {
    Common: "rgb(255, 255, 255)",
    Silver: "rgb(192, 192, 192)",
    Gold: "#9F834C",
    Diamond: "#CCE6FE",
    Rust: "#AA8070",
};

const renderTrophySlots = (inventory, mode, currentPage) => {
    if (mode === "inventory") {
        updateOverallTrophyProgress(carDex, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    }
    if (mode === "inventory" && inventory?.length === 0) {
        const container = document.getElementById("grid");
        container.innerHTML = "<p style='color: white; text-align: center; grid-column: span 6;'>No trophies in inventory. Add some using the random trophy button or by loading a save file.</p>";
        resetPaginationControls(PAGINATION_CONTROLS);
        return;
    }
    let totalPages = 1;

    const container = document.getElementById("grid");
    container.innerHTML = "";

    const slots = mode !== "inventory" ? generateAllTrophySlots(mode) : generateAllInventorySlots(sortTrophies(inventory, ["type", "model", "year", "color"]));

    mode !== "inventory"
        ? inventory.forEach((trophy) => {
              slots.forEach((slot) => {
                  if (matchTrophy(slot, trophy, mode)) {
                      slot.owned = true;
                      slot.color = trophy.color;
                      slot.type = trophy.type;
                      slot.year = trophy.year;
                      slot.brand = trophy.brand;
                      slot.model = trophy.model;
                      slot.name = `${trophy.brand} ${trophy.model}`;
                  }
              });
          })
        : null;

    totalPages = Math.ceil(slots.length / PAGE_SIZE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageSlots = slots.slice(startIdx, endIdx);

    pageSlots.forEach((slot) => {
        slot.mode = mode;
        slot._slot = slot;
        const card = document.createElement("div");
        card.className = slot.owned ? "trophy-slot owned-true" : "trophy-slot owned-false";
        if (slot.owned) card.style.setProperty("--color", colorLookup[slot.type]);
        card.setAttribute("title", slot.owned ? "Owned - Click to change displayed trophy" : "Not Owned - Click to view matching trophies you can claim");
        card.setAttribute("data-owned", slot.owned);
        card.setAttribute("data-name", slot.name);
        card.setAttribute("data-brand", slot.brand);
        card.setAttribute("data-model", slot.model);
        card.setAttribute("data-year", slot.year || null);
        card.setAttribute("data-color", slot.color || null);
        card.setAttribute("data-type", slot.type || null);

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
        card.addEventListener("click", () => {
            if (slot.mode === "inventory") {
                // do nothing for now
                // implement grouping later
                // pressing would show all trophies found with exact same specs
                return;
            }
            if (slot.owned === true) {
                // return for now
                // implement modal for viewing matching trophies
                return;
            } else {
                const matches = getMatchingTrophies(slot, mode, trophyInventory);
                if (mode === "type") {
                    displayModal(slot._slot, sortTrophies(matches, "year"), 1);
                }
                if (mode === "color") {
                    displayModal(slot._slot, sortTrophies(matches, "year"), 1);
                }
                if (mode === "year") {
                    displayModal(slot._slot, sortTrophies(matches, "type"), 1);
                }
                if (mode === "model") {
                    displayModal(slot._slot, sortTrophies(matches, ["type", "year", "color"]), 1);
                }
            }
        });
    });

    renderPaginationControls(PAGINATION_CONTROLS, currentPage, totalPages, (newPage) => {
        renderTrophySlots(inventory, mode, newPage);
    });

    if (mode !== "inventory") updateTrophyProgress(carDex, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    const NEW_TROPHY_ELEMENTS = document.querySelectorAll(".trophy-slot");

    animateCards(NEW_TROPHY_ELEMENTS);
    disableDrag(NEW_TROPHY_ELEMENTS);
    const internalSaveData = createInternalSaveData(VERSION, carDex, trophyInventory);
    saveToLocalStorage("internalSaveData", internalSaveData);
};

const displayModal = (slot, matches, currentPage) => {
    const MODAL_EL = document.getElementById("slot-trophy-modal");
    const MODAL_TITLE_EL = document.getElementById("slot-trophy-title");
    const MODAL_BODY = document.getElementById("slot-trophy-body");
    MODAL_TITLE_EL.innerText = `Found ${matches.length} matching ${matches.length === 1 ? "trophy" : "trophies"} for ${slot.name}`;
    MODAL_BODY.innerHTML = "";
    if (matches.length === 0) {
        MODAL_BODY.innerHTML = "";
    } else {
        let totalPages = 1;
        totalPages = Math.ceil(matches.length / PAGE_SIZE) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        const startIdx = (currentPage - 1) * PAGE_SIZE;
        const endIdx = startIdx + PAGE_SIZE;
        const pageSlots = matches.slice(startIdx, endIdx);

        for (const trophy of pageSlots) {
            const card = document.createElement("div");
            card.style.setProperty("--color", colorLookup[trophy.type]);
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
                        <b>${shortYear} ${slot.name}</b><br>
                    </div>
                </div>
            </div>
        `;
            card.addEventListener("click", () => {
                trophy.slotID = generateID(mode, slot);
                carDex[mode].push(trophy);
                const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
                renderTrophySlots(carDex[mode], mode, _CurrentPage);
                MODAL_EL.style.display = "none";
                MODAL_BODY.innerHTML = "";
            });
            MODAL_BODY.appendChild(card);
        }

        renderPaginationControls(MODAL_PAGINATION_CONTROLS, currentPage, totalPages, (newPage) => {
            displayModal(slot, matches, newPage);
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

// Load and read save file

const read_save = async (input) => {
    console.info("Reading save file...");
    if (!input.files || input.files.length === 0) {
        console.warn("No file selected");
        return;
    }

    const file = input.files[0];

    const db = await getDatabase(file);
    if (!db) {
        alert("Failed to open the database. Please ensure a valid save file is selected.");
        return;
    }

    const start = performance.now();
    SaveObject = getSaveObject(db);
    db.close();
    const end = performance.now();
    console.info(`Database query and parsing took ${(end - start).toFixed(2)} ms`);
    console.info("Database loaded successfully.");
    console.info(SaveObject);

    trophyInventory = getAllTrophies(SaveObject);
    renderTrophySlots(trophyInventory, "inventory", 1);
};

// App interactions
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
    if (!tab.getAttribute("data-mode")) return;
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        mode = tab.getAttribute("data-mode");
        if (mode === "inventory") {
            renderTrophySlots(trophyInventory, mode, 1);
            return;
        }
        renderTrophySlots(carDex[mode], mode, 1);
        updateTrophyProgress(carDex, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    });
});

ADD_TROPHY_BUTTON.addEventListener("click", () => {
    trophyInventory.push(generateRandomTrophy());

    if (mode === "inventory") {
        const totalPages = Math.ceil(trophyInventory.length / PAGE_SIZE) || 1;
        renderTrophySlots(trophyInventory, mode, totalPages);
    }
    const internalSaveData = createInternalSaveData(VERSION, carDex, trophyInventory);
    saveToLocalStorage("internalSaveData", internalSaveData);
});

TROPHY_AUTOFILL_BUTTON.addEventListener("click", () => {
    if (trophyInventory.length === 0) {
        alert("No trophies in inventory to fill the CarDex with.");
        return;
    }
    mode = mode === "inventory" ? "model" : mode;
    carDex = autoFillTrophySlots(carDex, trophyInventory);
    const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
    renderTrophySlots(carDex[mode], mode, _CurrentPage);
});

DOWNLOAD_JSON_BUTTON.addEventListener("click", () => {
    const internalSaveData = createInternalSaveData(VERSION, carDex, trophyInventory);
    exportToJSON(internalSaveData);
});

IMPORT_JSON_BUTTON.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        importFromJSON(file, (data) => {
            console.info("Imported data:", data);
            carDex = data.carDex;
            trophyInventory = data.trophyInventory;
            const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
            renderTrophySlots(carDex[mode], mode, _CurrentPage);
            updateTrophyProgress(carDex, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
        });
    }
});

RESET_BUTTON.addEventListener("click", () => {
    removeFromLocalStorage("internalSaveData");
    trophyInventory = [];
    carDex = { model: [], year: [], color: [], type: [] };
    mode = "model";
    renderTrophySlots(carDex[mode], mode, 1);
    updateTrophyProgress(carDex, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    console.info("Save data reset.");
});

VERSION_TEXT.innerText = `v${VERSION} (Hotfix ${GAME_VERSION})`;
MEDIA_INPUT.addEventListener("change", (event) => read_save(event.target));
const savedData = loadFromLocalStorage("internalSaveData");

if (validateInternalSaveData(savedData, VERSION)) {
    console.info(savedData);
    carDex = savedData.carDex;
    trophyInventory = savedData.trophyInventory;
    console.info("Loaded saved data from localStorage.");
} else {
    console.warn("No valid saved data found in localStorage.");
}

renderTrophySlots(carDex[mode], mode, 1);
updateTrophyProgress(carDex, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
disableDrag(document.querySelectorAll("*"));
