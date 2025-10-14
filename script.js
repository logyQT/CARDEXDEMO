import {
    createInternalSaveData,
    getPaginationInfo,
    sortTrophies,
    generateRandomTrophy,
    getSaveObject,
    getDatabase,
    disableDrag,
    generateAllTrophySlots,
    saveToLocalStorage,
    loadFromLocalStorage,
    validateInternalSaveData,
    removeFromLocalStorage,
    exportToJSON,
    importFromJSON,
    updateTrophyProgress,
    getAllTrophies,
    updateOverallTrophyProgress,
    autoFillTrophySlots,
    renderSlots,
} from "./modules/index.js";

import {
    SHARE_BUTTON,
    IMPORT_SAVE_FILE_BUTTON,
    PROGRESS_BAR,
    PROGRESS_BAR_TEXT,
    PAGINATION_CONTROLS,
    VERSION_TEXT,
    RESET_BUTTON,
    IMPORT_JSON_BUTTON,
    DOWNLOAD_JSON_BUTTON,
    TROPHY_AUTOFILL_BUTTON,
    ADD_TROPHY_BUTTON,
    SEARCH_BAR,
    TROPHY_GRID,
    COPY_SHARE_LINK_BUTTON,
    CLOSE_SHARE_LINK_BUTTON,
    SHARE_LINK_CONTAINER,
    SHARE_LINK_INPUT,
} from "./utils/domRefs.js";

import { GAME_VERSION, VERSION, PAGE_SIZE, VALID_MODES } from "./utils/constants.js";
import { smartSearch } from "./modules/search.js";
import { CONFIG } from "./config/config.js";
import { lockInteraction, unlockInteraction } from "./utils/interactionLock.js";

/**
 * @type {import("./utils/types.js").SaveObjectRoot}
 */
let SaveObject = {};
let trophyInventory = [];
let slots = {
    model: {},
    year: {},
    color: {},
    type: {},
    inventory: {},
};
let mode = "model"; // Default mode

// Load and read save file

const read_save = async (input) => {
    console.info("Reading save file...");
    if (!input.files || input.files.length === 0) {
        console.warn("No file selected");
        return;
    }

    const file = input.files[0];

    const db = await getDatabase(file);

    if (!db || db.db === null) {
        alert("Failed to open the database. Please ensure a valid save file is selected.");
        return;
    }

    const start = performance.now();
    SaveObject = getSaveObject(db);
    db.close();
    const end = performance.now();
    console.info(`Database query and parsing took ${(end - start).toFixed(2)} ms`);
    console.info("Database loaded successfully.");
    // console.info(SaveObject);

    trophyInventory = getAllTrophies(SaveObject);
    trophyInventory = sortTrophies(trophyInventory, ["type", "model", "year", "color"]);
    //console.log(trophyInventory);

    slots["inventory"] = generateAllTrophySlots("inventory", trophyInventory);
    renderSlots(slots["inventory"], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
    updateOverallTrophyProgress(slots, PROGRESS_BAR_TEXT, PROGRESS_BAR);
};

// App interactions
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
    if (!tab.getAttribute("data-mode")) return;
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        mode = tab.getAttribute("data-mode");
        SEARCH_BAR.value = "";
        renderSlots(slots[mode], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
        updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    });
});

