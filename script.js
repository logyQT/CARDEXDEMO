import { E_CarBrand, E_CarModel, E_VehiclePaintColor, E_TrophyType } from "./utils/mappings.js";
import { carData } from "./carData.js";
import { generateAllInventorySlots, getMatchingTrophies, matchTrophy, getSaveObject, getDatabase, disableDrag, getTrophyImage, animateCards, updateProgressBar, renderPaginationControls, generateAllTrophySlots, getMatchingItemsInInventory } from "./utils/index.js";

let db = null;
let SaveObject = {};
let trophyInventory = [];
let carDex = [];
let mode = "model"; // Default mode
const GAME_VERSION = "#81";
const VERSION = "2.0.1";
const TROPHY_PRODUCT_ID = "VehicleTrophy";
const MEDIA_INPUT = document.getElementById("mediaInput");
const PROGRESS_BAR = document.getElementById("progress-bar");
const PROGRESS_BAR_TEXT = document.getElementById("progress-text-value");
const PAGINATION_CONTROLS = document.getElementById("grid-pagination-controls");
const MODAL_PAGINATION_CONTROLS = document.getElementById("modal-pagination-controls");
const PAGE_SIZE = 24;

const colorLookup = {
    Common: "rgb(255, 255, 255)",
    Silver: "rgb(192, 192, 192)",
    Gold: "#9F834C",
    Diamond: "#CCE6FE",
    Rust: "#AA8070",
};

