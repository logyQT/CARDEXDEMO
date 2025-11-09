import { renderStats, getStats, createInternalSaveData, getPaginationInfo, sortTrophies, getSaveObject, getDatabase, disableDrag, generateAllTrophySlots, saveToLocalStorage, loadFromLocalStorage, validateInternalSaveData, removeFromLocalStorage, exportToJSON, importFromJSON, updateTrophyProgress, getAllTrophies, updateOverallTrophyProgress, autoFillTrophySlots, renderSlots } from "./modules/index.js";
import { SEARCH_OPTIONS_FILTERS, IMPORT_SAVE_FILE_INPUT, SHARE_BUTTON, IMPORT_SAVE_FILE_BUTTON, PROGRESS_BAR, PROGRESS_BAR_TEXT, PAGINATION_CONTROLS, VERSION_TEXT, RESET_BUTTON, IMPORT_JSON_BUTTON, DOWNLOAD_JSON_BUTTON, TROPHY_AUTOFILL_BUTTON, ADD_TROPHY_BUTTON, SEARCH_BAR, TROPHY_GRID, COPY_SHARE_LINK_BUTTON, CLOSE_SHARE_LINK_BUTTON, SHARE_LINK_CONTAINER, SHARE_LINK_INPUT, AUTOUPDATE_LOCATION_PICKER, SORTING_BUTTONS, SEARCH_OPTIONS_BUTTON, SEARCH_OPTIONS_MODAL, CLEAR_SEARCH_OPTIONS_BUTTON, APPLY_SEARCH_OPTIONS_BUTTON } from "./utils/domRefs.js";
import { GAME_VERSION, VERSION, VALID_MODES } from "./utils/constants.js";
import { CONFIG } from "./config/config.js";
import { lockInteraction, unlockInteraction } from "./utils/interactionLock.js";
import { trophyImageManager } from "./utils/trophyImageManager.js";
import { compressTrophySlots, decompressTrophySlots } from "./utils/compressionUtils.js";
import { toastManager } from "./utils/toastManager.js";
import { E_VehiclePaintColor, E_TrophyType, E_VehiclePaintColorHumanReadable } from "./utils/mappings.js";
import { encodeData, decodeData } from "./src/compression/compression.js";
import { folderWatchdog } from "./src/autoUpdate/folderWatchdog.js";
import { autoUpdate } from "./src/autoUpdate/autoUpdate.js";
import { cSaveObject } from "./src/autoUpdate/cSaveObject.js";
import { getDirHandle, saveDirHandle } from "./src/autoUpdate/fsHandler.js";

import { carData } from "./carData.js";
import { MultiSelectDropdown } from "./src/ui/components/MultiSelectDropdown/MultiSelectDropdown.js";

let dropdownBrands = Array.from(new Set(carData.map((car) => car.brand))).map((brand) => {
  const carsOfBrand = carData.filter((car) => car.brand === brand);
  return {
    id: brand.toLowerCase().replace(/\s+/g, "-"),
    label: brand,
    meta: `${carsOfBrand.length} ${carsOfBrand.length === 1 ? "model" : "models"}`,
  };
});

let dropdownModels = carData.map((car) => {
  return {
    id: car.model.toLowerCase().replace(/\s+/g, "-"),
    label: car.model,
    meta: `${car.prodStart} - ${car.prodEnd}`,
  };
});

const availableYears = Array.from({ length: Math.max(...carData.map((c) => c.prodEnd)) - Math.min(...carData.map((c) => c.prodStart)) + 1 }, (_, i) => Math.min(...carData.map((c) => c.prodStart)) + i);
const yearModelCount = {};

carData.forEach((car) => {
  for (let year = car.prodStart; year <= car.prodEnd; year++) {
    yearModelCount[year] = (yearModelCount[year] || 0) + 1;
  }
});
let dropdownYears = availableYears.map((year) => {
  return {
    id: year.toString(),
    label: year.toString(),
    meta: `${yearModelCount[year] || 0} ${yearModelCount[year] === 1 ? "model" : "models"}`,
  };
});

