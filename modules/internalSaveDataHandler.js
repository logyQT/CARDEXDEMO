/**
 * @typedef {Object} SaveDataRoot
 * @property {string} version - The version of the save data format.
 * @property {number} timestamp - The timestamp when the save data was created.
 * @property {Object<string, Object>} slots - The slots object containing trophy slot data.
 * @property {Array<Object>} trophyInventory - The array of trophy objects in the inventory.
 */

/**
 * Creates an internal save data object.
 * @param {string} versionNumber // self-explanatory
 * @param {Object} slots // Array of car objects
 * @param {Array<Object>} trophyInventory // Array of trophy objects
 * @returns {SaveDataRoot} Internal save data object
 */
const createInternalSaveData = (versionNumber, slots, trophyInventory) => {
  return {
    version: versionNumber,
    timestamp: Date.now(),
    slots: slots,
    trophyInventory: trophyInventory,
  };
};

/**
 *
 * @param {SaveDataRoot} data
 * @returns
 */
const readInternalSaveData = (data) => {
  if (!data || typeof data !== "object") {
    console.error("Invalid data format");
    return null;
  }
  const { version, timestamp, slots, trophyInventory } = data;
  if (typeof version !== "string" || typeof timestamp !== "number" || typeof slots !== "object" || !Array.isArray(trophyInventory)) {
    console.error("Missing or invalid fields in data");
    return null;
  }
  return {
    version,
    timestamp,
    slots,
    trophyInventory,
  };
};

const validateInternalSaveData = (data, ver) => {
  if (!data || typeof data !== "object") {
    return false;
  }

  const { version, timestamp, slots, trophyInventory } = data;
  if (typeof version !== "string" || typeof timestamp !== "number" || typeof slots !== "object" || !Array.isArray(trophyInventory)) {
    return false;
  }

  return ver === version;
};

export { createInternalSaveData, readInternalSaveData, validateInternalSaveData };