ADD_TROPHY_BUTTON.addEventListener("click", () => {
    trophyInventory.push(generateRandomTrophy());
    trophyInventory = sortTrophies(trophyInventory, ["type", "model", "year", "color"]);
    slots["inventory"] = generateAllTrophySlots("inventory", trophyInventory);
    renderSlots(slots["inventory"], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
    updateOverallTrophyProgress(slots, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    const internalSaveData = createInternalSaveData(VERSION, slots, trophyInventory);
    saveToLocalStorage("internalSaveData", internalSaveData);
});

TROPHY_AUTOFILL_BUTTON.addEventListener("click", () => {
    if (trophyInventory.length === 0) {
        alert("No trophies in inventory to fill the CarDex with.");
        return;
    }
    mode = mode === "inventory" ? "model" : mode;
    slots = autoFillTrophySlots(slots, trophyInventory);
    const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
    renderSlots(slots[mode], TROPHY_GRID, _CurrentPage, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
    updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
});

DOWNLOAD_JSON_BUTTON.addEventListener("click", () => {
    const internalSaveData = createInternalSaveData(VERSION, slots, trophyInventory);
    exportToJSON(internalSaveData);
});

IMPORT_JSON_BUTTON.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        importFromJSON(file, (data) => {
            console.info("Imported data:", data);
            slots = data.slots;
            trophyInventory = data.trophyInventory;
            const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
            renderSlots(slots[mode], TROPHY_GRID, _CurrentPage, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
            updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
        });
    }
});

RESET_BUTTON.addEventListener("click", () => {
    removeFromLocalStorage("internalSaveData");
    trophyInventory = [];
    mode = "model";
    for (const mode in slots) {
        slots[mode] = generateAllTrophySlots(mode, trophyInventory);
    }
    renderSlots(slots[mode], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
    updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    console.info("Save data reset.");
});

let typingTimer;
const doneTypingInterval = 500;
SEARCH_BAR.addEventListener("input", (event) => {
    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        const query = event.target.value.trim();

        renderSlots(smartSearch(query, slots[mode]), TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
    }, doneTypingInterval);
});

VERSION_TEXT.innerText = `v${VERSION} (game ver. ${GAME_VERSION})`;
IMPORT_SAVE_FILE_BUTTON.addEventListener("change", (event) => read_save(event.target));

import { compressTrophySlotsObject, decompressTrophySlotsObject } from "./utils/compressionUtils.js";

SHARE_BUTTON.addEventListener("click", async () => {
    lockInteraction();
    async function generateCardexUrl(slots) {
        const json = {
            slots: {
                0: compressTrophySlotsObject(slots.model),
                1: compressTrophySlotsObject(slots.year),
                2: compressTrophySlotsObject(slots.color),
                3: compressTrophySlotsObject(slots.type),
            },
            v: VERSION,
        };
        console.log("Compressed data:", json);
        const jsonStr = JSON.stringify(json);
        const compressed = LZString.compressToEncodedURIComponent(jsonStr);
        const saveStr = `#${compressed}`;

        async function getLink(str) {
            try {
                const response = await fetch(`${CONFIG.API_URL}/api/addItem`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ str: str }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                return result;
            } catch (err) {
                console.error("Failed to add item:", err);
            }
        }

        const result = await getLink(saveStr);
        if (result && result?.data?.id) {
            unlockInteraction();
            return `https://logyqt.github.io/CARDEXDEMO/#${result.data.id}`;
        } else {
            unlockInteraction();
            return "Failed to generate shareable link. Please try again later.";
        }
    }

    SHARE_LINK_CONTAINER.style.display = "flex";
    SHARE_LINK_INPUT.value = "Generating link, please wait...";
    SHARE_LINK_INPUT.value = await generateCardexUrl(slots);

    COPY_SHARE_LINK_BUTTON.onclick = () => {
        navigator.clipboard.writeText(SHARE_LINK_INPUT.value).then(
            () => {
                alert("Link copied to clipboard!");
            },
            (err) => {
                console.error("Could not copy text: ", err);
            }
        );
    };
    CLOSE_SHARE_LINK_BUTTON.onclick = () => {
        SHARE_LINK_CONTAINER.style.display = "none";
    };
});

const loadFromLocal = () => {
    const savedData = loadFromLocalStorage("internalSaveData");
    if (validateInternalSaveData(savedData, VERSION)) {
        console.info(savedData);
        slots = savedData.slots;
        trophyInventory = savedData.trophyInventory;
        console.info("Loaded saved data from localStorage.");
    } else {
        VALID_MODES.forEach((m) => {
            slots[m] = generateAllTrophySlots(m, trophyInventory);
        });
        console.warn("No valid saved data found in localStorage.");
    }
    renderSlots(slots[mode], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
};

const fetchSharedData = async (id) => {
    const response = await fetch(`${CONFIG.API_URL}/api/getItem/?id=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
};

if (window.location.hash && window.location.hash.length > 1) {
    lockInteraction();
    TROPHY_GRID.innerHTML = `<p style="text-align: center; font-size: 1.2em; color: #666; grid-column: 1/-1">Loading shared data, please wait...</p>`;
    const hash = window.location.hash.substring(1);
    let fetchedData;

    try {
        fetchedData = await fetchSharedData(hash);
    } catch (err) {
        console.error("Error fetching shared data:", err);
        unlockInteraction();
    }

    if (fetchedData && fetchedData?.data?.str) {
        const decompressed = LZString.decompressFromEncodedURIComponent(fetchedData.data.str.slice(1));
        window.location.hash = "";
        if (decompressed) {
            const parsed = JSON.parse(decompressed);

            slots = {
                model: decompressTrophySlotsObject(parsed.slots["0"]),
                year: decompressTrophySlotsObject(parsed.slots["1"]),
                color: decompressTrophySlotsObject(parsed.slots["2"]),
                type: decompressTrophySlotsObject(parsed.slots["3"]),
                inventory: slots.inventory,
            };
            console.log("Decompressed data:", slots);
            unlockInteraction();
            renderSlots(slots["model"], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
        }
    } else {
        loadFromLocal();
        alert("Failed to load shared data. The link may be invalid or the data has been removed.");
    }
} else {
    loadFromLocal();
}

updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
disableDrag(document.querySelectorAll("*"));