let dropdownColors = Object.entries(E_VehiclePaintColor).map(([key, value]) => {
  return {
    id: value.toLowerCase().replace(/\s+/g, "-"),
    label: E_VehiclePaintColorHumanReadable[key],
    meta: "",
  };
});

let dropdownTypes = Object.entries(E_TrophyType).map(([key, value]) => {
  return {
    id: value.toLowerCase().replace(/\s+/g, "-"),
    label: value,
    meta: "",
  };
});

let dropdownOwned = [
  {
    id: "true",
    label: "Owned",
    meta: "",
  },
  {
    id: "false",
    label: "Missing",
    meta: "",
  },
];

const customStyles = {
  "--dropdown-background": window.getComputedStyle(document.documentElement).getPropertyValue("--tab-background"),
  "--dropdown-background-hover": window.getComputedStyle(document.documentElement).getPropertyValue("--tab-background-hover"),
  "--dropdown-border": window.getComputedStyle(document.documentElement).getPropertyValue("--border"),
  "--dropdown-text": window.getComputedStyle(document.documentElement).getPropertyValue("--text"),
  "--dropdown-accent": window.getComputedStyle(document.documentElement).getPropertyValue("--accent"),
  "--dropdown-shadow": window.getComputedStyle(document.documentElement).getPropertyValue("--shadow"),
};

const brandsDropdown = new MultiSelectDropdown({
  items: dropdownBrands,
  label: "Select Brands",
  id: "brand-filter-dropdown",
  customStyles: customStyles,
});
const modelsDropdown = new MultiSelectDropdown({
  items: dropdownModels,
  label: "Select Models",
  id: "model-filter-dropdown",
  customStyles: customStyles,
});
const yearsDropdown = new MultiSelectDropdown({
  items: dropdownYears,
  label: "Select Years",
  id: "year-filter-dropdown",
  customStyles: customStyles,
});
const colorsDropdown = new MultiSelectDropdown({
  items: dropdownColors,
  label: "Select Colors",
  id: "color-filter-dropdown",
  customStyles: customStyles,
});
const typesDropdown = new MultiSelectDropdown({
  items: dropdownTypes,
  label: "Select Types",
  id: "type-filter-dropdown",
  customStyles: customStyles,
});
const ownedDropdown = new MultiSelectDropdown({
  items: dropdownOwned,
  label: "Select Ownership",
  id: "owned-filter-dropdown",
  customStyles: customStyles,
});

SEARCH_OPTIONS_FILTERS.appendChild(brandsDropdown);
SEARCH_OPTIONS_FILTERS.appendChild(modelsDropdown);
SEARCH_OPTIONS_FILTERS.appendChild(yearsDropdown);
SEARCH_OPTIONS_FILTERS.appendChild(colorsDropdown);
SEARCH_OPTIONS_FILTERS.appendChild(typesDropdown);
SEARCH_OPTIONS_FILTERS.appendChild(ownedDropdown);

CLEAR_SEARCH_OPTIONS_BUTTON.addEventListener("click", () => {
  brandsDropdown.clearSelections();
  modelsDropdown.clearSelections();
  yearsDropdown.clearSelections();
  colorsDropdown.clearSelections();
  typesDropdown.clearSelections();
  ownedDropdown.clearSelections();
  for (const button of SORTING_BUTTONS) {
    button.setAttribute("data-state", "0");
  }
  sortHandler.clearSort();
  toastManager.push("Options cleared", 1500, "success");
});

APPLY_SEARCH_OPTIONS_BUTTON.addEventListener("click", () => {
  SEARCH_OPTIONS_MODAL.classList.remove("active");
  renderSlots(mode, 1, slots, trophyInventory);
});

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

  const _SaveObject = getSaveObject(db);
  db.close();

  return processSaveObject(_SaveObject);
};

const processSaveObject = (SaveObject) => {
  let _trophyInventory = getAllTrophies(SaveObject);
  let _stats = getStats(SaveObject, slots);
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
    else renderSlots(mode, 1, slots, trophyInventory);
    updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    const internalSaveData = createInternalSaveData(VERSION, slots, trophyInventory, stats);
    saveToLocalStorage("internalSaveData", internalSaveData);
  });
});