const renderTrophySlots = (inventory, mode, currentPage) => {
    let totalPages = 1;

    //const start = performance.now();
    const container = document.getElementById("grid");
    container.innerHTML = ""; // Clear previous

    const slots = mode !== "inventory" ? generateAllTrophySlots(mode, carData) : generateAllInventorySlots(trophyInventory);
    console.log(slots);

    mode !== "inventory"
        ? inventory.forEach((trophy) => {
              slots.forEach((slot) => {
                  if (matchTrophy(slot, trophy, mode)) {
                      slot._color = slot.color;
                      slot._type = slot.type;
                      slot._year = slot.year;
                      slot._brand = slot.brand;
                      slot._model = slot.model;
                      slot._name = slot.name;
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

    // Pagination logic

    totalPages = Math.ceil(slots.length / PAGE_SIZE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageSlots = slots.slice(startIdx, endIdx);

    pageSlots.forEach((slot) => {
        slot.mode = mode;
        // add reference to original slot data for modal use
        slot._slot = slot;
        // console.log(slot);
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
            <div style="position: relative; width: 100%; height: 100%;">
            <img src="${imgSrc}" alt="${imgColor} ${imgType}" 
            class="${slot.owned ? "" : "locked"}"
            style="border-radius: 8px; position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; z-index: 2; pointer-events: none;">
            <div style="color: whitesmoke; text-align: center; margin-top: 0px; background: rgba(0,0,0,0.5); padding: 2px 4px; border-radius: 4px;">
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

                displayModal(slot._slot, matches, 1);
            }
        });
    });

    renderPaginationControls(PAGINATION_CONTROLS, currentPage, totalPages, (newPage) => {
        renderTrophySlots(inventory, mode, newPage);
    });

    updateTrophyProgress();

    const NEW_TROPHY_ELEMENTS = document.querySelectorAll(".trophy-slot");

    animateCards(NEW_TROPHY_ELEMENTS);
    disableDrag(NEW_TROPHY_ELEMENTS);
};

const displayModal = (slot, matches, currentPage) => {
    // console.log("matches", matches);
    const modal = document.getElementById("slot-trophy-modal");
    const title = document.getElementById("slot-trophy-title");
    const body = document.getElementById("slot-trophy-body");
    title.innerText = `Found ${matches.length} matching ${matches.length === 1 ? "trophy" : "trophies"} for ${slot.name}`;
    body.innerHTML = "";
    if (matches.length === 0) {
        body.innerHTML = "";
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
            <div style="position: relative; width: 100%; height: 100%;">
            <img src="${imgSrc}" alt="${imgColor} ${imgType}" 
            style="border-radius: 8px; position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; z-index: 2; pointer-events: none;">
            <div style="color: whitesmoke; text-align: center; margin-top: 0px; background: rgba(0,0,0,0.5); padding: 2px 4px; border-radius: 4px;">
            <b>${shortYear} ${slot.name}</b><br>
            </div>
            </div>
            </div>
        `;
            card.addEventListener("click", () => {
                carDex.push(trophy);
                console.log(carDex);
                renderTrophySlots(carDex, mode, 1);
                modal.style.display = "none";
                body.innerHTML = "";
                // do nothing for now
                // implement viewing trophy details later
            });
            body.appendChild(card);
        }

        renderPaginationControls(MODAL_PAGINATION_CONTROLS, currentPage, totalPages, (newPage) => {
            displayModal(slot, matches, newPage);
        });
    }
    modal.style.display = "flex";

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            body.innerHTML = "";
        }
    };
    window.onkeydown = function (event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
            body.innerHTML = "";
        }
    };
};

const normalizeTrophyData = (trophy) => {
    return {
        brand: E_CarBrand[trophy.brand] || E_CarBrand["NewEnumerator0"],
        model: E_CarModel[trophy.model] || E_CarModel["NewEnumerator0"],
        color: E_VehiclePaintColor[trophy.paintColor] || E_VehiclePaintColor["NewEnumerator0"],
        type: E_TrophyType[trophy.trophyType] || E_TrophyType["NewEnumerator0"],
        year: parseInt(trophy.productionYear) || 0,
    };
};

const parseTrophyString = (str) => {
    const inside = str.match(/\((.*)\)/)?.[1];
    if (!inside) {
        console.warn("Invalid trophy string format:", str);
        return;
    }

    const entries = inside.split(",");

    const obj = {};
    for (const entry of entries) {
        const [rawKey, value] = entry.split("=");
        if (!rawKey || !value) continue;

        const cleanKey = rawKey.split("_")[0];

        const key = cleanKey.charAt(0).toLowerCase() + cleanKey.slice(1);

        obj[key] = value;
    }

    return normalizeTrophyData(obj);
};

const getAllTrophies = async () => {
    // reset trophy inventory on refresh
    // temporary fix for duplicate trophies showing up in inventory until this gets modularized properly
    trophyInventory = [];
    let items = [];
    // Player owned vehicles loaded in the world
    let playerOwnedVehicles = SaveObject.VehicleSystem.VehicleInfo.filter((v) => v.playerOwned && "Vehicle" in v);
    playerOwnedVehicles.forEach((v) => {
        getMatchingItemsInInventory(v.Vehicle, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));
    });
    // Garage Vehicles
    const garageVehicles = SaveObject.AdditionalGameData.UndergroundGarageCarStorage.VehicleInfo;
    garageVehicles.forEach((v) => {
        getMatchingItemsInInventory(v.garageVehicleJsonData, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));
    });
    // Player Storage
    getMatchingItemsInInventory({ ItemContainer: SaveObject.PlayerStorage }, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));
    // Trophy Shelf
    getMatchingItemsInInventory(SaveObject.AdditionalGameData.TrophyShelf, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));

    for (const item_id in items) {
        trophyInventory.push(parseTrophyString(items[item_id].json.customData));
    }
    console.info(`Found ${trophyInventory.length} trophies in save file.`);
};

// const populateInventoryList = () => {
//     const list = document.getElementById("inventory-list");
//     list.innerHTML = "";
//     trophyInventory.forEach((trophy) => {
//         //console.log(trophy);
//         const div = document.createElement("div");
//         div.textContent = `${trophy.brand} ${trophy.model} - ${trophy.year || "N/A"} - ${trophy.color || "N/A"} - ${trophy.type || "N/A"}`;
//         list.appendChild(div);
//     });
// };

const updateTrophyProgress = () => {
    const slots = generateAllTrophySlots(mode, carData);
    let owned = 0;

    carDex.forEach((trophy) => {
        slots.forEach((slot) => {
            if (matchTrophy(slot, trophy, mode)) {
                slot.owned = true;
                slot.color = trophy.color;
                slot.type = trophy.type;
                slot.year = trophy.year;
            }
        });
    });

    owned = slots.filter((slot) => slot.owned).length;
    const total = slots.length;

    updateProgressBar(owned, total, PROGRESS_BAR_TEXT, PROGRESS_BAR);
};

// Load and read save file

const read_save = async (input) => {
    trophyInventory = [];
    console.info("Reading save file...");
    if (!input.files || input.files.length === 0) {
        console.warn("No file selected");
        return;
    }

    const file = input.files[0];

    db = await getDatabase(file);
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

    await getAllTrophies();
    //renderTrophySlots(trophyInventory, mode, 1);
    updateTrophyProgress();
};

// App interactions
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
    if (!tab.getAttribute("data-mode")) return;
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        mode = tab.getAttribute("data-mode");
        renderTrophySlots(carDex, mode, 1);
        updateTrophyProgress();
    });
});

document.getElementById("versionNumber").innerText = `v${VERSION} (Hotfix ${GAME_VERSION})`;
MEDIA_INPUT.addEventListener("change", (event) => read_save(event.target));

// Initial render
renderTrophySlots(carDex, mode, 1);
updateTrophyProgress();
disableDrag(document.querySelectorAll("*"));
