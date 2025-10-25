import { renderStats, getStats, createInternalSaveData, getPaginationInfo, sortTrophies, generateRandomTrophy, getSaveObject, getDatabase, disableDrag, generateAllTrophySlots, saveToLocalStorage, loadFromLocalStorage, validateInternalSaveData, removeFromLocalStorage, exportToJSON, importFromJSON, updateTrophyProgress, getAllTrophies, updateOverallTrophyProgress, autoFillTrophySlots, renderSlots, smartSearch } from "./modules/index.js";
import { SHARE_BUTTON, IMPORT_SAVE_FILE_BUTTON, PROGRESS_BAR, PROGRESS_BAR_TEXT, PAGINATION_CONTROLS, VERSION_TEXT, RESET_BUTTON, IMPORT_JSON_BUTTON, DOWNLOAD_JSON_BUTTON, TROPHY_AUTOFILL_BUTTON, ADD_TROPHY_BUTTON, SEARCH_BAR, TROPHY_GRID, COPY_SHARE_LINK_BUTTON, CLOSE_SHARE_LINK_BUTTON, SHARE_LINK_CONTAINER, SHARE_LINK_INPUT, AUTOUPDATE_LOCATION_PICKER } from "./utils/domRefs.js";
import { GAME_VERSION, VERSION, PAGE_SIZE, VALID_MODES } from "./utils/constants.js";
import { CONFIG } from "./config/config.js";
import { lockInteraction, unlockInteraction } from "./utils/interactionLock.js";
import { trophyImageManager } from "./utils/trophyImageManager.js";
import { compressTrophySlots, decompressTrophySlots } from "./utils/compressionUtils.js";
import { toastManager } from "./utils/toastManager.js";

let trophyInventory = [];
let slots = {
  model: {},
  year: {},
  color: {},
  type: {},
  inventory: {},
};
let stats = {};
let mode = "model"; // Default mode

// Load and read save file

const processSaveFile = async (file = null) => {
  if (!file) {
    throw new Error("No file selected");
  }

  toastManager.push("Loading save file...", 2000, "info");
  const db = await getDatabase(file);

  if (!db || db.db === null) {
    alert("Failed to open the database. Please ensure a valid save file is selected.");
    return;
  }

  const start = performance.now();
  const _SaveObject = getSaveObject(db);
  db.close();
  const end = performance.now();
  console.info(`Database query and parsing took ${(end - start).toFixed(2)} ms`);

  return processSaveObject(_SaveObject);
};

/**
 * Cleans and formats a raw transaction string into a more readable format.
 * - Car transactions are formatted as: "Buy Car: [Brand] [Model]", "Sell Car: [Brand] [Model]",
 * or "[Service Name]: [Brand] [Model]".
 * - Loan repayments are formatted as: "Loan Repayment: [x]/[y]".
 * - Simple transactions extract the core name (e.g., "MOBICASH_FUEL" -> "Fuel").
 * - Loan transactions with amounts are formatted as "Loan Transaction: [Amount]".
 *
 * @param {string} str The raw transaction name string.
 * @returns {string} The cleaned and formatted transaction string.
 */
