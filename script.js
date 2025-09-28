import { E_CarBrand, E_CarModel, E_VehiclePaintColor, E_TrophyType } from "./utils/mappings.js";
import { carData } from "./carData.js";
import { walkObjectParseJson, getDatabase, disableDrag, getTrophyImage, animateCards, updateProgressBar, renderPaginationControls, generateAllTrophySlots, getMatchingItemsInInventory } from "./utils/index.js";

let db = null;
let SaveObject = {};
let trophyInventory = [];
let mode = "model"; // Default mode
const TROPHY_PRODUCT_ID = "VehicleTrophy";
const MEDIA_INPUT = document.getElementById("mediaInput");

const matchTrophy = (slot, trophy, mode, trophyInventory) => {
    const trophyPriority = ["Common", "Rust", "Silver", "Gold", "Diamond"];
    if (mode === "model") {
        if (slot.brand === trophy.brand && slot.model === trophy.model) {
            if (!slot.owned) {
                return true;
            } else {
                const currentTypeIdx = trophyPriority.indexOf(slot.type || "Common");
                const newTypeIdx = trophyPriority.indexOf(trophy.type || "Common");

                if (newTypeIdx > currentTypeIdx || (newTypeIdx === currentTypeIdx && (trophy.year || 0) > (slot.year || 0))) {
                    return true;
                }
            }
        }
        return false;
    } else if (mode === "year") {
        return slot.brand === trophy.brand && slot.model === trophy.model && slot.year === trophy.year;
    } else if (mode === "color") {
        // Only match if this is the most recent year trophy for this color/model/brand
        if (slot.brand === trophy.brand && slot.model === trophy.model && slot.color === trophy.color && trophy.type === "Common") {
            // Find all trophies for this brand/model/color/type
            const allYears = trophyInventory.filter((t) => t.brand === slot.brand && t.model === slot.model && t.color === slot.color && t.type === "Common").map((t) => t.year || 0);
            const maxYear = Math.max(...allYears);
            return trophy.year === maxYear;
        }
        return false;
    } else if (mode === "type") {
        return slot.brand === trophy.brand && slot.model === trophy.model && slot.type === trophy.type;
    }
    return false;
};

