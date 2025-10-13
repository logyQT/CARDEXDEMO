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
const doneTypingInterval = 500; // ms
SEARCH_BAR.addEventListener("input", (event) => {
    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        const query = event.target.value.trim();

        renderSlots(smartSearch(query, slots[mode]), TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
    }, doneTypingInterval);
});

SHARE_BUTTON.addEventListener("click", async () => {
    const modelToNum = {
        striker: 0,
        vanguard: 1,
        ignis: 2,
        p2: 3,
        p3: 4,
        p4: 5,
        "280g": 6,
        allegretto: 7,
        andante: 8,
        largo: 9,
        pulse: 10,
        boulder: 11,
        canyon: 12,
        ridge: 13,
        cortega: 14,
        gale: 15,
        thunder: 16,
        thunderx: 17,
        voyager: 18,
        "600c": 19,
        journey: 20,
    };
    const brandToNum = { "apex motors": 0, ardena: 1, "cargo wise": 2, cavallaro: 3, "harmonia vehicles": 4, ngd: 5, "off rider": 6, phantom: 7, umx: 8, "zen motors": 9 };
    const modeToNum = { model: 0, year: 1, color: 2, type: 3 };
    const colorToNum = { null: 0, black: 1, silver: 2, red: 3, blue: 4, purple: 5, navyblue: 6, white: 7, gray: 8, gold: 9, green: 10, brown: 11, orange: 12, yellow: 13, graphite: 14, "light-blue": 15, "light-green": 16 };
    const typeToNum = { null: 0, common: 1, rust: 2, silver: 3, gold: 4, diamond: 5 };
    const shortYear = (year) => {
        if (!year || typeof year !== "number") return 0;
        if (year < 2000) {
            return year - 1900;
        }
        return year - 2000;
    };
    function minifyID(id) {
        const parts = id.replace(/_/g, " ").split("+");
        let [mode, brand, model, year, color, type] = parts;
        let str = `${modeToNum[mode]}+${brandToNum[brand]}+${modelToNum[model]}`;
        if (year === "null") str += `+-1`;
        else str += `+${shortYear(Number(year))}`;
        str += `+${colorToNum[color]}`;
        str += `+${typeToNum[type]}`;
        return str;
    }
    function minifyObj(obj) {
        const minified = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const mkey = minifyID(key);
                // minified[mkey] = {
                //     m: modelToNum[(obj[key].model ?? "").toLowerCase()],
                //     b: brandToNum[(obj[key].brand ?? "").toLowerCase()],
                //     o: obj[key].owned ? 1 : 0,
                // };
                // if (obj[key].year) minified[mkey].y = shortYear(obj[key].year);
                // if (obj[key].color) minified[mkey].c = colorToNum[(obj[key].color ?? "").toLowerCase()];
                // if (obj[key].type) minified[mkey].t = typeToNum[(obj[key].type ?? "").toLowerCase()];
                let { brand, model, year, color, type, owned } = obj[key];
                let str = `${brandToNum[(brand ?? "").toLowerCase()]}+${modelToNum[(model ?? "").toLowerCase()]}`;
                if (year === null) str += `+0`;
                else str += `+${shortYear(Number(year))}`;
                if (color === null) str += `+0`;
                else str += `+${colorToNum[(color ?? "").toLowerCase()]}`;
                if (type === null) str += `+0`;
                else str += `+${typeToNum[(type ?? "").toLowerCase()]}`;
                str += `+${owned ? 1 : 0}`;
                minified[mkey] = str;
            }
        }
        return minified;
    }
    async function generateCardexUrl(slots) {
        const json = {
            slots: {
                0: minifyObj(slots.model),
                1: minifyObj(slots.year),
                2: minifyObj(slots.color),
                3: minifyObj(slots.type),
            },
            v: VERSION,
        };
        //console.log(json);
        const jsonStr = JSON.stringify(json);
        const compressed = LZString.compressToEncodedURIComponent(jsonStr);
        const saveStr = `#${compressed}`;

        async function getLink(str) {
            try {
                const response = await fetch("https://cardex-api.vercel.app/api/addItem", {
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
            return `https://logyqt.github.io/CARDEXDEMO/#${result.data.id}`;
        } else {
            alert("Failed to generate shareable link. Please try again later.");
            return null;
        }
    }

    const shareUrl = await generateCardexUrl(slots);
    if (shareUrl) {
        SHARE_LINK_INPUT.value = shareUrl;
        SHARE_LINK_CONTAINER.style.display = "flex";
    }
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

VERSION_TEXT.innerText = `v${VERSION} (game ver. ${GAME_VERSION})`;
IMPORT_SAVE_FILE_BUTTON.addEventListener("change", (event) => read_save(event.target));

if (window.location.hash && window.location.hash.length > 1) {
    const hash = window.location.hash.substring(1);
    async function fetchSharedData(id) {
        try {
            const response = await fetch(`https://cardex-api.vercel.app/api/getItem/?id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            return result;
        } catch (err) {
            console.error("Failed to fetch shared data:", err);
            return null;
        }
    }
    fetchSharedData(hash).then((data) => {
        //console.log(data);
        if (data && data?.data?.str) {
            //console.log("Fetched shared data string:", data.data.str.slice(1));
            const decompressed = LZString.decompressFromEncodedURIComponent(data.data.str.slice(1));
            window.location.hash = "";
            if (decompressed) {
                const parsed = JSON.parse(decompressed);

                function restoreData(minified) {
                    const numToModel = {
                        0: "Striker",
                        1: "Vanguard",
                        2: "Ignis",
                        3: "P2",
                        4: "P3",
                        5: "P4",
                        6: "280G",
                        7: "Allegretto",
                        8: "Andante",
                        9: "Largo",
                        10: "Pulse",
                        11: "Boulder",
                        12: "Canyon",
                        13: "Ridge",
                        14: "Cortega",
                        15: "Gale",
                        16: "Thunder",
                        17: "ThunderX",
                        18: "Voyager",
                        19: "600C",
                        20: "Journey",
                    };
                    const numToBrand = { 0: "Apex Motors", 1: "Ardena", 2: "Cargo Wise", 3: "Cavallaro", 4: "Harmonia Vehicles", 5: "NGD", 6: "Off Rider", 7: "Phantom", 8: "UMX", 9: "Zen Motors" };
                    const numToColor = { 0: null, 1: "Black", 2: "Silver", 3: "Red", 4: "Blue", 5: "Purple", 6: "NavyBlue", 7: "White", 8: "Gray", 9: "Gold", 10: "Green", 11: "Brown", 12: "Orange", 13: "Yellow", 14: "Graphite", 15: "Light-Blue", 16: "Light-Green" };
                    const numToType = { 0: null, 1: "Common", 2: "Rust", 3: "Silver", 4: "Gold", 5: "Diamond" };
                    const restored = {};
                    function restoreID(id) {
                        const parts = id.split("+");
                        const modeToStr = { 0: "model", 1: "year", 2: "color", 3: "type" };
                        let str = "";
                        str += modeToStr[parts[0]];
                        str += `+${numToBrand[parts[1]]}`;
                        str += `+${numToModel[parts[2]]}`;
                        if (parts[3] === "0") str += `+null`;
                        else {
                            const yearNum = Number(parts[3]);
                            let fullYear = yearNum + (yearNum <= 10 ? 2000 : 1900);
                            if (yearNum === -1) fullYear = null;
                            str += `+${fullYear}`;
                        }
                        if (parts[4] === "0") str += `+null`;
                        else str += `+${numToColor[parts[4]]}`;
                        if (parts[5] === "0") str += `+null`;
                        else str += `+${numToType[parts[5]]}`;
                        return str.toLowerCase().replace(/ /g, "_");
                    }
                    for (const mkey in minified) {
                        if (minified.hasOwnProperty(mkey)) {
                            const key = restoreID(mkey);
                            const parts = minified[mkey].split("+");

                            const name = `${numToBrand[parts[0]]} ${numToModel[parts[1]]}`;
                            const brand = numToBrand[parts[0]];
                            const model = numToModel[parts[1]];
                            const year = parts[2] === "-1" ? null : Number(parts[2]) + (Number(parts[2]) <= 10 ? 2000 : 1900);
                            const color = numToColor[parts[3]];
                            const type = numToType[parts[4]];
                            const owned = parts[5] === "1" ? true : false;
                            restored[key] = { name, model, brand, year, color, type, owned };
                        }
                    }
                    return restored;
                }
                //console.log("Decompressed shared data:", parsed);
                slots = {
                    model: restoreData(parsed.slots["0"]),
                    year: restoreData(parsed.slots["1"]),
                    color: restoreData(parsed.slots["2"]),
                    type: restoreData(parsed.slots["3"]),
                    inventory: slots.inventory,
                };
                renderSlots(slots["model"], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
            }
        }
    });
} else {
    console.info("No shareable link hash found in URL.");
}

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
updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
disableDrag(document.querySelectorAll("*"));