const cleanString = (str) => {
  const complexCarMatch = str.match(/"\{(sell car|Buy Car)\}: \{brand\} \{mode\}".*?"brand",\s*INVTEXT\("([^"]+)"\),\s*"mode",\s*INVTEXT\("([^"]+)"\)/);
  if (complexCarMatch) {
    const operation = complexCarMatch[1].replace(" car", " Car");
    const brand = complexCarMatch[2];
    const model = complexCarMatch[3];
    return `${operation}: ${brand} ${model}`;
  }

  const simpleCarServiceMatch = str.match(/INVTEXT\("([^"]+): ([^"]+) ([^"]+)"\)/);

  if (simpleCarServiceMatch) {
    const service = simpleCarServiceMatch[1];
    const brand = simpleCarServiceMatch[2];
    const model = simpleCarServiceMatch[3];
    return `${service}: ${brand} ${model}`;
  }

  const genericInvtextMatch = str.match(/INVTEXT\("([^"]+)"\)$/);
  if (genericInvtextMatch) {
    return genericInvtextMatch[1];
  }

  const loanRepaymentMatch = str.match(/LOAN_TRANSACTION_NAME\{x\}"\),\s*"x",\s*LOCGEN_FORMAT_NAMED\(NSLOCTEXT\(.*?"x",\s*(\d+),\s*"y",\s*(\d+)\)\)/);
  if (loanRepaymentMatch) {
    return `Loan Repayment: ${loanRepaymentMatch[1]}/${loanRepaymentMatch[2]}`;
  }

  const loanAmountMatch = str.match(/LOAN_TRANSACTION_NAME2?\{x\}"\),\s*"x",\s*([0-9\.]+)\)/);
  if (loanAmountMatch) {
    return `Loan Transaction: ${loanAmountMatch[1]}`;
  }

  const simpleMatch = str.match(/"([A-Z0-9_]+)"\)$/);

  if (simpleMatch) {
    let rawName = simpleMatch[1];

    let cleanName = rawName.replace(/^(MOBICASH_|MOBYCASH_|CASHMOBI_)/, "");

    cleanName = cleanName
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (cleanName.startsWith("Loan Transaction Name")) {
      return "Loan Transaction";
    }

    return cleanName;
  }

  return str;
};

const processSaveObject = (SaveObject) => {
  let _trophyInventory = getAllTrophies(SaveObject);
  let _stats = getStats(SaveObject, slots);

  // let rawTransactions = SaveObject.Economy.moneyTransactions;
  // let processedTransactions = [];

  // const start = performance.now();
  // for (const tx of rawTransactions) {
  //   processedTransactions.push({
  //     amount: tx.amount,
  //     name: cleanString(tx.name),
  //   });
  // }

  // const end = performance.now();
  // console.info(`Processed ${rawTransactions.length} transactions in ${(end - start).toFixed(2)} ms`);
  // console.log(processedTransactions);

  // const spentOnCars = processedTransactions.filter((tx) => tx.name.startsWith("Buy Car")).reduce((sum, tx) => sum + tx.amount, 0);
  // console.log(`Total spent on cars: $${spentOnCars.toLocaleString()}`);
  // const soldCarsIncome = processedTransactions.filter((tx) => tx.name.startsWith("sell Car")).reduce((sum, tx) => sum + tx.amount, 0);
  // console.log(`Total income from sold cars: $${soldCarsIncome.toLocaleString()}`);
  // // const profitFromCars = soldCarsIncome - spentOnCars;
  // // console.log(`Total profit from cars: $${profitFromCars.toLocaleString()}`);
  // const otherCosts = processedTransactions.filter((tx) => !tx.name.startsWith("Buy Car") && !tx.name.startsWith("sell Car") && !tx.name.startsWith("Loan Transaction") && !tx.name.startsWith("Car Crusher") && tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0);
  // console.log(`Total other costs/income: $${otherCosts.toLocaleString()}`);
  // const spentOnCrushing = processedTransactions.filter((tx) => tx.name === "Car Crusher").reduce((sum, tx) => sum + tx.amount, 0);
  // console.log(`Total spent on crushing: $${spentOnCrushing.toLocaleString()}`);
  // console.log(`Total spent on trophies: ~$${(soldCarsIncome + otherCosts + spentOnCars - spentOnCrushing).toLocaleString()}`);

  _trophyInventory = sortTrophies(_trophyInventory, ["type", "model", "year", "color"]);
  return { _trophyInventory, _stats };
};

// App interactions
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
  if (!tab.getAttribute("data-mode")) return;
  tab.addEventListener("click", () => {
    if (tab.classList.contains("active")) return;
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    mode = tab.getAttribute("data-mode");
    SEARCH_BAR.value = "";
    if (mode === "stats") renderStats(stats, 1);
    else renderSlots(slots[mode], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
    updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    const internalSaveData = createInternalSaveData(VERSION, slots, trophyInventory, stats);
    saveToLocalStorage("internalSaveData", internalSaveData);
  });
});