const renderTrophySlots = (inventory, mode, currentPage) => {
    const PAGE_SIZE = 24;
    let totalPages = 1;
    let lastSlots = [];

    //const start = performance.now();
    const container = document.getElementById("grid");
    container.innerHTML = ""; // Clear previous

    const slots = generateAllTrophySlots(mode, carData);
    lastSlots = slots;

    inventory.forEach((trophy) => {
        slots.forEach((slot) => {
            if (matchTrophy(slot, trophy, mode, trophyInventory)) {
                slot.owned = true;
                slot.color = trophy.color;
                slot.type = trophy.type;
                slot.year = trophy.year;
            }
        });
    });

    // Pagination logic
    totalPages = Math.ceil(slots.length / PAGE_SIZE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageSlots = slots.slice(startIdx, endIdx);

    const colorLookup = {
        Black: "#1d1d1dff",
        Silver: "rgb(192, 192, 192)",
        Red: "rgb(255, 0, 0)",
        Blue: "rgb(0, 0, 255)",
        Purple: "rgb(128, 0, 128)",
        NavyBlue: "rgb(0, 0, 128)",
        White: "rgb(255, 255, 255)",
        Gray: "rgb(128, 128, 128)",
        Gold: "#9F834C",
        Green: "rgb(0, 128, 0)",
        Brown: "rgb(139, 69, 19)",
        Orange: "rgb(255, 165, 0)",
        Yellow: "rgb(255, 255, 0)",
        Graphite: "rgb(54, 69, 79)",
        "Light-Blue": "rgb(173, 216, 230)",
        "Light-Green": "rgb(144, 238, 144)",
        Diamond: "#CCE6FE",
        Rust: "#AA8070",
    };

    pageSlots.forEach((slot) => {
        const card = document.createElement("div");
        card.className = slot.owned ? "trophy-slot owned-true" : "trophy-slot owned-false";
        if (slot.owned && slot.type !== "Common") {
            card.style.setProperty("--color", colorLookup[slot.type] || "rgb(40, 189, 26)");
        } else if (slot.owned && slot.color) {
            card.style.setProperty("--color", /*colorLookup[slot.color] ||*/ "rgba(255, 255, 255, 1)");
        }
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
    });

    renderPaginationControls(document.getElementById("pagination-controls"), currentPage, totalPages, (newPage) => {
        renderTrophySlots(inventory, mode, newPage);
    });
    const NEW_TROPHY_ELEMENTS = document.querySelectorAll(".trophy-slot");
    animateCards(NEW_TROPHY_ELEMENTS);
    disableDrag(NEW_TROPHY_ELEMENTS);
};

// Add a container for pagination controls if not present
if (!document.getElementById("pagination-controls")) {
    const grid = document.getElementById("grid");
    const paginationDiv = document.createElement("div");
    paginationDiv.id = "pagination-controls";
    paginationDiv.style = "display: flex; justify-content: center; align-items: center; gap: 1em; margin: 1em 0;";
    grid.parentNode.insertBefore(paginationDiv, grid.nextSibling);
}

const normalizeTrophyData = (trophy) => {
    trophy.brand = E_CarBrand[trophy.brand] || E_CarBrand["NewEnumerator0"];
    trophy.model = E_CarModel[trophy.model] || E_CarModel["NewEnumerator0"];
    trophy.color = E_VehiclePaintColor[trophy.paintColor] || E_VehiclePaintColor["NewEnumerator0"];
    trophy.type = E_TrophyType[trophy.trophyType] || E_TrophyType["NewEnumerator0"];
    trophy.year = parseInt(trophy.productionYear) || 0;
    return trophy;
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
    // Player Storage
    getMatchingItemsInInventory({ ItemContainer: SaveObject.PlayerStorage }, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));
    // Trophy Shelf
    getMatchingItemsInInventory(SaveObject.AdditionalGameData.TrophyShelf, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));

    const garageVehicles = SaveObject.AdditionalGameData.UndergroundGarageCarStorage.VehicleInfo;

    garageVehicles.forEach((v) => {
        getMatchingItemsInInventory(v.garageVehicleJsonData, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));
    });

    for (const item_id in items) {
        trophyInventory.push(parseTrophyString(items[item_id].json.customData));
    }
};

const populateInventoryList = () => {
    const list = document.getElementById("inventory-list");
    list.innerHTML = "";
    trophyInventory.forEach((trophy) => {
        //console.log(trophy);
        const div = document.createElement("div");
        div.textContent = `${trophy.brand} ${trophy.model} - ${trophy.year || "N/A"} - ${trophy.color || "N/A"} - ${trophy.type || "N/A"}`;
        list.appendChild(div);
    });
};

const updateProgress = () => {
    const slots = generateAllTrophySlots(mode, carData);
    let owned = 0;

    trophyInventory.forEach((trophy) => {
        slots.forEach((slot) => {
            if (matchTrophy(slot, trophy, mode, trophyInventory)) {
                slot.owned = true;
                slot.color = trophy.color;
                slot.type = trophy.type;
                slot.year = trophy.year;
            }
        });
    });

    owned = slots.filter((slot) => slot.owned).length;
    const total = slots.length;

    updateProgressBar(owned, total, document.getElementById("percent"), document.getElementById("bar-fill"));
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
    db.each(`SELECT * FROM table_additional_systems`, (row) => {
        SaveObject[row.system_id] = walkObjectParseJson(row.json_content);
    });
    db.close();
    const end = performance.now();
    console.info(`Database query and parsing took ${(end - start).toFixed(2)} ms`);

    console.info("Database loaded successfully.");

    console.info(SaveObject);

    await getAllTrophies();
    renderTrophySlots(trophyInventory, mode, 1);
    populateInventoryList();
    updateProgress();
};

// Site interactions

const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        mode = tab.getAttribute("data-mode");
        renderTrophySlots(trophyInventory, mode, 1);
        updateProgress();
    });
});

document.getElementById("view-inventory-btn").onclick = function () {
    document.getElementById("inventory-modal").style.display = "flex";
};
document.getElementById("close-inventory").onclick = function () {
    document.getElementById("inventory-modal").style.display = "none";
};

MEDIA_INPUT.addEventListener("change", (event) => read_save(event.target));

// Initial render with no trophies owned
renderTrophySlots([], mode, 1);
updateProgress();
disableDrag(document.querySelectorAll("*"));
