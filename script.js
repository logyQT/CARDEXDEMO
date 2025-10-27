import { renderStats, getStats, createInternalSaveData, getPaginationInfo, sortTrophies, generateRandomTrophy, getSaveObject, getDatabase, disableDrag, generateAllTrophySlots, saveToLocalStorage, loadFromLocalStorage, validateInternalSaveData, removeFromLocalStorage, exportToJSON, importFromJSON, updateTrophyProgress, getAllTrophies, updateOverallTrophyProgress, autoFillTrophySlots, renderSlots, smartSearch } from "./modules/index.js";
import { IMPORT_SAVE_FILE_INPUT, SHARE_BUTTON, IMPORT_SAVE_FILE_BUTTON, PROGRESS_BAR, PROGRESS_BAR_TEXT, PAGINATION_CONTROLS, VERSION_TEXT, RESET_BUTTON, IMPORT_JSON_BUTTON, DOWNLOAD_JSON_BUTTON, TROPHY_AUTOFILL_BUTTON, ADD_TROPHY_BUTTON, SEARCH_BAR, TROPHY_GRID, COPY_SHARE_LINK_BUTTON, CLOSE_SHARE_LINK_BUTTON, SHARE_LINK_CONTAINER, SHARE_LINK_INPUT, AUTOUPDATE_LOCATION_PICKER, SORTING_BUTTONS } from "./utils/domRefs.js";
import { GAME_VERSION, VERSION, VALID_MODES } from "./utils/constants.js";
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
  mode = "model";
  for (const mode in slots) {
    slots[mode] = generateAllTrophySlots(mode, trophyInventory);
  }
  renderSlots(mode, 1, slots, trophyInventory);
  updateTrophyProgress(slots, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR);
  toastManager.push("Save data reset to default.", 3000, "success");
  // console.info("Save data reset.");
});

let typingTimer;
const doneTypingInterval = 500;

SEARCH_BAR.addEventListener("input", () => {
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    renderSlots(mode, 1, slots, trophyInventory);
  }, doneTypingInterval);
});

import { sortHandler } from "./utils/sortHandler.js";

for (const button of SORTING_BUTTONS) {
  button.addEventListener("click", () => {
    const property = button.getAttribute("data-sort");
    button.setAttribute("data-state", (parseInt(button.getAttribute("data-state")) + 1) % 3);
    sortHandler.handlePress(property);
    const _CurrentPage = getPaginationInfo(PAGINATION_CONTROLS).currentPage;
    renderSlots(mode, _CurrentPage, slots, trophyInventory);
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
  slots["inventory"] = generateAllTrophySlots("inventory", trophyInventory);
  renderSlots("inventory", 1, slots, trophyInventory);
  updateOverallTrophyProgress(slots, PROGRESS_BAR_TEXT, PROGRESS_BAR);
});

import { folderWatchdog } from "./utils/autoUpdate/folderWatchdog.js";
import { autoUpdate } from "./utils/autoUpdate/autoUpdate.js";
import { cSaveObject } from "./utils/autoUpdate/cSaveObject.js";
import { getDirHandle, saveDirHandle } from "./utils/fsHandler.js";

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
        toastManager.push("Shareable link copied to clipboard!", 3000, "success");
      },
      (err) => {
        toastManager.push("Failed to copy link to clipboard.", 3000, "error");
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
    toastManager.push("Loaded save data from localStorage.", 2000, "success");
  } else {
    VALID_MODES.forEach((m) => {
      slots[m] = generateAllTrophySlots(m, trophyInventory);
    });
    toastManager.push("No valid saved data found in localStorage.", 2000, "warning");
  }
  renderSlots(mode, 1, slots, trophyInventory);
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
      renderSlots(mode, 1, slots, trophyInventory);
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
trophyImageManager.preloadAll();
