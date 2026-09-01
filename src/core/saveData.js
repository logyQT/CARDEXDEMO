const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
};

const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Error loading from localStorage", e);
    return null;
  }
};

const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Error removing from localStorage", e);
  }
};

const createInternalSaveData = (versionNumber, slots, trophyInventory, stats) => {
  const { totalTrophies, nextMilestone } = stats;
  return {
    version: versionNumber,
    timestamp: Date.now(),
    slots,
    trophyInventory,
    stats: { ...stats, totalTrophies, nextMilestone },
  };
};

const isValidSaveData = (data) =>
  !!data &&
  typeof data === "object" &&
  typeof data.version === "string" &&
  typeof data.timestamp === "number" &&
  typeof data.slots === "object" &&
  Array.isArray(data.trophyInventory) &&
  typeof data.stats === "object";

const validateInternalSaveData = (data, ver) => isValidSaveData(data) && ver === data.version;

const exportToJSON = (saveData) => {
  if (!saveData) {
    console.error("No save data found.");
    return;
  }
  const blob = new Blob([JSON.stringify(saveData)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "saveData.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const importFromJSON = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (typeof callback === "function") callback(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };
  reader.readAsText(file);
};

export { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage, createInternalSaveData, validateInternalSaveData, exportToJSON, importFromJSON };