ADD_TROPHY_BUTTON.style.display = "none"; // Hide the button as per version 2.0.5 changes
ADD_TROPHY_BUTTON.addEventListener("click", () => {
  trophyInventory.push(generateRandomTrophy());
  trophyInventory = sortTrophies(trophyInventory, ["type", "model", "year", "color"]);
  slots["inventory"] = generateAllTrophySlots("inventory", trophyInventory);
  renderSlots(slots["inventory"], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
  updateOverallTrophyProgress(slots, PROGRESS_BAR_TEXT, PROGRESS_BAR);
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
  const internalSaveData = createInternalSaveData(VERSION, slots, trophyInventory, stats);
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

SEARCH_BAR.addEventListener("input", () => {
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    renderSlots(smartSearch(SEARCH_BAR.value.trim(), slots[mode]), TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
  }, doneTypingInterval);
});

VERSION_TEXT.innerText = `v${VERSION} (game ver. ${GAME_VERSION})`;
IMPORT_SAVE_FILE_BUTTON.addEventListener("change", async (event) => {
  const res = await processSaveFile(event.target?.files[0]);
  if (!res) return;
  trophyInventory = res._trophyInventory;
  stats = res._stats;
  slots["inventory"] = generateAllTrophySlots("inventory", trophyInventory);
  renderSlots(slots["inventory"], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
  updateOverallTrophyProgress(slots, PROGRESS_BAR_TEXT, PROGRESS_BAR);
});

import { folderWatchdog } from "./utils/autoUpdate/folderWatchdog.js";
import { autoUpdate } from "./utils/autoUpdate/autoUpdate.js";
import { cSaveObject } from "./utils/autoUpdate/cSaveObject.js";

const update = async (res) => {
  if (!res || !res.handle) return;
  toastManager.push("Changes detected...", 2000, "sync");
  const file = await res.handle.getFile();
  const _saveObject = await cSaveObject(file);
  let _res = processSaveObject(_saveObject);
  let _trophyInventory = _res._trophyInventory;
  if (_trophyInventory.length <= trophyInventory.length) return;
  //toastManager.push("New trophies detected...", 3000, "sync");
  trophyInventory = _trophyInventory;
  slots["inventory"] = generateAllTrophySlots("inventory", trophyInventory);
  slots = autoFillTrophySlots(slots, trophyInventory);
  const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
  updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
  if (SEARCH_BAR.value.trim() !== "") {
    renderSlots(smartSearch(SEARCH_BAR.value.trim(), slots[mode]), TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
  } else {
    renderSlots(slots[mode], TROPHY_GRID, _CurrentPage, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
  }
  const internalSaveData = createInternalSaveData(VERSION, slots, trophyInventory, stats);
  saveToLocalStorage("internalSaveData", internalSaveData);
  toastManager.push("CarDex updated with new trophies!", 4000, "success");
};

AUTOUPDATE_LOCATION_PICKER.addEventListener("click", async () => {
  let dirHandle;
  try {
    dirHandle = await window.showDirectoryPicker({ mode: "read" });
    if (folderWatchdog.watching) return toastManager.push("AutoUpdate already started.", 4000, "info");
    folderWatchdog.setDirectoryHandle(dirHandle);
    folderWatchdog.startWatching();
    toastManager.push("Folder selected for auto-update.", 4000, "success");
  } catch (err) {
    toastManager.push("Folder access canceled or unsupported.", 4000, "error");
    return;
  }
  if (!dirHandle) {
    toastManager.push("No folder selected for auto-update.", 4000, "error");
    return;
  }
  autoUpdate.subscribe(update);
});

SHARE_BUTTON.addEventListener("click", async () => {
  if (
    Object.entries(slots)
      .filter(([m]) => m !== "inventory")
      .reduce((a, [, s]) => a + Object.values(s).filter((v) => v.owned).length, 0) === 0
  ) {
    alert("Cannot generate shareable link with no trophies slotted.");
    return;
  }

  lockInteraction();
  async function generateCardexUrl(slots) {
    const json = {
      slots: {
        0: compressTrophySlots(slots.model),
        1: compressTrophySlots(slots.year),
        2: compressTrophySlots(slots.color),
        3: compressTrophySlots(slots.type),
      },
      v: VERSION,
    };
    //console.log("Compressed data:", json);
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
    stats = savedData.stats;
    // console.log(stats);
    toastManager.push("Loaded save data from localStorage.", 2000, "success");
  } else {
    VALID_MODES.forEach((m) => {
      slots[m] = generateAllTrophySlots(m, trophyInventory);
    });
    toastManager.push("No valid saved data found in localStorage.", 2000, "warning");
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
    if (JSON.parse(decompressed).v === VERSION) {
      const parsed = JSON.parse(decompressed);

      slots = {
        model: decompressTrophySlots(parsed.slots["0"]),
        year: decompressTrophySlots(parsed.slots["1"]),
        color: decompressTrophySlots(parsed.slots["2"]),
        type: decompressTrophySlots(parsed.slots["3"]),
        inventory: slots.inventory,
      };
      //console.log("Decompressed data:", slots);
      unlockInteraction();
      renderSlots(slots["model"], TROPHY_GRID, 1, PAGE_SIZE, PAGINATION_CONTROLS, slots, trophyInventory);
    } else {
      unlockInteraction();
      loadFromLocal();
      alert("The shared data version is incompatible with the current app version.");
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
trophyImageManager.registerAll();
await trophyImageManager.preloadAll();