TROPHY_AUTOFILL_BUTTON.addEventListener("click", () => {
  if (trophyInventory.length === 0) {
    alert("No trophies in inventory to fill the CarDex with.");
    return;
  }
  mode = mode === "inventory" ? "model" : mode;
  slots = autoFillTrophySlots(slots, trophyInventory);
  const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
  renderSlots(mode, _CurrentPage, slots, trophyInventory);
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
      slots = data.slots;
      trophyInventory = data.trophyInventory;
      const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
      renderSlots(mode, _CurrentPage, slots, trophyInventory);
      updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
    });
  }
});

RESET_BUTTON.addEventListener("click", () => {
  removeFromLocalStorage("internalSaveData");
  trophyInventory = [];
  for (const mode in slots) {
    slots[mode] = generateAllTrophySlots(mode, trophyInventory);
  }
  renderSlots(mode, 1, slots, trophyInventory);
  updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
  toastManager.push("Save data reset to default.", 3000, "success");
});

let typingTimer;
const doneTypingInterval = 500;

SEARCH_BAR.addEventListener("input", () => {
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    renderSlots(mode, 1, slots, trophyInventory);
  }, doneTypingInterval);
});

SEARCH_OPTIONS_BUTTON.addEventListener("click", () => {
  SEARCH_OPTIONS_MODAL.classList.toggle("active");
  window.onclick = (event) => {
    if (event.target === SEARCH_OPTIONS_MODAL) SEARCH_OPTIONS_MODAL.classList.remove("active");
  };
  window.onkeydown = (event) => {
    if (event.key === "Escape") SEARCH_OPTIONS_MODAL.classList.remove("active");
  };
});

import { sortHandler } from "./utils/sortHandler.js";
for (const button of SORTING_BUTTONS) {
  button.addEventListener("click", () => {
    const property = button.getAttribute("data-sort");
    button.setAttribute("data-state", (parseInt(button.getAttribute("data-state")) + 1) % 3);
    sortHandler.handlePress(property);
  });
}

VERSION_TEXT.innerText = `v${VERSION} (game ver. ${GAME_VERSION})`;

IMPORT_SAVE_FILE_BUTTON.addEventListener("click", () => {
  navigator.clipboard.writeText("%LOCALAPPDATA%\\CarDealerSimulator\\Saved").then(() => {
    toastManager.push("Path to save folder copied to clipboard!", 3000, "success");
    setTimeout(() => {
      IMPORT_SAVE_FILE_INPUT.click();
    }, 500);
  });
});

IMPORT_SAVE_FILE_INPUT.addEventListener("change", async (event) => {
  const res = await processSaveFile(event.target?.files[0]);
  if (!res) return;
  trophyInventory = res._trophyInventory;
  stats = res._stats;
  mode = "inventory";
  slots[mode] = generateAllTrophySlots(mode, trophyInventory);
  renderSlots(mode, 1, slots, trophyInventory);
  updateOverallTrophyProgress(slots, PROGRESS_BAR_TEXT, PROGRESS_BAR);
  tabs.forEach((tab) => {
    if (!tab.getAttribute("data-mode")) return;
    tabs.forEach((t) => t.classList.remove("active"));
    if (tab.getAttribute("data-mode") === mode) tab.classList.add("active");
  });
});

const update = async (res) => {
  if (!res || !res.handle) return;
  toastManager.push("Changes detected...", 2000, "sync");
  const file = await res.handle.getFile();
  const _saveObject = await cSaveObject(file);
  let _res = processSaveObject(_saveObject);
  let _trophyInventory = _res._trophyInventory;
  if (_trophyInventory.length <= trophyInventory.length) return;
  trophyInventory = _trophyInventory;
  slots["inventory"] = generateAllTrophySlots("inventory", trophyInventory);
  slots = autoFillTrophySlots(slots, trophyInventory);
  const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
  updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
  renderSlots(mode, _CurrentPage, slots, trophyInventory);
  const internalSaveData = createInternalSaveData(VERSION, slots, trophyInventory, stats);
  saveToLocalStorage("internalSaveData", internalSaveData);
  toastManager.push("CarDex updated with new trophies!", 4000, "success");
};

