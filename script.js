import { E_CarBrand, E_CarModel, E_VehiclePaintColor, E_TrophyType } from "./utils/mappings.js";
import { carData } from "./carData.js";
import { disableDrag, getTrophyImage, animateCards, updateProgressBar, renderPaginationControls, generateAllTrophySlots } from "./utils/index.js";

let db = null;
let trophyInventory = [];
let mode = "model"; // Default mode

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
    trophy.brand = E_CarBrand[trophy.brand];
    trophy.model = E_CarModel[trophy.model];
    trophy.color = E_VehiclePaintColor[trophy.color];
    trophy.type = E_TrophyType[trophy.type];
    return trophy;
};

const parseTrophyString = (str) => {
    const match = str.match(/\((.*)\)/);
    if (!match) {
        throw new Error(`No match found: ${match}`);
    }

    const content = match[1];
    const parts = content.split(",");

    let result = {
        brand: "NewEnumerator0",
        model: "NewEnumerator0",
        year: 0,
        color: "NewEnumerator0",
        type: "NewEnumerator0",
    };

    for (const part of parts) {
        let [key, value] = part.split("=");

        if (!key || value === undefined) continue;

        if (key.startsWith("Brand")) {
            result.brand = value;
        } else if (key.startsWith("Model")) {
            result.model = value;
        } else if (key.startsWith("ProductionYear")) {
            result.year = parseInt(value, 10);
        } else if (key.startsWith("PaintColor")) {
            result.color = value;
        } else if (key.startsWith("TrophyType")) {
            result.type = value;
        }
    }

    return normalizeTrophyData(result);
};

const getRawInventory = async () => {
    let items = [];
    const query_result = await db.exec(`SELECT * FROM table_additional_systems`);
    const allVehicles = JSON.parse(query_result[0].values[2][2]).VehicleInfo;
    let playerOwnedVehicles = allVehicles.filter((v) => v.playerOwned && "Vehicle" in v);
    for (let vehicle_id in playerOwnedVehicles) {
        let vehicle = playerOwnedVehicles[vehicle_id];
        let vehicleInventory = JSON.parse(vehicle?.Vehicle?.ItemContainer)?.Items?.itemsJsons;
        for (let item_id in vehicleInventory) {
            let item = vehicleInventory[item_id];
            if (item.productId === "VehicleTrophy") items.push(item);
        }
    }

    const warehouseInventory = JSON.parse(query_result[0].values[6][2]).Items.itemsJsons;
    for (let item_id in warehouseInventory) {
        let item = warehouseInventory[item_id];
        if (item.productId === "VehicleTrophy") items.push(item);
    }

    const trophyCabinetInventory = JSON.parse(JSON.parse(query_result[0].values[3][2]).TrophyShelf.ItemContainer).Items.itemsJsons;

    for (let item_id in trophyCabinetInventory) {
        let item = trophyCabinetInventory[item_id];
        if (item.productId === "VehicleTrophy") items.push(item);
    }

    for (const item_id in items) {
        trophyInventory.push(parseTrophyString(JSON.parse(items[item_id].json).customData));
    }
    //console.log(trophyInventory);
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
    // Calculate progress based on all slots, not just visible ones
    const slots = generateAllTrophySlots(mode, carData);
    let owned = 0;

    // Mark owned slots based on trophyInventory
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

const read_save = async () => {
    const SQL = await initSqlJs({
        locateFile: (file) => `libs/sqljs/${file}`,
    });

    const input = document.getElementById("mediaInput");
    if (!input.files || input.files.length === 0) {
        console.warn("No file selected");
        return;
    }

    const file = input.files[0];
    const buffer = await file.arrayBuffer();

    db = new SQL.Database(new Uint8Array(buffer));

    await getRawInventory();
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
    // You should fill #inventory-list with actual inventory data here
};
document.getElementById("close-inventory").onclick = function () {
    document.getElementById("inventory-modal").style.display = "none";
};

document.getElementById("mediaInput").addEventListener("change", read_save);

// Initial render with no trophies owned
renderTrophySlots([], mode, 1);
updateProgress();
disableDrag(document.querySelectorAll("*"));