AUTOUPDATE_LOCATION_PICKER.addEventListener("click", async () => {
  let dirHandle;
  dirHandle = await getDirHandle("autoUpdateDirHandle");
  if (!dirHandle) {
    dirHandle = await window.showDirectoryPicker({ mode: "read", startIn: "documents" });
  }
  try {
    const perm = await dirHandle.requestPermission({ mode: "read" });
    if (perm === "granted") {
      if (folderWatchdog.watching) return toastManager.push("AutoUpdate already started.", 4000, "info");
      folderWatchdog.setDirectoryHandle(dirHandle);
      folderWatchdog.startWatching();
      autoUpdate.subscribe(update);
      toastManager.push("Folder access restored for auto-update.", 4000, "success");
      saveDirHandle("autoUpdateDirHandle", dirHandle);
      return;
    } else {
      toastManager.push("Folder access canceled or unsupported.", 4000, "error");
    }
  } catch (err) {
    toastManager.push("Error requesting permission for saved directory handle", 4000, "error");
  }
});

SHARE_BUTTON.addEventListener("click", async () => {
  if (
    Object.entries(slots)
      .filter(([m]) => m !== "inventory")
      .reduce((a, [, s]) => a + Object.values(s).filter((v) => v.owned).length, 0) === 0
  ) {
    toastManager.push("Cannot generate shareable link with no trophies slotted.", 4000, "error");
    return;
  }

  window.onclick = (event) => {
    if (event.target === SHARE_LINK_CONTAINER) SHARE_LINK_CONTAINER.classList.remove("active");
  };
  window.onkeydown = (event) => {
    if (event.key === "Escape") SHARE_LINK_CONTAINER.classList.remove("active");
  };

  function generateURL() {
    const str = encodeData(slots);
    return window.location.origin + window.location.pathname + `#${str}`;
  }

  SHARE_LINK_CONTAINER.classList.add("active");
  SHARE_LINK_INPUT.value = "Generating link, please wait...";
  SHARE_LINK_INPUT.value = generateURL();

  COPY_SHARE_LINK_BUTTON.onclick = () => {
    navigator.clipboard.writeText(SHARE_LINK_INPUT.value).then(
      () => {
        toastManager.push("Shareable link copied to clipboard!", 3000, "success");
      },
      (err) => {
        toastManager.push("Failed to copy link to clipboard.", 3000, "error");
        console.error("Could not copy text: ", err);
      }
    );
  };
  CLOSE_SHARE_LINK_BUTTON.onclick = () => {
    SHARE_LINK_CONTAINER.classList.remove("active");
  };
});

const loadFromLocal = () => {
  const savedData = loadFromLocalStorage("internalSaveData");
  if (validateInternalSaveData(savedData, VERSION)) {
    console.info(savedData);
    slots = savedData.slots;
    trophyInventory = savedData.trophyInventory;
    stats = savedData.stats;
    toastManager.push("Loaded save data from localStorage.", 2000, "success");
  } else {
    VALID_MODES.forEach((m) => {
      slots[m] = generateAllTrophySlots(m, trophyInventory);
    });
    toastManager.push("No valid saved data found in localStorage.", 2000, "warning");
  }
  renderSlots(mode, 1, slots, trophyInventory);
};

if (window.location.hash && window.location.hash.length > 1) {
  TROPHY_GRID.innerHTML = `<p style="text-align: center; font-size: 1.2em; color: #666; grid-column: 1/-1">Loading shared data, please wait...</p>`;
  const hash = window.location.hash.substring(1);
  let decodedData;

  try {
    decodedData = decodeData(hash);
    slots = decodedData;
    renderSlots(mode, 1, slots, trophyInventory);
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    toastManager.push("Shared data loaded successfully!", 4000, "success");
  } catch (err) {
    toastManager.push("Error decoding shared data.", 4000, "error");
    loadFromLocal();
  }
} else {
  loadFromLocal();
}

updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
disableDrag(document.querySelectorAll("*"));
